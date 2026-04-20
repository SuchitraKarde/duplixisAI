# duplixisAI

Frontend and backend code for the `duplixisAI` multilingual duplicate detection project.

## Run locally

1. Start the Python backend:
   `npm run backend`
2. Start the frontend dev server from `src/frontend`:
   `npm run dev`

The frontend sends duplicate-detection requests to `http://127.0.0.1:8000/api/...`.

## Backend notes

- `src/backend/server.py` exposes the API endpoints.
- `src/backend/analyzer.py` contains the duplicate-detection pipeline.
- If `sentence-transformers` is installed, the backend will use the multilingual BERT-style embedding model
  `paraphrase-multilingual-MiniLM-L12-v2`.
- If those ML dependencies are not installed, the backend automatically falls back to a lexical similarity pipeline so the app still works.
