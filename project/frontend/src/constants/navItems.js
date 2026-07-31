import {
  LayoutDashboard,
  MessagesSquare,
  Inbox,
  BookOpen,
  FileText,
  Globe,
  Headset,
  Users,
  BarChart3,
  Plug,
  CreditCard,
  Settings,
} from "lucide-react";

// Only "dashboard" is a live route in this build — the rest are placeholders
// so the sidebar reflects the full product map without requiring every
// page to be built yet.
export const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", active: true },
  { key: "conversations", label: "Conversations", icon: MessagesSquare, path: "/conversations" },
  { key: "ai-inbox", label: "AI Inbox", icon: Inbox, path: "/ai-inbox" },
  { key: "knowledge-base", label: "Knowledge Base", icon: BookOpen, path: "/knowledge-base" },
  { key: "documents", label: "Documents", icon: FileText, path: "/documents" },
  { key: "crawler", label: "Website Crawler", icon: Globe, path: "/crawler" },
  { key: "live-agents", label: "Live Agents", icon: Headset, path: "/live-agents" },
  { key: "customers", label: "Customers", icon: Users, path: "/customers" },
  { key: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
  { key: "integrations", label: "Integrations", icon: Plug, path: "/integrations" },
  { key: "billing", label: "Billing", icon: CreditCard, path: "/billing" },
  { key: "settings", label: "Settings", icon: Settings, path: "/settings" },
];
