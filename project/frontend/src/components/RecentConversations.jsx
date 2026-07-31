const rows = [
  { name: "Elena Ruiz", q: "Can I change my plan mid-cycle?", handler: "AI", status: "Resolved", time: "2m ago", priority: "Low" },
  { name: "Marcus Chen", q: "Refund not showing in my account yet", handler: "Human", status: "Open", time: "8m ago", priority: "High" },
  { name: "Priya Nair", q: "How do I connect Slack to my workspace?", handler: "AI", status: "Resolved", time: "24m ago", priority: "Low" },
  { name: "Tom Becker", q: "API key stopped working after upgrade", handler: "Human", status: "In progress", time: "41m ago", priority: "High" },
  { name: "Sara Kim", q: "Where can I download past invoices?", handler: "AI", status: "Resolved", time: "1h ago", priority: "Medium" },
];

const statusStyles = {
  Resolved: "text-signal-up",
  Open: "text-signal-down",
  "In progress": "text-signal-warn",
};
const priorityStyles = {
  Low: "text-text-faint",
  Medium: "text-text-muted",
  High: "text-text-primary",
};

export default function RecentConversations() {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm">Recent conversations</h3>
        <button className="text-xs text-text-muted hover:text-text-primary transition-colors">View all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-text-faint border-b border-base-border">
              <th className="font-medium pb-2.5 pr-4">Customer</th>
              <th className="font-medium pb-2.5 pr-4">Question</th>
              <th className="font-medium pb-2.5 pr-4">Handled by</th>
              <th className="font-medium pb-2.5 pr-4">Status</th>
              <th className="font-medium pb-2.5 pr-4">Priority</th>
              <th className="font-medium pb-2.5">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-base-border/60 last:border-0 hover:bg-black/[0.02] transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-black/[0.04] border border-base-border flex items-center justify-center text-[10px] font-semibold shrink-0">
                      {r.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-medium whitespace-nowrap">{r.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-text-muted max-w-[220px] truncate">{r.q}</td>
                <td className="py-3 pr-4">
                  <span className="text-xs font-medium px-2 py-1 rounded-full border border-base-border text-text-muted">
                    {r.handler}
                  </span>
                </td>
                <td className={`py-3 pr-4 text-xs font-medium ${statusStyles[r.status]}`}>{r.status}</td>
                <td className={`py-3 pr-4 text-xs font-medium ${priorityStyles[r.priority]}`}>{r.priority}</td>
                <td className="py-3 text-text-faint text-xs whitespace-nowrap">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
