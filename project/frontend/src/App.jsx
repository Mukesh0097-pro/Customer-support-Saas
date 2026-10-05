import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Conversations from "./pages/Conversations/Conversations";
import KnowledgeBase from "./pages/KnowledgeBase/KnowledgeBase";
import Settings from "./pages/Settings/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
