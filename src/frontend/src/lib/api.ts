import type { DuplicateResult, Language } from "@/types";

interface FileDetectionPayload {
  filename: string;
  content: string;
}

interface ManualDetectionPayload {
  name: string;
  description: string;
  language: Language;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 600000);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: controller.signal,
  }).catch((error: unknown) => {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "The backend took too long to respond. The server is reachable, so this request is likely still processing a large input.",
      );
    }
    throw error;
  }).finally(() => {
    window.clearTimeout(timeout);
  });

  const payload = (await response.json()) as T | { error?: string };
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "error" in payload
        ? payload.error
        : "Request failed.";
    throw new Error(message || "Request failed.");
  }

  return payload as T;
}

export function detectDuplicatesFromFile(
  body: FileDetectionPayload,
): Promise<DuplicateResult> {
  return postJson<DuplicateResult>("/api/detect/file", body);
}

export function detectDuplicatesFromManual(
  body: ManualDetectionPayload,
): Promise<DuplicateResult> {
  return postJson<DuplicateResult>("/api/detect/manual", body);
}
