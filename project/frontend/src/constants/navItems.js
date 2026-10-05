import { LayoutDashboard, BookOpen, Settings, MessageSquare } from "lucide-react";

export const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { key: "conversations", label: "Live Inbox", icon: MessageSquare, path: "/conversations" },
  { key: "knowledge-base", label: "Knowledge Base", icon: BookOpen, path: "/knowledge-base" },
  { key: "settings", label: "Settings", icon: Settings, path: "/settings" },
];
