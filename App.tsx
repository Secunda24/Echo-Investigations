import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactFlow, { Background, Controls, MarkerType, MiniMap, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import { AlertTriangle, BadgeAlert, BarChart3, FileText, Network, SearchCheck, Shield } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { loadCase, loadPlatformData, loadReport } from "./api";
import type { IntelligenceCase, PlatformPayload, ReportPayload } from "./types";

type Panel = "dashboard" | "cases" | "graph" | "analytics" | "report";

const panelIcons = {
  dashboard: SearchCheck,
  cases: Shield,
  graph: Network,
  analytics: BarChart3,
  report: FileText
};

const heatTone: Record<string, string> = {
  Red: "bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/30",
  Amber: "bg-amber-500/20 text-amber-100 ring-1 ring-amber-400/30",
  Green: "bg-lime-500/20 text-lime-100 ring-1 ring-lime-400/30"
};

function buildGraph(caseItem: IntelligenceCase): { nodes: Node[]; edges: Edge[] } {
  const positions = [
    { x: 320, y: 40 },
    { x: 90, y: 180 },
    { x: 520, y: 190 },
    { x: 240, y: 320 },
    { x: 430, y: 320 },
    { x: 20, y: 40 },
    { x: 640, y: 90 },
    { x: 660, y: 270 }
  ];

  const nodes = caseItem.entities.map((entity, index) => ({
    id: entity.id,
    position: positions[index % positions.length],
    data: {
      label: (
        <div className="min-w-[150px] rounded-2xl border border-white/10 bg-slate-950/90 p-3 shadow-glow">
          <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">{entity.type}</div>
          <div className="mt-1 text-sm font-semibold text-white">{entity.value}</div>
          <div className="mt-2 text-xs text-slate-300">Risk: {entity.risk.toUpperCase()}</div>
        </div>
      )
    },
    style: { background: "transparent", border: "none", width: 180 }
  }));

  const edges = caseItem.relationships.map((relationship) => ({
    id: relationship.id,
    source: relationship.from_entity,
    target: relationship.to_entity,
    animated: relationship.confidence_score > 80,
    label: relationship.relationship_type.replaceAll("_", " "),
    markerEnd: { type: MarkerType.ArrowClosed, color: "#63e6ff" },
    style: {
      stroke: relationship.confidence_score > 80 ? "#63e6ff" : "#f59e0b",
      opacity: 0.85
    },
    labelStyle: { fill: "#cbd5e1", fontSize: 11 }
  }));

  return { nodes, edges };
}

export function App() {
  const [platform, setPlatform] = useState<PlatformPayload | null>(null);
  const [selectedCase, setSelectedCase] = useState<IntelligenceCase | null>(null);
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [activePanel, setActivePanel] = useState<Panel>("dashboard");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    void (async () => {
      const data = await loadPlatformData();
      setPlatform(data);
      const initialCase = await loadCase("ECHO-101");
      setSelectedCase(initialCase);
      const initialReport = await loadReport("ECHO-101");
      setReport(initialReport);
    })();
  }, []);

  const visibleCases =
    platform?.cases.filter((item) => {
      const search = filter.toLowerCase();
      return (
        item.debtor_name.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search) ||
        item.location_cluster.toLowerCase().includes(search)
      );
    }) ?? [];

  const graphData = selectedCase ? buildGraph(selectedCase) : { nodes: [], edges: [] };

  async function openCase(caseId: string) {
    const caseItem = await loadCase(caseId);
    const reportPayload = await loadReport(caseId);
    setSelectedCase(caseItem);
    setReport(reportPayload);
    setActivePanel("cases");
  }

  if (!platform || !selectedCase || !report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-slate-200">
        Loading Echo Investigations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,230,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(251,113,133,0.12),transparent_28%)]" />
      <div className="fixed inset-0 bg-grid bg-[length:34px_34px] opacity-30" />
      <div className="relative grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-[0.34em] text-cyan">Echo Investigations</div>
            <h1 className="mt-3 text-3xl font-semibold text-white">Living intelligence for every case.</h1>
            <p className="mt-3 text-sm text-slate-400">
              Palantir-style demo surface for identity resolution, graph analysis, scoring, and report generation.
            </p>
          </div>

          <div className="space-y-3">
            {(Object.keys(panelIcons) as Panel[]).map((panelKey) => {
              const Icon = panelIcons[panelKey];
              return (
                <button
                  key={panelKey}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                    activePanel === panelKey
                      ? "bg-cyan/15 text-white shadow-glow"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                  onClick={() => setActivePanel(panelKey)}
                >
                  <Icon size={18} />
                  <span className="capitalize">{panelKey}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 rounded-3xl border border-cyan/20 bg-cyan/10 p-5">
            <div className="flex items-center gap-2 text-cyan">
              <BadgeAlert size={16} />
              <span className="text-sm font-medium">Priority Alert</span>
            </div>
            <div className="mt-3 text-xl font-semibold text-white">{selectedCase.debtor_name}</div>
            <div className="mt-2 text-sm text-slate-200">{selectedCase.recommended_action}</div>
            <div className="mt-4 inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white ring-1 ring-white/10">
              Score {selectedCase.priority_score}
            </div>
          </div>
        </aside>

        <main className="relative p-5 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-panel/85 p-6 shadow-glow backdrop-blur xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.32em] text-cyan">Investigation Intelligence Platform</div>
                <h2 className="mt-2 text-3xl font-semibold text-white">Operational command surface</h2>
                <p className="mt-2 max-w-3xl text-sm text-slate-400">
                  Every record becomes a node, every overlap becomes a lead, and every lead is scored for actionability.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MetricCard label="Active Cases" value={platform.metrics.active_cases} accent="cyan" />
                <MetricCard label="Red Heat" value={platform.metrics.high_priority} accent="rose" />
                <MetricCard label="Success Rate" value={`${platform.metrics.success_rate}%`} accent="lime" />
                <MetricCard label="Graph Links" value={platform.metrics.graph_links} accent="amber" />
              </div>
            </header>

            {(activePanel === "dashboard" || activePanel === "cases") && (
              <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                  <PanelCard title="Intelligence Dashboard" eyebrow="Live case posture">
                    <div className="grid gap-4 md:grid-cols-4">
                      <HeatCard label="Total cases" value={platform.metrics.total_cases} tone="cyan" />
                      <HeatCard label="Locate days avg" value={platform.metrics.average_locate_days} tone="amber" />
                      <HeatCard label="Investigations active" value={platform.metrics.active_cases} tone="rose" />
                      <HeatCard label="Links detected" value={platform.metrics.graph_links} tone="lime" />
                    </div>
                    <div className="mt-6 h-64 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={platform.analytics.resolution_by_week}>
                          <defs>
                            <linearGradient id="resolvedGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#63e6ff" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#63e6ff" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip />
                          <Area type="monotone" dataKey="linked" stroke="#fb7185" fillOpacity={0.15} fill="#fb7185" />
                          <Area type="monotone" dataKey="resolved" stroke="#63e6ff" fill="url(#resolvedGlow)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </PanelCard>

                  <PanelCard title="Case Management" eyebrow="Filter and prioritize">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <input
                        className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                        placeholder="Filter by case, debtor, or cluster..."
                        value={filter}
                        onChange={(event) => setFilter(event.target.value)}
                      />
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Click a row to open intelligence view</div>
                    </div>
                    <div className="overflow-hidden rounded-3xl border border-white/10">
                      <table className="min-w-full divide-y divide-white/10 text-sm">
                        <thead className="bg-white/5 text-slate-400">
                          <tr>
                            <th className="px-4 py-3 text-left">Case</th>
                            <th className="px-4 py-3 text-left">Subject</th>
                            <th className="px-4 py-3 text-left">Cluster</th>
                            <th className="px-4 py-3 text-left">Priority</th>
                            <th className="px-4 py-3 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {visibleCases.map((item) => (
                            <tr
                              key={item.id}
                              className="cursor-pointer bg-slate-950/40 transition hover:bg-cyan/10"
                              onClick={() => void openCase(item.id)}
                            >
                              <td className="px-4 py-3 font-medium text-white">{item.id}</td>
                              <td className="px-4 py-3">{item.debtor_name}</td>
                              <td className="px-4 py-3 text-slate-300">{item.location_cluster}</td>
                              <td className="px-4 py-3">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${heatTone[item.priority_band]}`}>
                                  {item.priority_band} {item.priority_score}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-300">{item.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </PanelCard>
                </div>

                <div className="space-y-6">
                  <PanelCard title="Live Intelligence Feed" eyebrow="Streaming analysis">
                    <div className="space-y-3">
                      {platform.feed.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                          <div className="flex items-center justify-between">
                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                                item.severity === "high"
                                  ? "bg-rose-500/20 text-rose-200"
                                  : item.severity === "medium"
                                    ? "bg-amber-500/20 text-amber-100"
                                    : "bg-lime-500/20 text-lime-100"
                              }`}
                            >
                              {item.severity}
                            </span>
                            <span className="text-xs text-slate-500">{item.timestamp}</span>
                          </div>
                          <p className="mt-3 text-sm text-slate-200">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  </PanelCard>

                  <PanelCard title="AI Insight Panel" eyebrow="Narrative guidance">
                    <div className="space-y-4">
                      {selectedCase.insights.map((insight) => (
                        <div key={insight.title} className="rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-white">{insight.title}</div>
                            <div className="text-xs uppercase tracking-[0.2em] text-cyan">{insight.confidence}%</div>
                          </div>
                          <p className="mt-2 text-sm text-slate-200">{insight.body}</p>
                        </div>
                      ))}
                    </div>
                  </PanelCard>
                </div>
              </section>
            )}

            {(activePanel === "cases" || activePanel === "graph") && (
              <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <PanelCard title="Case Intelligence View" eyebrow="Subject, identifiers, and leads">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-semibold text-white">{selectedCase.debtor_name}</div>
                        <div className="mt-1 text-sm text-slate-400">
                          {selectedCase.id} • {selectedCase.location_cluster} • {selectedCase.investigator}
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${heatTone[selectedCase.priority_band]}`}>
                        {selectedCase.priority_band} Priority
                      </span>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Known Identifiers</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedCase.identifiers.map((item) => (
                          <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Timeline</div>
                      <div className="mt-4 space-y-4">
                        {selectedCase.timeline.map((event) => (
                          <div key={event.id} className="flex gap-3">
                            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan" />
                            <div>
                              <div className="text-sm font-medium text-white">
                                {event.label} <span className="text-slate-500">{event.timestamp}</span>
                              </div>
                              <div className="text-sm text-slate-400">{event.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PanelCard>

                <PanelCard title="Relationship Graph" eyebrow="Expandable intelligence map">
                  <div className="mb-4 flex flex-wrap gap-3">
                    {selectedCase.next_leads.map((lead) => (
                      <div key={lead.title} className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3">
                        <div className="text-sm font-semibold text-white">{lead.title}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-amber-100">{lead.probability}% probable</div>
                        <div className="mt-2 text-sm text-slate-300">{lead.action}</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70">
                    <ReactFlow fitView nodes={graphData.nodes} edges={graphData.edges}>
                      <MiniMap nodeColor={() => "#63e6ff"} maskColor="rgba(8,20,31,0.7)" />
                      <Controls />
                      <Background color="#1e293b" gap={22} />
                    </ReactFlow>
                  </div>
                </PanelCard>
              </section>
            )}

            {activePanel === "analytics" && (
              <section className="grid gap-6 xl:grid-cols-2">
                <PanelCard title="Resolution Momentum" eyebrow="Weekly performance">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platform.analytics.performance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Bar dataKey="score" radius={[12, 12, 0, 0]}>
                          {platform.analytics.performance.map((entry) => (
                            <Cell key={entry.name} fill={entry.score > 88 ? "#63e6ff" : "#f97316"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </PanelCard>

                <PanelCard title="Priority Heat System" eyebrow="Red, amber, green">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={platform.analytics.priority_mix} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={4}>
                          <Cell fill="#fb7185" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#84cc16" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </PanelCard>
              </section>
            )}

            {activePanel === "report" && (
              <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <PanelCard title="Report Generator" eyebrow="Audit-ready output">
                  <div className="space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="text-sm text-slate-400">Generated</div>
                      <div className="mt-2 text-lg font-semibold text-white">{report.generated_at}</div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="text-sm text-slate-400">Compliance</div>
                      <div className="mt-2 text-sm text-slate-200">{report.compliance_note}</div>
                    </div>
                    <button
                      className="inline-flex items-center gap-2 rounded-2xl bg-cyan px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan/90"
                      onClick={() => setActivePanel("cases")}
                    >
                      <AlertTriangle size={16} />
                      Return to active case
                    </button>
                  </div>
                </PanelCard>

                <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] p-8 text-slate-900 shadow-glow">
                  <div className="border-b border-slate-200 pb-5">
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Echo Investigations Report</div>
                    <h3 className="mt-2 text-3xl font-semibold">{report.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm text-slate-600">{report.executive_summary}</p>
                  </div>

                  <ReportSection title="Key Findings" items={report.findings} />
                  <ReportSection title="Linked Relationships" items={report.relationships} />
                  <ReportSection title="Recommended Actions" items={report.recommended_actions} />
                </div>
              </section>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string | number; accent: "cyan" | "rose" | "lime" | "amber" }) {
  const accentClass =
    accent === "cyan" ? "text-cyan" : accent === "rose" ? "text-rose-300" : accent === "lime" ? "text-lime-300" : "text-amber-200";
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${accentClass}`}>{value}</div>
    </div>
  );
}

function HeatCard({ label, value, tone }: { label: string; value: string | number; tone: "cyan" | "amber" | "rose" | "lime" }) {
  const styles =
    tone === "cyan"
      ? "from-cyan/20 to-cyan/5"
      : tone === "amber"
        ? "from-amber-500/20 to-amber-500/5"
        : tone === "rose"
          ? "from-rose-500/20 to-rose-500/5"
          : "from-lime-500/20 to-lime-500/5";
  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${styles} p-5`}>
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

function PanelCard({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-panelSoft/80 p-6 shadow-glow backdrop-blur">
      <div className="mb-5">
        <div className="text-xs uppercase tracking-[0.28em] text-cyan">{eyebrow}</div>
        <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ReportSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-8">
      <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h4>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
