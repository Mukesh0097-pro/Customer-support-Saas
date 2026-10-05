import {
  MessagesSquare,
  Sparkles,
  Smile,
  Timer,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import ConversationTrends from "../../components/charts/ConversationTrends";
import RecentConversations from "../../components/RecentConversations";

const spark = (base) =>
  Array.from({ length: 8 }, (_, i) => ({ v: base + Math.sin(i) * base * 0.15 + i * 2 }));

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">
            SupportAI customer support analytics and recent conversations overview.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={MessagesSquare}
            label="Total conversations"
            value="4,218"
            delta="12.4%"
            trend="up"
            sparkline={spark(40)}
          />
          <StatCard
            icon={Sparkles}
            label="AI resolution rate"
            value="94.2%"
            delta="3.1%"
            trend="up"
            sparkline={spark(30)}
          />
          <StatCard
            icon={Smile}
            label="Customer satisfaction"
            value="4.8 / 5"
            delta="0.2"
            trend="up"
            sparkline={spark(20)}
          />
          <StatCard
            icon={Timer}
            label="Avg. response time"
            value="8.2s"
            delta="1.4s"
            trend="down"
            sparkline={spark(15)}
          />
        </div>

        {/* Charts & Real Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ConversationTrends />
          </div>
          <div>
            <RecentConversations />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
