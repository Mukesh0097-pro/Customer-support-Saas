import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { day: "Mon", ai: 240, human: 40 },
  { day: "Tue", ai: 300, human: 52 },
  { day: "Wed", ai: 280, human: 45 },
  { day: "Thu", ai: 360, human: 38 },
  { day: "Fri", ai: 410, human: 60 },
  { day: "Sat", ai: 260, human: 22 },
  { day: "Sun", ai: 230, human: 18 },
];

export default function ConversationTrends() {
  return (
    <div className="panel p-5 h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-sm">Conversation trends</h3>
          <p className="text-xs text-text-faint mt-0.5">AI vs human handled, last 7 days</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-black" />AI</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-black/30" />Human</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ left: -20, right: 8 }}>
          <CartesianGrid stroke="rgba(0,0,0,0.08)" vertical={false} />
          <XAxis dataKey="day" stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#666666" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Line type="monotone" dataKey="ai" stroke="#000000" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="human" stroke="#666666" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
