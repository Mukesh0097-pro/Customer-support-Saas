import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "AI resolved", value: 82 },
  { name: "Human resolved", value: 18 },
];
const COLORS = ["#000000", "#9CA3AF"];

export default function AIvsHumanChart() {
  return (
    <div className="panel p-5 h-[320px] flex flex-col">
      <h3 className="font-display font-semibold text-sm">AI vs human responses</h3>
      <p className="text-xs text-text-faint mt-0.5">Share of resolved conversations</p>
      <div className="flex-1 flex items-center">
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={78}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-black" />AI · 82%</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-black/30" />Human · 18%</span>
      </div>
    </div>
  );
}
