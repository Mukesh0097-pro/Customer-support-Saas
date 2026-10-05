import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, delta, trend = "up", sparkline }) {
  return (
    <div className="panel panel-hover p-5">
      <div className="flex items-start justify-between">
        <div className="h-9 w-9 rounded-md flex items-center justify-center bg-black/[0.04] text-text-primary">
          <Icon size={17} />
        </div>
        <span
          className={`flex items-center gap-0.5 text-xs font-medium ${
            trend === "up" ? "text-signal-up" : "text-signal-down"
          }`}
        >
          {trend === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {delta}
        </span>
      </div>

      <p className="font-display tabular-nums text-2xl font-bold mt-4 tracking-tight">{value}</p>
      <p className="text-xs text-text-muted mt-1">{label}</p>

      {sparkline && (
        <div className="h-10 mt-3 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkline}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#000000"
                strokeWidth={1.5}
                fill={`url(#spark-${label})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
