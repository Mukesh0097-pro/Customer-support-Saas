import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-base-bg text-text-primary">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopNav />
        <main className="px-5 lg:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
