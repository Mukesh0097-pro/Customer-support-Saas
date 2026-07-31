import { MessagesSquare, Sparkles, Smile, Timer, Users, CircleDollarSign } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import ConversationTrends from "../../components/charts/ConversationTrends";
import ResolutionRateChart from "../../components/charts/ResolutionRateChart";
import AIvsHumanChart from "../../components/charts/AIvsHumanChart";
import RecentConversations from "../../components/RecentConversations";

const spark = (base) =>
  Array.from({ length: 8 }, (_, i) => ({ v: base + Math.sin(i) * base * 0.15 + i * 2 }));

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">
          Here's how SupportAI is handling things today.
        </p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard icon={MessagesSquare} label="Total conversations" value="4,218" delta="12.4%" trend="up" sparkline={spark(40)} />
        <StatCard icon={Sparkles} label="AI resolution rate" value="94.2%" delta="3.1%" trend="up" sparkline={spark(30)} />
        <StatCard icon={Smile} label="Customer satisfaction" value="4.8 / 5" delta="0.2" trend="up" sparkline={spark(20)} />
        <StatCard icon={Timer} label="Avg. response time" value="8.2s" delta="1.4s" trend="down" sparkline={spark(15)} />
        <StatCard icon={Users} label="Active visitors" value="312" delta="18" trend="up" sparkline={spark(25)} />
        <StatCard icon={CircleDollarSign} label="AI cost today" value="$18.42" delta="2.1%" trend="down" sparkline={spark(10)} />
      </div>

      {/* analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        <div className="xl:col-span-2">
          <ConversationTrends />
        </div>
        <ResolutionRateChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
        <AIvsHumanChart />
        <div className="xl:col-span-2">
          <RecentConversations />
        </div>
      </div>
    </DashboardLayout>
  );
}
