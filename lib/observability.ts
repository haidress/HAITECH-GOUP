type CounterKey = "api_requests_total" | "api_errors_total";

const counters: Record<CounterKey, number> = {
  api_requests_total: 0,
  api_errors_total: 0
};

export function incrementMetric(key: CounterKey, value = 1) {
  counters[key] += value;
}

export function getMetricsSnapshot() {
  return { ...counters, collected_at: new Date().toISOString() };
}

export function logEvent(level: "info" | "warn" | "error", message: string, meta?: Record<string, unknown>) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...meta
  };
  console[level](JSON.stringify(payload));
}
