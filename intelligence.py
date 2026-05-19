from __future__ import annotations

from difflib import SequenceMatcher


def normalize_phone(phone: str) -> str:
    return "".join(character for character in phone if character.isdigit())[-9:]


def similarity(left: str, right: str) -> float:
    return SequenceMatcher(None, left.lower().strip(), right.lower().strip()).ratio()


def match_entities(record_a: dict[str, str], record_b: dict[str, str]) -> dict[str, int | str]:
    score = 0

    if normalize_phone(record_a.get("phone", "")) == normalize_phone(record_b.get("phone", "")):
        score += 40
    if record_a.get("address") and record_a.get("address") == record_b.get("address"):
        score += 25
    if similarity(record_a.get("name", ""), record_b.get("name", "")) > 0.82:
        score += 20
    if record_a.get("employer") and record_a.get("employer") == record_b.get("employer"):
        score += 15

    if score >= 75:
        classification = "HIGH"
    elif score >= 45:
        classification = "MEDIUM"
    else:
        classification = "LOW"

    return {"score": score, "classification": classification}


def priority_band(score: int) -> str:
    if score >= 80:
        return "Red"
    if score >= 60:
        return "Amber"
    return "Green"


def score_case(completeness: int, match_confidence: int, relationship_density: int, recency_factor: int) -> int:
    return min(100, completeness + match_confidence + relationship_density + recency_factor)
