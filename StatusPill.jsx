export default function StatusPill({ value }) {
  const key = String(value || "Unknown").toLowerCase().replace(/\s+/g, "-");
  return <span className={`status-pill status-${key}`}>{value || "Unknown"}</span>;
}
