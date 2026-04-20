from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from analyzer import analyze_file_payload, analyze_manual_payload


ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8000


class ApiHandler(BaseHTTPRequestHandler):
    def _send(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self._send(200, {"ok": True})

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/api/health":
            self._send(200, {"ok": True, "service": "duplixis-backend"})
            return
        self._send(404, {"error": "Not found"})

    def do_POST(self) -> None:  # noqa: N802
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length) if content_length else b"{}"

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self._send(400, {"error": "Invalid JSON payload."})
            return

        try:
            if self.path == "/api/detect/file":
                filename = str(payload.get("filename") or "")
                content = str(payload.get("content") or "")
                if not filename or not content:
                    raise ValueError("Both 'filename' and 'content' are required.")
                result = analyze_file_payload(filename, content)
                self._send(200, result)
                return

            if self.path == "/api/detect/manual":
                if not payload.get("name") or not payload.get("description"):
                    raise ValueError("Manual payload requires 'name' and 'description'.")
                result = analyze_manual_payload(payload)
                self._send(200, result)
                return

            self._send(404, {"error": "Not found"})
        except ValueError as exc:
            self._send(400, {"error": str(exc)})
        except Exception as exc:  # pragma: no cover - runtime safeguard
            self._send(500, {"error": f"Backend processing failed: {exc}"})

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        return


def run() -> None:
    server = ThreadingHTTPServer((HOST, PORT), ApiHandler)
    print(f"duplixis backend listening on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    run()
