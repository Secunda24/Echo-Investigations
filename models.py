from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


EntityType = Literal["person", "phone", "address", "employer", "case"]
RiskBand = Literal["high", "medium", "low"]
PriorityBand = Literal["Red", "Amber", "Green"]
CaseStatus = Literal["Open", "Active", "Escalated", "Resolved"]


class Lead(BaseModel):
    title: str
    probability: int
    rationale: str
    action: str


class Insight(BaseModel):
    title: str
    body: str
    confidence: int


class TimelineEvent(BaseModel):
    id: str
    timestamp: str
    label: str
    detail: str
    kind: Literal["ingest", "link", "alert", "report"]


class Entity(BaseModel):
    id: str
    type: EntityType
    value: str
    risk: RiskBand
    metadata: dict[str, str | int] | None = None


class Relationship(BaseModel):
    id: str
    from_entity: str
    to_entity: str
    relationship_type: str
    confidence_score: int


class IntelligenceCase(BaseModel):
    id: str
    debtor_name: str
    status: CaseStatus
    priority_score: int
    priority_band: PriorityBand
    location_cluster: str
    investigator: str
    created_at: str
    identifiers: list[str]
    notes: list[str]
    summary: str
    recommended_action: str
    next_leads: list[Lead]
    insights: list[Insight]
    timeline: list[TimelineEvent]
    entities: list[Entity]
    relationships: list[Relationship]


class DashboardMetrics(BaseModel):
    total_cases: int
    active_cases: int
    high_priority: int
    graph_links: int
    success_rate: int
    average_locate_days: int


class FeedItem(BaseModel):
    id: str
    severity: Literal["high", "medium", "low"]
    message: str
    timestamp: str


class AnalyticsSnapshot(BaseModel):
    resolution_by_week: list[dict[str, int | str]]
    performance: list[dict[str, int | str]]
    priority_mix: list[dict[str, int | str]]


class ReportPayload(BaseModel):
    case_id: str
    title: str
    generated_at: str
    executive_summary: str
    findings: list[str]
    relationships: list[str]
    recommended_actions: list[str]
    compliance_note: str


class PlatformPayload(BaseModel):
    metrics: DashboardMetrics
    cases: list[IntelligenceCase]
    feed: list[FeedItem]
    analytics: AnalyticsSnapshot
