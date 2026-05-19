from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .seed import build_platform_payload, build_report

app = FastAPI(title="Echo Investigations API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

platform_payload = build_platform_payload()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/platform")
def get_platform():
    return platform_payload


@app.get("/api/cases")
def get_cases():
    return platform_payload.cases


@app.get("/api/cases/{case_id}")
def get_case(case_id: str):
    for case in platform_payload.cases:
        if case.id == case_id:
            return case
    raise HTTPException(status_code=404, detail="Case not found")


@app.get("/api/reports/{case_id}")
def get_report(case_id: str):
    for case in platform_payload.cases:
        if case.id == case_id:
            return build_report(case)
    raise HTTPException(status_code=404, detail="Report not found")
