import { fallbackPlatformData, fallbackReports } from "./demoData";
import type { IntelligenceCase, PlatformPayload, ReportPayload } from "./types";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const normalizedBaseUrl = configuredBaseUrl
  ? configuredBaseUrl.startsWith("http")
    ? configuredBaseUrl
    : `https://${configuredBaseUrl}`
  : "http://127.0.0.1:8000";
const API_BASE = `${normalizedBaseUrl.replace(/\/$/, "")}/api`;

async function attemptJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`);
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function loadPlatformData(): Promise<PlatformPayload> {
  return attemptJson<PlatformPayload>("/platform", fallbackPlatformData);
}

export async function loadCase(caseId: string): Promise<IntelligenceCase> {
  const fallbackCase =
    fallbackPlatformData.cases.find((item) => item.id === caseId) ?? fallbackPlatformData.cases[0];
  return attemptJson<IntelligenceCase>(`/cases/${caseId}`, fallbackCase);
}

export async function loadReport(caseId: string): Promise<ReportPayload> {
  const fallbackReport = fallbackReports[caseId] ?? fallbackReports["ECHO-101"];
  return attemptJson<ReportPayload>(`/reports/${caseId}`, fallbackReport);
}
