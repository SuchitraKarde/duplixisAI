from __future__ import annotations

import json
import math
import os
import re
import time
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

try:
    from sentence_transformers import SentenceTransformer  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    SentenceTransformer = None


TOKEN_RE = re.compile(r"\w+", re.UNICODE)
COMMON_STOPWORDS = {
    "the",
    "and",
    "for",
    "with",
    "from",
    "that",
    "this",
    "customer",
    "company",
    "account",
    "record",
    "client",
}
MAX_BUCKET_SIZE = 80
MAX_TOKEN_BUCKET_DF = 120
MAX_TOKENS_PER_RECORD = 4

_EMBEDDER: "Embedder | None" = None

LANGUAGE_HINTS = {
    "en": re.compile(r"[a-zA-Z]"),
    "hi": re.compile(r"[\u0900-\u097F]"),
    "mr": re.compile(r"[\u0900-\u097F]"),
    "ja": re.compile(r"[\u3040-\u30FF\u4E00-\u9FFF]"),
    "zh": re.compile(r"[\u4E00-\u9FFF]"),
    "ar": re.compile(r"[\u0600-\u06FF]"),
    "ko": re.compile(r"[\uAC00-\uD7AF]"),
    "ru": re.compile(r"[\u0400-\u04FF]"),
}

LANGUAGE_LABELS = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi",
    "ja": "Japanese",
    "zh": "Chinese",
    "ar": "Arabic",
    "fr": "French",
    "de": "German",
    "es": "Spanish",
    "ko": "Korean",
    "pt": "Portuguese",
    "ru": "Russian",
    "it": "Italian",
    "id": "Indonesian",
}


@dataclass
class Record:
    id: str
    name: str
    description: str
    language: str
    tags: list[str]
    created_at: str

    @property
    def combined(self) -> str:
        return " ".join(part for part in [self.name, self.description] if part).strip()


class Embedder:
    def __init__(self) -> None:
        self.model_name = "paraphrase-multilingual-MiniLM-L12-v2"
        self._model = None
        self._bert_enabled = os.environ.get("DUPLIXIS_USE_BERT", "").lower() in {
            "1",
            "true",
            "yes",
        }
        if self._bert_enabled and SentenceTransformer is not None:
            try:
                self._model = SentenceTransformer(self.model_name)
            except Exception:
                self._model = None

    @property
    def strategy(self) -> str:
        if self._model is not None:
            return "bert"
        return "lexical-fallback"

    def encode(self, texts: list[str]) -> list[Any]:
        if self._model is not None:
            return self._model.encode(texts, show_progress_bar=False).tolist()
        return [hashed_vector(text) for text in texts]


def get_embedder() -> Embedder:
    global _EMBEDDER
    if _EMBEDDER is None:
        _EMBEDDER = Embedder()
    return _EMBEDDER


def preprocess_text(text: Any) -> str:
    if text is None:
        return ""
    return re.sub(r"\s+", " ", str(text)).strip()


def slug(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    return re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")


def tokenize(text: str) -> list[str]:
    return [token.lower() for token in TOKEN_RE.findall(text)]


def informative_tokens(text: str) -> list[str]:
    seen: set[str] = set()
    tokens: list[str] = []
    for token in tokenize(text):
        if len(token) <= 2 or token in COMMON_STOPWORDS:
            continue
        if token not in seen:
            seen.add(token)
            tokens.append(token)
    return tokens


def detect_language(text: str, fallback: str | None = None) -> str:
    if fallback in LANGUAGE_LABELS:
        return fallback
    for code, pattern in LANGUAGE_HINTS.items():
        if pattern.search(text):
            return code
    return "en"


def hashed_vector(text: str, dimensions: int = 128) -> list[float]:
    tokens = tokenize(text)
    if not tokens:
        return [0.0] * dimensions

    vector = [0.0] * dimensions
    for token in tokens:
        bucket = hash(token) % dimensions
        vector[bucket] += 1.0

    norm = math.sqrt(sum(value * value for value in vector)) or 1.0
    return [value / norm for value in vector]


def cosine_similarity(left: list[float], right: list[float]) -> float:
    if not left or not right:
        return 0.0
    return sum(a * b for a, b in zip(left, right))


def fuzzy_score(text1: str, text2: str) -> float:
    return SequenceMatcher(None, text1.lower(), text2.lower()).ratio()


def keyword_overlap(text1: str, text2: str) -> float:
    words1 = set(tokenize(text1))
    words2 = set(tokenize(text2))
    if not words1 or not words2:
        return 0.0
    return len(words1 & words2) / max(len(words1 | words2), 1)


def hybrid_score(text1: str, text2: str, embedding_score: float) -> float:
    lexical = fuzzy_score(text1, text2)
    overlap = keyword_overlap(text1, text2)
    score = (0.6 * embedding_score) + (0.25 * lexical) + (0.15 * overlap)
    return max(0.0, min(score, 1.0))


def percentile(values: list[float], q: float) -> float:
    if not values:
        return 0.8
    sorted_values = sorted(values)
    if len(sorted_values) == 1:
        return sorted_values[0]
    index = (len(sorted_values) - 1) * q
    lower = math.floor(index)
    upper = math.ceil(index)
    if lower == upper:
        return sorted_values[lower]
    weight = index - lower
    return sorted_values[lower] * (1 - weight) + sorted_values[upper] * weight


def dynamic_thresholds(records: list[Record], score_matrix: list[list[float]]) -> dict[str, float]:
    groups: dict[str, list[int]] = defaultdict(list)
    for index, record in enumerate(records):
        groups[record.language].append(index)

    thresholds: dict[str, float] = {}
    default_threshold = 0.8

    for language, indices in groups.items():
        scores: list[float] = []
        for idx, left in enumerate(indices):
            for right in indices[idx + 1 :]:
                score = score_matrix[left][right]
                if score > 0:
                    scores.append(score)
        thresholds[language] = percentile(scores, 0.9) if scores else default_threshold
    return thresholds


def embedding_signature(vector: list[float], width: int = 6) -> str:
    if not vector:
        return "empty"
    indices = sorted(
        range(len(vector)),
        key=lambda idx: abs(vector[idx]),
        reverse=True,
    )[:width]
    return "|".join(
        f"{idx}:{'p' if vector[idx] >= 0 else 'n'}"
        for idx in sorted(indices)
    )


def add_bucket(bucket_map: dict[str, list[int]], key: str, index: int) -> None:
    bucket = bucket_map[key]
    if len(bucket) < MAX_BUCKET_SIZE:
        bucket.append(index)


def candidate_pairs(records: list[Record], embeddings: list[list[float]]) -> set[tuple[int, int]]:
    token_df: Counter[str] = Counter()
    record_tokens: list[list[str]] = []
    for record in records:
        tokens = informative_tokens(record.combined)
        record_tokens.append(tokens)
        token_df.update(tokens)

    buckets: dict[str, list[int]] = defaultdict(list)
    for index, record in enumerate(records):
        tokens = sorted(
            [
                token
                for token in record_tokens[index]
                if token_df[token] <= MAX_TOKEN_BUCKET_DF
            ],
            key=lambda token: (token_df[token], token),
        )[:MAX_TOKENS_PER_RECORD]

        for token in tokens:
            add_bucket(buckets, f"tok:{token}", index)

        name_slug = slug(record.name)
        if name_slug:
            add_bucket(buckets, f"name:{name_slug[:10]}", index)

        combined_slug = slug(record.combined)
        if combined_slug:
            add_bucket(buckets, f"text:{combined_slug[:14]}", index)

        add_bucket(buckets, f"vec:{embedding_signature(embeddings[index])}", index)

    pairs: set[tuple[int, int]] = set()
    for bucket in buckets.values():
        size = len(bucket)
        if size < 2:
            continue
        for left_pos in range(size):
            left = bucket[left_pos]
            for right in bucket[left_pos + 1 :]:
                pairs.add((left, right) if left < right else (right, left))

    if not pairs:
        for index in range(len(records) - 1):
            pairs.add((index, index + 1))

    return pairs


def matched_tokens(text1: str, text2: str) -> list[str]:
    left = [token for token in tokenize(text1) if len(token) > 2]
    right = [token for token in tokenize(text2) if len(token) > 2]
    common = []
    right_counter = Counter(right)
    for token in left:
        if right_counter[token] > 0 and token not in common:
            common.append(token)
    return common[:6]


def connected_components(node_count: int, edges: list[tuple[int, int]]) -> list[list[int]]:
    adjacency: dict[int, set[int]] = defaultdict(set)
    for left, right in edges:
        adjacency[left].add(right)
        adjacency[right].add(left)

    visited: set[int] = set()
    groups: list[list[int]] = []

    for node in range(node_count):
        if node in visited or node not in adjacency:
            continue
        stack = [node]
        component: list[int] = []
        visited.add(node)
        while stack:
            current = stack.pop()
            component.append(current)
            for neighbor in adjacency[current]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    stack.append(neighbor)
        if len(component) > 1:
            groups.append(sorted(component))
    return groups


def to_record(raw: dict[str, Any], index: int) -> Record:
    name = preprocess_text(raw.get("name"))
    description = preprocess_text(raw.get("description"))
    language = detect_language(f"{name} {description}", preprocess_text(raw.get("language")) or None)
    record_id = preprocess_text(raw.get("id")) or f"rec-{index + 1:03d}"
    tags = raw.get("tags") if isinstance(raw.get("tags"), list) else []
    created_at = preprocess_text(raw.get("createdAt")) or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    return Record(
        id=record_id,
        name=name,
        description=description,
        language=language,
        tags=[preprocess_text(tag) for tag in tags if preprocess_text(tag)],
        created_at=created_at,
    )


def parse_records_from_content(filename: str, content: str) -> list[Record]:
    suffix = Path(filename).suffix.lower()
    if suffix == ".json":
        data = json.loads(content)
        if isinstance(data, dict):
            if "records" in data and isinstance(data["records"], list):
                rows = data["records"]
            else:
                raise ValueError("JSON input must be an array of records or an object with a 'records' array.")
        elif isinstance(data, list):
            rows = data
        else:
            raise ValueError("Unsupported JSON structure.")
        return [to_record(row, index) for index, row in enumerate(rows) if isinstance(row, dict)]

    if suffix == ".csv":
        import csv
        from io import StringIO

        reader = csv.DictReader(StringIO(content))
        return [to_record(row, index) for index, row in enumerate(reader)]

    raise ValueError("Only CSV and JSON inputs are supported.")


def sample_manual_corpus() -> list[Record]:
    sample_rows = [
        {"id": "rec-001", "name": "John Doe", "description": "Customer account with billing address in Springfield", "language": "en"},
        {"id": "rec-002", "name": "Juan Doe", "description": "Cuenta de cliente con direccion en Springfield", "language": "es"},
        {"id": "rec-003", "name": "Jean Doe", "description": "Compte client avec adresse de facturation a Springfield", "language": "fr"},
        {"id": "rec-010", "name": "Global Tech Solutions Inc.", "description": "Software development company headquartered in San Francisco", "language": "en"},
        {"id": "rec-011", "name": "Global Tech Solutions Co Ltd", "description": "Software company based in San Francisco", "language": "en"},
        {"id": "rec-020", "name": "Beijing Zhongguancun Science Park", "description": "High-tech industry development zone in Beijing", "language": "en"},
        {"id": "rec-021", "name": "北京中关村科技园", "description": "北京高新技术产业开发区", "language": "zh"},
    ]
    return [to_record(row, idx) for idx, row in enumerate(sample_rows)]


def analyze_records(records: list[Record]) -> dict[str, Any]:
    started_at = time.perf_counter()
    source_records = [
        {
            "id": record.id,
            "name": record.name,
            "description": record.description,
            "language": record.language,
            "tags": record.tags,
            "createdAt": record.created_at,
        }
        for record in records
    ]
    if len(records) < 2:
        return {
            "sourceRecords": source_records,
            "cleanedRecords": source_records,
            "groups": [],
            "totalRecordsAnalyzed": len(records),
            "duplicatesFound": 0,
            "processingTimeMs": max(1, int((time.perf_counter() - started_at) * 1000)),
            "meta": {"strategy": "lexical-fallback", "message": "Need at least two records to compare."},
        }

    embedder = get_embedder()
    embeddings = embedder.encode([record.combined for record in records])
    pairs_to_compare = candidate_pairs(records, embeddings)

    size = len(records)
    score_matrix = [[0.0 for _ in range(size)] for _ in range(size)]
    top_scores: list[list[tuple[int, float]]] = [[] for _ in range(size)]

    for i, j in pairs_to_compare:
        embedding_score = cosine_similarity(embeddings[i], embeddings[j])
        score = hybrid_score(records[i].combined, records[j].combined, embedding_score)
        score_matrix[i][j] = score
        score_matrix[j][i] = score
        top_scores[i].append((j, score))
        top_scores[j].append((i, score))

    thresholds = dynamic_thresholds(records, score_matrix)
    default_threshold = 0.78
    edges: list[tuple[int, int]] = []

    for i in range(size):
        ranked = sorted(top_scores[i], key=lambda item: item[1], reverse=True)[:10]
        for j, score in ranked:
            if i >= j:
                continue
            threshold = default_threshold
            if records[i].language == records[j].language:
                threshold = thresholds.get(records[i].language, default_threshold)
            else:
                threshold = min(default_threshold, (thresholds.get(records[i].language, default_threshold) + thresholds.get(records[j].language, default_threshold)) / 2)
            if score >= threshold:
                edges.append((i, j))

    groups = connected_components(size, edges)
    response_groups = []
    duplicate_indices: set[int] = set()

    for group_index, group in enumerate(groups, start=1):
        base_index = max(group, key=lambda idx: len(records[idx].combined))
        original = records[base_index]
        similar_items = []
        pair_scores = []

        for idx in group:
            if idx == base_index:
                continue
            score = round(score_matrix[base_index][idx] * 100)
            pair_scores.append(score)
            similar = records[idx]
            similar_items.append(
                {
                    "record": {
                        "id": similar.id,
                        "name": similar.name,
                        "description": similar.description,
                        "language": similar.language,
                        "tags": similar.tags,
                        "createdAt": similar.created_at,
                    },
                    "matchedTokens": matched_tokens(original.combined, similar.combined),
                    "translatedName": None if similar.language == original.language else f"{similar.name} ({LANGUAGE_LABELS.get(similar.language, similar.language).title()})",
                }
            )

        if not similar_items:
            continue

        duplicate_indices.update(idx for idx in group if idx != base_index)

        response_groups.append(
            {
                "id": f"grp-{group_index:03d}",
                "original": {
                    "id": original.id,
                    "name": original.name,
                    "description": original.description,
                    "language": original.language,
                    "tags": original.tags,
                    "createdAt": original.created_at,
                },
                "similar": similar_items,
                "topScore": max(pair_scores) if pair_scores else 0,
                "processedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }
        )

    cleaned_records = [
        source_records[index]
        for index in range(size)
        if index not in duplicate_indices
    ]

    processing_time = max(1, int((time.perf_counter() - started_at) * 1000))
    duplicates_found = sum(len(group["similar"]) for group in response_groups)
    return {
        "sourceRecords": source_records,
        "cleanedRecords": cleaned_records,
        "groups": response_groups,
        "totalRecordsAnalyzed": len(records),
        "duplicatesFound": duplicates_found,
        "processingTimeMs": processing_time,
        "meta": {
            "strategy": embedder.strategy,
            "thresholds": thresholds,
            "candidatePairsCompared": len(pairs_to_compare),
        },
    }


def analyze_file_payload(filename: str, content: str) -> dict[str, Any]:
    records = parse_records_from_content(filename, content)
    return analyze_records(records)


def analyze_manual_payload(payload: dict[str, Any]) -> dict[str, Any]:
    corpus = sample_manual_corpus()
    submitted = to_record(
        {
            "id": f"manual-{slug(preprocess_text(payload.get('name')) or 'record')}",
            "name": payload.get("name"),
            "description": payload.get("description"),
            "language": payload.get("language"),
        },
        len(corpus),
    )
    return analyze_records([submitted, *corpus])
