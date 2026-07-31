import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const data = [
  { week: "W1", rate: 78 },
  { week: "W2", rate: 82 },
  { week: "W3", rate: 80 },
  { week: "W4", rate: 88 },
  { week: "W5", rate: 91 },
  { week: "W6", rate: 94 },
];

export default function ResolutionRateChart() {
  return (
    <div className="panel p-5 h-[320px]">
      <h3 className="font-display font-semibold text-sm">AI resolution rate</h3>
      <p className="text-xs text-text-faint mt-0.5 mb-4">Weekly, without human escalation</p>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ left: -20, right: 8 }}>
          <CartesianGrid stroke="rgba(0,0,0,0.08)" vertical={false} />
          <XAxis dataKey="week" stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#666666" fontSize={12} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === data.length - 1 ? "#000000" : "rgba(0,0,0,0.35)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
