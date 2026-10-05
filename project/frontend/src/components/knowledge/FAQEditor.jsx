import { useState } from "react";
import { HelpCircle, Plus, Trash2, Search, X, Tag } from "lucide-react";

export default function FAQEditor({ faqs, onAddFAQ, onDeleteFAQ }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["all", "Billing", "Integration", "Security", "AI Agent", "General"];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" ||
      faq.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setIsSubmitting(true);
    await onAddFAQ({ question, answer, category });
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setIsSubmitting(false);
    setShowAddModal(false);
  };

  return (
    <div className="panel p-5 bg-white border border-base-border space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-base-border">
        <div>
          <h3 className="font-display font-semibold text-sm">Direct Q&A & FAQs</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Explicit Q&A pairs given 100% priority matching in SupportAI customer responses.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              type="text"
              placeholder="Search FAQs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-base-border rounded bg-black/[0.01] focus:outline-none focus:border-black"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white rounded hover:opacity-85 transition-opacity whitespace-nowrap"
          >
            <Plus size={14} />
            New FAQ Pair
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1 text-xs rounded-full capitalize transition-colors whitespace-nowrap ${
              selectedCategory.toLowerCase() === c.toLowerCase()
                ? "bg-black text-white font-medium"
                : "bg-black/[0.03] text-text-muted hover:bg-black/[0.07]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {filteredFaqs.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-text-muted text-xs border border-dashed border-base-border rounded">
            No FAQs found matching criteria. Click "New FAQ Pair" to add one.
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="p-4 rounded border border-base-border bg-black/[0.01] hover:border-black/30 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-black/[0.05] text-text-primary">
                    <Tag size={10} />
                    {faq.category || "General"}
                  </span>

                  <button
                    onClick={() => onDeleteFAQ(faq.id)}
                    title="Delete FAQ"
                    className="text-text-faint hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <h4 className="text-xs font-semibold text-text-primary flex items-start gap-1.5">
                  <HelpCircle size={14} className="text-black shrink-0 mt-0.5" />
                  {faq.question}
                </h4>

                <p className="text-xs text-text-muted mt-2 leading-relaxed bg-white p-3 rounded border border-base-border/60">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: New FAQ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-base-border rounded-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-base-border">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-black" />
                <h4 className="font-display font-semibold text-base">Add FAQ Pair</h4>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-text-faint hover:text-black p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white"
                >
                  <option value="Billing">Billing</option>
                  <option value="Integration">Integration</option>
                  <option value="Security">Security</option>
                  <option value="AI Agent">AI Agent</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Customer Question
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How do I request a tax invoice receipt?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Official AI Response Answer
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter the exact, verified response the AI should deliver…"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium border border-base-border rounded hover:bg-black/[0.02]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium bg-black text-white rounded hover:opacity-85 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving…" : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
