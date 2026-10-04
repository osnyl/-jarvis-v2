"""Secure WSGI gateway for the personal Jarvis Flask app.

It validates Firebase ID tokens before forwarding requests to the existing app.
The upstream app keeps its internal API-key checks; this gateway injects that key
only after a verified user token has passed the single-user allowlist.
"""
from __future__ import annotations

import json
import os
import time
from typing import Any

import jwt
import requests
from dotenv import load_dotenv
from werkzeug.wrappers import Request, Response

load_dotenv("/home/Osnyl1403/mysite/.env")

PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "jarvis-5b0c1")
ALLOWED_UID = os.environ.get("JARVIS_ALLOWED_UID", "").strip()
ALLOWED_EMAIL = os.environ.get("JARVIS_ALLOWED_EMAIL", "").strip().lower()
INTERNAL_API_KEY = os.environ.get("API_KEY", "").strip()
MAX_BODY_BYTES = 6 * 1024 * 1024
PROTECTED_PREFIXES = ("/ask", "/transcribe", "/upload_pdf", "/generate_pdf", "/test_llm/", "/afrigrid/")
DISABLED_PATHS = {"/execute_python"}
CERTS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
_certs: dict[str, Any] = {"expires": 0, "keys": {}}


def _google_certs() -> dict[str, str]:
    now = time.time()
    if _certs["expires"] > now:
        return _certs["keys"]
    response = requests.get(CERTS_URL, timeout=5)
    response.raise_for_status()
    _certs["keys"] = response.json()
    cache_control = response.headers.get("cache-control", "")
    max_age = 3600
    for item in cache_control.split(","):
        if "max-age=" in item:
            try:
                max_age = int(item.split("=", 1)[1])
            except ValueError:
                pass
    _certs["expires"] = now + min(max_age, 86400)
    return _certs["keys"]


def verify_firebase_id_token(token: str) -> dict[str, Any]:
    header = jwt.get_unverified_header(token)
    kid = header.get("kid")
    if not kid:
        raise ValueError("missing key id")
    key = _google_certs().get(kid)
    if not key:
        _certs["expires"] = 0
        key = _google_certs().get(kid)
    if not key:
        raise ValueError("unknown signing key")
    claims = jwt.decode(
        token,
        key,
        algorithms=["RS256"],
        audience=PROJECT_ID,
        issuer=f"https://securetoken.google.com/{PROJECT_ID}",
        leeway=10,
    )
    if claims.get("sub") == "":
        raise ValueError("missing subject")
    if ALLOWED_UID and claims.get("sub") != ALLOWED_UID:
        raise PermissionError("user not allowed")
    if ALLOWED_EMAIL and str(claims.get("email", "")).lower() != ALLOWED_EMAIL:
        raise PermissionError("user not allowed")
    if not ALLOWED_UID and not ALLOWED_EMAIL:
        raise RuntimeError("single-user allowlist is not configured")
    return claims


class PersonalJarvisGateway:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        request = Request(environ)
        if request.path == "/health":
            return self.app(environ, start_response)
        if request.path in DISABLED_PATHS:
            return Response("Not found", status=404)(environ, start_response)
        if request.path.startswith(PROTECTED_PREFIXES):
            length = request.content_length or 0
            if length > MAX_BODY_BYTES:
                return Response("Request too large", status=413)(environ, start_response)
            authorization = request.headers.get("Authorization", "")
            scheme, _, token = authorization.partition(" ")
            if scheme.lower() != "bearer" or not token:
                return Response("Authentication required", status=401)(environ, start_response)
            try:
                claims = verify_firebase_id_token(token)
            except (PermissionError, RuntimeError, ValueError, requests.RequestException, jwt.PyJWTError):
                return Response("Authentication failed", status=401)(environ, start_response)
            if not INTERNAL_API_KEY:
                return Response("Server authentication is not configured", status=503)(environ, start_response)
            environ["JARVIS_USER_ID"] = claims["sub"]
            environ["HTTP_X_API_KEY"] = INTERNAL_API_KEY
        return self.app(environ, start_response)


try:
    from flask_app import app as _app
except ImportError:
    from mysite.flask_app import app as _app

application = PersonalJarvisGateway(_app)
