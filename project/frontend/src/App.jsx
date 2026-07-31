import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Conversations, Knowledge Base, Integrations, Billing, Settings, etc.
            are listed in the sidebar but not built yet — add their routes here
            as you build each page. */}
      </Routes>
    </BrowserRouter>
  );
}
