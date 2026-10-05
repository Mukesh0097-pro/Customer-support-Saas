import { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Mail,
  CheckCircle2,
  Clock,
  ChevronDown,
  Info,
} from "lucide-react";

const ROLES = [
  {
    role: "Admin",
    desc: "Full workspace configuration, billing access, API keys, AI model fine-tuning, and team management.",
  },
  {
    role: "Support Lead",
    desc: "Manage tickets, triage escalations, add knowledge base docs & FAQs, and review AI responses.",
  },
  {
    role: "Support Agent",
    desc: "Handle live chat queues, respond to escalated customer tickets, and trigger RAG lookups.",
  },
];

export default function TeamManager({
  teamMembers = [],
  onInviteMember,
  onUpdateRole,
  onRemoveMember,
}) {
  const [isInviting, setIsInviting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Support Agent");
  const [removingId, setRemovingId] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    await onInviteMember({ name: name.trim(), email: email.trim(), role });
    setName("");
    setEmail("");
    setRole("Support Agent");
    setIsInviting(false);
  };

  const handleRoleChange = async (id, newRole) => {
    if (onUpdateRole) {
      await onUpdateRole(id, { role: newRole });
    }
  };

  const handleRemoveConfirm = async (id) => {
    await onRemoveMember(id);
    setRemovingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Main Team Table Panel */}
      <div className="panel p-6 bg-white border border-base-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-border">
          <div>
            <h3 className="font-display font-semibold text-sm text-text-primary">
              Team Members & Role-Based Access Control
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Invite support engineers, managers, and administrators to collaborate on ticket triage and AI governance.
            </p>
          </div>

          <button
            onClick={() => setIsInviting(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-black text-white rounded hover:opacity-85 transition-opacity self-start sm:self-auto"
          >
            <UserPlus size={14} />
            Invite Member
          </button>
        </div>

        {/* Team Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-base-border text-text-muted font-medium">
                <th className="pb-3 pr-4">Team Member</th>
                <th className="pb-3 px-4">Email Address</th>
                <th className="pb-3 px-4">Role & Access</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-border/70">
              {teamMembers.map((m) => (
                <tr key={m.id} className="hover:bg-black/[0.015] transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {m.avatar || (m.name ? m.name.slice(0, 2).toUpperCase() : "TM")}
                      </div>
                      <span className="font-medium text-text-primary">{m.name}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-text-muted font-mono text-[11px]">
                    {m.email}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.id, e.target.value)}
                      className="px-2.5 py-1 text-xs border border-base-border rounded bg-white font-medium text-text-primary focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Support Lead">Support Lead</option>
                      <option value="Support Agent">Support Agent</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4">
                    {m.status === "Active" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-medium border border-emerald-500/20">
                        <CheckCircle2 size={10} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-medium border border-amber-500/20">
                        <Clock size={10} /> Invited
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 pl-4 text-right">
                    {removingId === m.id ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRemoveConfirm(m.id)}
                          className="px-2 py-1 text-[11px] bg-rose-600 text-white rounded hover:bg-rose-700 font-medium"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => setRemovingId(null)}
                          className="px-2 py-1 text-[11px] border border-base-border rounded text-text-muted hover:text-text-primary"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRemovingId(m.id)}
                        disabled={m.role === "Admin" && teamMembers.filter((t) => t.role === "Admin").length <= 1}
                        className="p-1.5 rounded text-text-faint hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        title={m.role === "Admin" && teamMembers.filter((t) => t.role === "Admin").length <= 1 ? "Cannot remove last admin" : "Remove Member"}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix Details */}
      <div className="panel p-6 bg-white border border-base-border space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-base-border">
          <Shield size={16} className="text-black" />
          <h4 className="font-display font-semibold text-xs text-text-primary">
            Role Permissions Overview
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROLES.map((r, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-base-border bg-black/[0.015] space-y-1.5">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-semibold text-text-primary">{r.role}</h5>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/[0.06] font-mono">
                  {idx === 0 ? "Full Access" : idx === 1 ? "Moderator" : "Standard"}
                </span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-lg border border-base-border p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 pb-2 border-b border-base-border">
              <UserPlus size={16} className="text-black" />
              <h3 className="font-display font-semibold text-sm">Invite Team Member</h3>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex.m@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Assigned Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white"
                >
                  <option value="Admin">Admin (Full Control)</option>
                  <option value="Support Lead">Support Lead (Tickets & Docs)</option>
                  <option value="Support Agent">Support Agent (Live Chat Only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-border">
                <button
                  type="button"
                  onClick={() => setIsInviting(false)}
                  className="px-3 py-1.5 text-xs border border-base-border rounded text-text-muted hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium bg-black text-white rounded hover:opacity-85"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
