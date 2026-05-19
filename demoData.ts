import type { PlatformPayload, ReportPayload } from "./types";

const sharedLead = {
  title: "Shared employer cluster",
  probability: 81,
  rationale: "Employer overlap appears across linked debtors in the eMalahleni metro corridor.",
  action: "Prioritize payroll and shift roster verification."
};

export const fallbackPlatformData: PlatformPayload = {
  metrics: {
    total_cases: 64,
    active_cases: 29,
    high_priority: 14,
    graph_links: 318,
    success_rate: 76,
    average_locate_days: 12
  },
  feed: [
    {
      id: "feed-1",
      severity: "high",
      message: "John Mkhize linked to 3 reused phone records and 2 overlapping addresses.",
      timestamp: "2 min ago"
    },
    {
      id: "feed-2",
      severity: "medium",
      message: "Employer overlap detected between Case ECHO-104 and Case ECHO-118.",
      timestamp: "9 min ago"
    },
    {
      id: "feed-3",
      severity: "low",
      message: "Audit export completed for investigator Naledi Mokoena.",
      timestamp: "16 min ago"
    }
  ],
  analytics: {
    resolution_by_week: [
      { name: "W1", resolved: 6, linked: 21 },
      { name: "W2", resolved: 8, linked: 27 },
      { name: "W3", resolved: 11, linked: 31 },
      { name: "W4", resolved: 14, linked: 39 }
    ],
    performance: [
      { name: "Naledi", score: 92 },
      { name: "Sipho", score: 84 },
      { name: "Zanele", score: 78 },
      { name: "Aiden", score: 88 }
    ],
    priority_mix: [
      { name: "Red", value: 14 },
      { name: "Amber", value: 23 },
      { name: "Green", value: 27 }
    ]
  },
  cases: [
    {
      id: "ECHO-101",
      debtor_name: "John Mkhize",
      status: "Escalated",
      priority_score: 92,
      priority_band: "Red",
      location_cluster: "Mbombela Metro",
      investigator: "Naledi Mokoena",
      created_at: "2026-05-18",
      identifiers: ["ID 860214...", "Phone +27 82 440 1102", "Employer RidgeLine Logistics"],
      notes: ["Public trace indicates recent handset reuse.", "Address cluster migrated within 8km radius."],
      summary: "High-confidence identity convergence with repeat phone use, shared employer history, and an address chain tied to two other active matters.",
      recommended_action: "Escalate field verification with employer and address cluster first.",
      next_leads: [
        sharedLead,
        {
          title: "Address chain expansion",
          probability: 74,
          rationale: "Two linked apartments share a utility contact pattern.",
          action: "Run municipal address confirmation and neighborhood canvass."
        }
      ],
      insights: [
        {
          title: "Metropolitan relocation signal",
          body: "Phone reuse and payroll history suggest the subject likely remained within the same metropolitan cluster rather than leaving the province.",
          confidence: 89
        },
        {
          title: "Relationship density spike",
          body: "This case sits inside one of the densest identity-link clusters in the current portfolio, increasing the value of one successful contact point.",
          confidence: 84
        }
      ],
      timeline: [
        {
          id: "t1",
          timestamp: "08:12",
          label: "Case ingested",
          detail: "CSV import created case with debtor and phone entities.",
          kind: "ingest"
        },
        {
          id: "t2",
          timestamp: "08:16",
          label: "Phone match detected",
          detail: "Phone linked to 3 other active cases at high confidence.",
          kind: "link"
        },
        {
          id: "t3",
          timestamp: "08:18",
          label: "Priority flag raised",
          detail: "Composite score crossed the red heat threshold.",
          kind: "alert"
        },
        {
          id: "t4",
          timestamp: "08:20",
          label: "Report narrative generated",
          detail: "Case summary prepared for investigator review.",
          kind: "report"
        }
      ],
      entities: [
        { id: "person-john", type: "person", value: "John Mkhize", risk: "high" },
        { id: "phone-1", type: "phone", value: "+27 82 440 1102", risk: "high" },
        { id: "address-1", type: "address", value: "14 Matumi View, Mbombela", risk: "medium" },
        { id: "address-2", type: "address", value: "Unit 9 Sabie Court, Mbombela", risk: "medium" },
        { id: "employer-1", type: "employer", value: "RidgeLine Logistics", risk: "high" },
        { id: "case-101", type: "case", value: "ECHO-101", risk: "high" },
        { id: "person-linked-1", type: "person", value: "Sibusiso Dlamini", risk: "medium" },
        { id: "person-linked-2", type: "person", value: "Ayanda Ndlovu", risk: "medium" }
      ],
      relationships: [
        { id: "r1", from_entity: "person-john", to_entity: "phone-1", relationship_type: "HAS_PHONE", confidence_score: 96 },
        { id: "r2", from_entity: "person-john", to_entity: "address-1", relationship_type: "LIVES_AT", confidence_score: 84 },
        { id: "r3", from_entity: "person-john", to_entity: "address-2", relationship_type: "LINKED_VIA", confidence_score: 71 },
        { id: "r4", from_entity: "person-john", to_entity: "employer-1", relationship_type: "WORKS_AT", confidence_score: 88 },
        { id: "r5", from_entity: "case-101", to_entity: "person-john", relationship_type: "CASE_SUBJECT", confidence_score: 100 },
        { id: "r6", from_entity: "person-linked-1", to_entity: "phone-1", relationship_type: "HAS_PHONE", confidence_score: 78 },
        { id: "r7", from_entity: "person-linked-2", to_entity: "employer-1", relationship_type: "WORKS_AT", confidence_score: 74 }
      ]
    },
    {
      id: "ECHO-118",
      debtor_name: "Nomsa Khumalo",
      status: "Active",
      priority_score: 78,
      priority_band: "Amber",
      location_cluster: "eMalahleni Corridor",
      investigator: "Sipho Nkosi",
      created_at: "2026-05-17",
      identifiers: ["Phone +27 73 110 9032", "Employer RidgeLine Logistics"],
      notes: ["Linked to John Mkhize via employer and shared associate."],
      summary: "Good employer overlap signal with moderate phone confidence.",
      recommended_action: "Interview payroll contact and validate shift address logs.",
      next_leads: [sharedLead],
      insights: [
        {
          title: "Network adjacency",
          body: "Case shares a second-degree path into the John Mkhize cluster through employer and associate overlap.",
          confidence: 77
        }
      ],
      timeline: [],
      entities: [
        { id: "person-nomsa", type: "person", value: "Nomsa Khumalo", risk: "medium" },
        { id: "phone-2", type: "phone", value: "+27 73 110 9032", risk: "medium" },
        { id: "employer-1", type: "employer", value: "RidgeLine Logistics", risk: "high" },
        { id: "case-118", type: "case", value: "ECHO-118", risk: "medium" }
      ],
      relationships: [
        { id: "r8", from_entity: "person-nomsa", to_entity: "phone-2", relationship_type: "HAS_PHONE", confidence_score: 82 },
        { id: "r9", from_entity: "person-nomsa", to_entity: "employer-1", relationship_type: "WORKS_AT", confidence_score: 86 },
        { id: "r10", from_entity: "case-118", to_entity: "person-nomsa", relationship_type: "CASE_SUBJECT", confidence_score: 100 }
      ]
    },
    {
      id: "ECHO-133",
      debtor_name: "Thabo Sithole",
      status: "Open",
      priority_score: 63,
      priority_band: "Green",
      location_cluster: "Gauteng South",
      investigator: "Zanele Mthembu",
      created_at: "2026-05-15",
      identifiers: ["Phone +27 64 220 4401"],
      notes: ["Sparse data, few cross-links."],
      summary: "Low-density case with limited identity overlap.",
      recommended_action: "Increase profile completeness before escalation.",
      next_leads: [
        {
          title: "Missing employer enrichment",
          probability: 52,
          rationale: "The biggest scoring gap is employer data.",
          action: "Acquire compliant payroll or business registry confirmation."
        }
      ],
      insights: [],
      timeline: [],
      entities: [
        { id: "person-thabo", type: "person", value: "Thabo Sithole", risk: "low" },
        { id: "phone-3", type: "phone", value: "+27 64 220 4401", risk: "low" },
        { id: "case-133", type: "case", value: "ECHO-133", risk: "low" }
      ],
      relationships: [
        { id: "r11", from_entity: "person-thabo", to_entity: "phone-3", relationship_type: "HAS_PHONE", confidence_score: 70 },
        { id: "r12", from_entity: "case-133", to_entity: "person-thabo", relationship_type: "CASE_SUBJECT", confidence_score: 100 }
      ]
    }
  ]
};

export const fallbackReports: Record<string, ReportPayload> = {
  "ECHO-101": {
    case_id: "ECHO-101",
    title: "Investigation Summary: John Mkhize",
    generated_at: "2026-05-19 09:00 SAST",
    executive_summary: "Identity resolution indicates a high probability that John Mkhize remains active within the Mbombela metro cluster, supported by repeated phone reuse, address adjacency, and employer continuity.",
    findings: [
      "Primary phone identifier reused across three active cases.",
      "Known address pattern links to two additional locations within an 8km movement corridor.",
      "Employer overlap strengthens the continuity hypothesis."
    ],
    relationships: [
      "John Mkhize -> HAS_PHONE -> +27 82 440 1102",
      "John Mkhize -> WORKS_AT -> RidgeLine Logistics",
      "John Mkhize -> LINKED_VIA -> Unit 9 Sabie Court"
    ],
    recommended_actions: [
      "Prioritize employer verification and route-level address confirmation.",
      "Use linked cases to coordinate a single clustered field operation.",
      "Preserve export and access events under POPIA-aligned audit logging."
    ],
    compliance_note: "This report is generated from approved demo data and includes an audit-ready narrative structure aligned to POPIA-conscious handling."
  }
};
