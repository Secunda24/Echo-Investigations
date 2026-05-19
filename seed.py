from __future__ import annotations

from datetime import datetime, timedelta

from .intelligence import match_entities, priority_band, score_case
from .models import (
    AnalyticsSnapshot,
    DashboardMetrics,
    Entity,
    FeedItem,
    Insight,
    IntelligenceCase,
    Lead,
    PlatformPayload,
    Relationship,
    ReportPayload,
    TimelineEvent,
)


def _base_case_specs() -> list[dict[str, str]]:
    return [
        {
            "id": "ECHO-101",
            "name": "John Mkhize",
            "phone": "+27 82 440 1102",
            "address": "14 Matumi View, Mbombela",
            "alt_address": "Unit 9 Sabie Court, Mbombela",
            "employer": "RidgeLine Logistics",
            "cluster": "Mbombela Metro",
            "investigator": "Naledi Mokoena",
        },
        {
            "id": "ECHO-102",
            "name": "Sibusiso Dlamini",
            "phone": "+27 82 440 1102",
            "address": "14 Matumi View, Mbombela",
            "alt_address": "18 Matumi View, Mbombela",
            "employer": "Northbank Retail",
            "cluster": "Mbombela Metro",
            "investigator": "Naledi Mokoena",
        },
        {
            "id": "ECHO-118",
            "name": "Nomsa Khumalo",
            "phone": "+27 73 110 9032",
            "address": "7 Kendal Road, eMalahleni",
            "alt_address": "22 Highveld Park, eMalahleni",
            "employer": "RidgeLine Logistics",
            "cluster": "eMalahleni Corridor",
            "investigator": "Sipho Nkosi",
        },
        {
            "id": "ECHO-121",
            "name": "Ayanda Ndlovu",
            "phone": "+27 73 110 9032",
            "address": "22 Highveld Park, eMalahleni",
            "alt_address": "4 Steelcrest Ave, eMalahleni",
            "employer": "RidgeLine Logistics",
            "cluster": "eMalahleni Corridor",
            "investigator": "Sipho Nkosi",
        },
        {
            "id": "ECHO-133",
            "name": "Thabo Sithole",
            "phone": "+27 64 220 4401",
            "address": "31 Klipspringer St, Alberton",
            "alt_address": "31 Klipspringer St, Alberton",
            "employer": "Unknown",
            "cluster": "Gauteng South",
            "investigator": "Zanele Mthembu",
        },
    ]


def _generated_case_specs() -> list[dict[str, str]]:
    names = [
        "Lerato Maseko",
        "Andile Buthelezi",
        "Kagiso Molefe",
        "Zinhle Nkomo",
        "Mpho Radebe",
        "Nokuthula Zwane",
        "Vusi Mabena",
        "Boitumelo Seabi",
    ]
    employers = ["RidgeLine Logistics", "Blue Current Energy", "Northbank Retail", "Metsi Civil", "TransAxis Fleet"]
    clusters = ["Mbombela Metro", "eMalahleni Corridor", "Gauteng South", "Tshwane Belt"]
    investigators = ["Naledi Mokoena", "Sipho Nkosi", "Zanele Mthembu", "Aiden Peters"]

    generated: list[dict[str, str]] = []
    for index in range(6, 65):
        name = names[index % len(names)]
        employer = employers[index % len(employers)]
        cluster = clusters[index % len(clusters)]
        investigator = investigators[index % len(investigators)]
        shared_phone = "+27 82 440 1102" if index % 11 == 0 else f"+27 7{index % 10} {100 + index:03d} {2000 + index}"
        address = f"{10 + index} Cluster View, {cluster.split()[0]}"
        generated.append(
            {
                "id": f"ECHO-{100 + index}",
                "name": name,
                "phone": shared_phone,
                "address": address,
                "alt_address": f"Unit {index % 20 + 1} Transit Court, {cluster.split()[0]}",
                "employer": employer,
                "cluster": cluster,
                "investigator": investigator,
            }
        )
    return generated


def build_cases() -> list[IntelligenceCase]:
    specs = _base_case_specs() + _generated_case_specs()
    cases: list[IntelligenceCase] = []
    now = datetime(2026, 5, 19, 9, 0)

    for index, spec in enumerate(specs):
        matches = [
            match_entities(spec, candidate)
            for candidate in specs
            if candidate["id"] != spec["id"]
            and (candidate["phone"] == spec["phone"] or candidate["employer"] == spec["employer"] or candidate["address"] == spec["address"])
        ]
        best_match = max((item["score"] for item in matches), default=15)
        completeness = 24 if spec["employer"] != "Unknown" else 14
        density = min(24, len(matches) * 6)
        recency = max(4, 12 - (index % 8))
        score = score_case(completeness, int(best_match * 0.45), density, recency)
        band = priority_band(score)

        person_id = f"person-{spec['id'].lower()}"
        phone_id = f"phone-{spec['id'].lower()}"
        address_id = f"address-{spec['id'].lower()}"
        employer_id = f"employer-{spec['employer'].lower().replace(' ', '-')}"
        case_entity_id = f"case-{spec['id'].lower()}"
        linked_person_id = f"linked-{spec['id'].lower()}"

        entities = [
            Entity(id=person_id, type="person", value=spec["name"], risk="high" if band == "Red" else "medium" if band == "Amber" else "low"),
            Entity(id=phone_id, type="phone", value=spec["phone"], risk="high" if best_match >= 75 else "medium"),
            Entity(id=address_id, type="address", value=spec["address"], risk="medium"),
            Entity(id=employer_id, type="employer", value=spec["employer"], risk="high" if spec["employer"] == "RidgeLine Logistics" else "medium"),
            Entity(id=case_entity_id, type="case", value=spec["id"], risk="high" if band == "Red" else "medium"),
        ]

        if spec["id"] == "ECHO-101":
            entities.extend(
                [
                    Entity(id="address-echo-101-alt", type="address", value=spec["alt_address"], risk="medium"),
                    Entity(id="linked-echo-101-sibusiso", type="person", value="Sibusiso Dlamini", risk="medium"),
                    Entity(id="linked-echo-101-ayanda", type="person", value="Ayanda Ndlovu", risk="medium"),
                ]
            )

        relationships = [
            Relationship(id=f"{spec['id']}-r1", from_entity=person_id, to_entity=phone_id, relationship_type="HAS_PHONE", confidence_score=min(98, 66 + int(best_match * 0.4))),
            Relationship(id=f"{spec['id']}-r2", from_entity=person_id, to_entity=address_id, relationship_type="LIVES_AT", confidence_score=82),
            Relationship(id=f"{spec['id']}-r3", from_entity=person_id, to_entity=employer_id, relationship_type="WORKS_AT", confidence_score=84 if spec["employer"] != "Unknown" else 38),
            Relationship(id=f"{spec['id']}-r4", from_entity=case_entity_id, to_entity=person_id, relationship_type="CASE_SUBJECT", confidence_score=100),
        ]

        if spec["id"] == "ECHO-101":
            relationships.extend(
                [
                    Relationship(id="ECHO-101-r5", from_entity=person_id, to_entity="address-echo-101-alt", relationship_type="LINKED_VIA", confidence_score=72),
                    Relationship(id="ECHO-101-r6", from_entity="linked-echo-101-sibusiso", to_entity=phone_id, relationship_type="HAS_PHONE", confidence_score=79),
                    Relationship(id="ECHO-101-r7", from_entity="linked-echo-101-ayanda", to_entity=employer_id, relationship_type="WORKS_AT", confidence_score=74),
                ]
            )

        leads = [
            Lead(
                title="Shared employer cluster",
                probability=min(91, 58 + len(matches) * 5),
                rationale="Employer and identity adjacency indicate a concentrated field verification opportunity.",
                action="Prioritize employer-facing verification and associate mapping.",
            )
        ]

        if spec["id"] == "ECHO-101":
            leads.append(
                Lead(
                    title="Address chain expansion",
                    probability=74,
                    rationale="Two nearby addresses suggest short-range relocation rather than disappearance.",
                    action="Verify the address corridor before broad-area search.",
                )
            )

        insights = [
            Insight(
                title="Relationship density signal",
                body="Cross-case overlap density indicates that a single confirmed touchpoint is likely to unlock several connected investigations.",
                confidence=min(93, 60 + len(matches) * 6),
            )
        ]

        if spec["id"] == "ECHO-101":
            insights.append(
                Insight(
                    title="Metropolitan relocation signal",
                    body="Based on linked phone reuse and shared employer history, there is a high probability the debtor relocated within the same metropolitan cluster.",
                    confidence=89,
                )
            )

        timeline = []
        if spec["id"] == "ECHO-101":
            timeline = [
                TimelineEvent(id="t1", timestamp="08:12", label="Case ingested", detail="CSV import created primary subject and phone entities.", kind="ingest"),
                TimelineEvent(id="t2", timestamp="08:16", label="Phone match detected", detail="Phone linked to three other matters at high confidence.", kind="link"),
                TimelineEvent(id="t3", timestamp="08:18", label="Priority flag raised", detail="Composite scoring exceeded the red threshold.", kind="alert"),
                TimelineEvent(id="t4", timestamp="08:20", label="Report narrative generated", detail="Case narrative prepared for review and export.", kind="report"),
            ]

        cases.append(
            IntelligenceCase(
                id=spec["id"],
                debtor_name=spec["name"],
                status="Escalated" if band == "Red" else "Active" if band == "Amber" else "Open",
                priority_score=score,
                priority_band=band,
                location_cluster=spec["cluster"],
                investigator=spec["investigator"],
                created_at=(now - timedelta(days=index % 12)).date().isoformat(),
                identifiers=[f"Phone {spec['phone']}", f"Employer {spec['employer']}", spec["address"]],
                notes=["Demo data only.", f"{len(matches)} related overlap candidates detected."],
                summary=f"{spec['name']} shows {len(matches)} overlap candidates across phone, address, or employer relationships.",
                recommended_action="Escalate clustered verification." if band == "Red" else "Pursue enrichment and targeted verification.",
                next_leads=leads,
                insights=insights,
                timeline=timeline,
                entities=entities,
                relationships=relationships,
            )
        )

    return cases


def build_platform_payload() -> PlatformPayload:
    cases = build_cases()
    metrics = DashboardMetrics(
        total_cases=len(cases),
        active_cases=sum(1 for case in cases if case.status in {"Active", "Escalated"}),
        high_priority=sum(1 for case in cases if case.priority_band == "Red"),
        graph_links=sum(len(case.relationships) for case in cases),
        success_rate=76,
        average_locate_days=12,
    )
    feed = [
        FeedItem(id="feed-1", severity="high", message="John Mkhize linked to 3 reused phone records and 2 overlapping addresses.", timestamp="2 min ago"),
        FeedItem(id="feed-2", severity="medium", message="Employer overlap detected between ECHO-101 and ECHO-118.", timestamp="9 min ago"),
        FeedItem(id="feed-3", severity="low", message="Audit export completed for investigator Naledi Mokoena.", timestamp="16 min ago"),
    ]
    analytics = AnalyticsSnapshot(
        resolution_by_week=[
            {"name": "W1", "resolved": 6, "linked": 21},
            {"name": "W2", "resolved": 8, "linked": 27},
            {"name": "W3", "resolved": 11, "linked": 31},
            {"name": "W4", "resolved": 14, "linked": 39},
        ],
        performance=[
            {"name": "Naledi", "score": 92},
            {"name": "Sipho", "score": 84},
            {"name": "Zanele", "score": 78},
            {"name": "Aiden", "score": 88},
        ],
        priority_mix=[
            {"name": "Red", "value": sum(1 for case in cases if case.priority_band == "Red")},
            {"name": "Amber", "value": sum(1 for case in cases if case.priority_band == "Amber")},
            {"name": "Green", "value": sum(1 for case in cases if case.priority_band == "Green")},
        ],
    )
    return PlatformPayload(metrics=metrics, cases=cases, feed=feed, analytics=analytics)


def build_report(case: IntelligenceCase) -> ReportPayload:
    relationship_lines = [
        f"{relationship.from_entity} -> {relationship.relationship_type} -> {relationship.to_entity}"
        for relationship in case.relationships[:6]
    ]
    return ReportPayload(
        case_id=case.id,
        title=f"Investigation Summary: {case.debtor_name}",
        generated_at="2026-05-19 09:00 SAST",
        executive_summary=case.summary,
        findings=[
            f"Priority score assessed at {case.priority_score} with a {case.priority_band.upper()} heat classification.",
            f"{len(case.relationships)} direct relationship edges attached to the case payload.",
            f"{len(case.next_leads)} recommended investigative leads generated.",
        ],
        relationships=relationship_lines,
        recommended_actions=[lead.action for lead in case.next_leads],
        compliance_note="Demo narrative includes structures suitable for POPIA-conscious audit trails and export review.",
    )
