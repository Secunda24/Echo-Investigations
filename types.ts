export type Lead = {
  title: string;
  probability: number;
  rationale: string;
  action: string;
};

export type Insight = {
  title: string;
  body: string;
  confidence: number;
};

export type TimelineEvent = {
  id: string;
  timestamp: string;
  label: string;
  detail: string;
  kind: "ingest" | "link" | "alert" | "report";
};

export type Entity = {
  id: string;
  type: "person" | "phone" | "address" | "employer" | "case";
  value: string;
  risk: "high" | "medium" | "low";
  metadata?: Record<string, string | number>;
};

export type Relationship = {
  id: string;
  from_entity: string;
  to_entity: string;
  relationship_type: string;
  confidence_score: number;
};

export type IntelligenceCase = {
  id: string;
  debtor_name: string;
  status: "Open" | "Active" | "Escalated" | "Resolved";
  priority_score: number;
  priority_band: "Red" | "Amber" | "Green";
  location_cluster: string;
  investigator: string;
  created_at: string;
  identifiers: string[];
  notes: string[];
  summary: string;
  recommended_action: string;
  next_leads: Lead[];
  insights: Insight[];
  timeline: TimelineEvent[];
  entities: Entity[];
  relationships: Relationship[];
};

export type DashboardMetrics = {
  total_cases: number;
  active_cases: number;
  high_priority: number;
  graph_links: number;
  success_rate: number;
  average_locate_days: number;
};

export type FeedItem = {
  id: string;
  severity: "high" | "medium" | "low";
  message: string;
  timestamp: string;
};

export type AnalyticsSnapshot = {
  resolution_by_week: Array<{ name: string; resolved: number; linked: number }>;
  performance: Array<{ name: string; score: number }>;
  priority_mix: Array<{ name: string; value: number }>;
};

export type ReportPayload = {
  case_id: string;
  title: string;
  generated_at: string;
  executive_summary: string;
  findings: string[];
  relationships: string[];
  recommended_actions: string[];
  compliance_note: string;
};

export type GraphPayload = {
  nodes: Entity[];
  edges: Relationship[];
};

export type PlatformPayload = {
  metrics: DashboardMetrics;
  cases: IntelligenceCase[];
  feed: FeedItem[];
  analytics: AnalyticsSnapshot;
};
