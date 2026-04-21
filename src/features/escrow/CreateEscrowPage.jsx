import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Card, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Textarea, Select, Badge } from "../../components/ui/FormElements";
import { PROJECT_CATEGORIES } from "../../lib/constants";
import { useEscrowStore } from "../../store";
import { formatCurrency } from "../../lib/utils";
import { Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2, GripVertical, Zap, FileText, Code, Palette, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

const TEMPLATES = [
  { id: "blank", name: "Start from Scratch", icon: Plus, desc: "Build a custom escrow", milestones: [], budget: 0, category: "" },
  { id: "web-dev", name: "Web Development", icon: Code, desc: "Full-stack web project", category: "Web Development", budget: 8000, milestones: [
    { title: "Design & Wireframes", amount: 2000 },
    { title: "Frontend Development", amount: 3000 },
    { title: "Backend & Integration", amount: 2000 },
    { title: "Testing & Launch", amount: 1000 },
  ]},
  { id: "design", name: "Design Package", icon: Palette, desc: "Branding & UI design", category: "Graphic Design", budget: 4000, milestones: [
    { title: "Research & Concepts", amount: 1200 },
    { title: "Design Execution", amount: 1800 },
    { title: "Final Deliverables", amount: 1000 },
  ]},
  { id: "consulting", name: "Consulting Gig", icon: Briefcase, desc: "Advisory or audit work", category: "Consulting", budget: 5000, milestones: [
    { title: "Initial Assessment", amount: 2000 },
    { title: "Detailed Report", amount: 2000 },
    { title: "Follow-up Session", amount: 1000 },
  ]},
  { id: "content", name: "Content Creation", icon: FileText, desc: "Articles, copy, or media", category: "Content Writing", budget: 3000, milestones: [
    { title: "Outline & Draft", amount: 1000 },
    { title: "Revisions", amount: 1000 },
    { title: "Final Delivery", amount: 1000 },
  ]},
];

const steps = ["Template", "Details", "Milestones", "Review"];

export default function CreateEscrowPage() {
  const navigate = useNavigate();
  const { addEscrow } = useEscrowStore();
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", category: "", sellerEmail: "", deadline: "", budget: "", currency: "USD" });
  const [milestones, setMilestones] = useState([{ id: "ms-1", title: "", amount: "" }]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const addMilestone = () => setMilestones((ms) => [...ms, { id: `ms-${Date.now()}`, title: "", amount: "" }]);
  const removeMilestone = (i) => setMilestones((ms) => ms.filter((_, idx) => idx !== i));
  const updateMilestone = (i, field, value) => setMilestones((ms) => ms.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));

  const totalMilestones = milestones.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const budget = Number(form.budget) || 0;

  const applyTemplate = (t) => {
    setSelectedTemplate(t.id);
    if (t.id !== "blank") {
      setForm((f) => ({ ...f, category: t.category, budget: String(t.budget) }));
      setMilestones(t.milestones.map((m, i) => ({ id: `ms-${i}`, ...m, amount: String(m.amount) })));
    }
    setStep(1);
  };

  const canNext = () => {
    if (step === 1) return form.title.length >= 3 && form.description.length >= 10 && form.category && form.budget;
    if (step === 2) return milestones.every((m) => m.title && Number(m.amount) > 0) && totalMilestones === budget;
    return true;
  };

  const handleSubmit = () => {
    addEscrow({
      title: form.title,
      description: form.description,
      category: form.category,
      amount: budget,
      buyer: { id: "user-1", name: "Alex Morgan" },
      seller: { id: "new", name: form.sellerEmail || "Pending" },
      arbitrator: null,
      tags: [form.category],
      isPublic: false,
      deadline: form.deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
      milestones: milestones.map((m, i) => ({ id: `m-${Date.now()}-${i}`, title: m.title, amount: Number(m.amount), status: "pending", completedAt: null })),
    });
    toast.success("Escrow created successfully!");
    navigate("/");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create New Escrow</h1>
        <p className="text-sm text-gray-500 mt-1">Set up a secure escrow agreement in minutes</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <button
              onClick={() => { if (i < step) setStep(i); }}
              disabled={i > step}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all flex-1 ${
                i === step ? "bg-neon/10 text-neon border border-neon/20" :
                i < step ? "bg-neon-green/10 text-neon-green border border-neon-green/20 cursor-pointer hover:bg-neon-green/15" :
                "bg-surface-2/50 text-gray-600 border border-white/5"
              }`}
            >
              {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px]">{i + 1}</span>}
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < steps.length - 1 && <div className={`w-4 h-0.5 flex-shrink-0 ${i < step ? "bg-neon-green" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Template Selection */}
        {step === 0 && (
          <motion.div key="template" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon" />
                <CardTitle>Choose a Template</CardTitle>
              </div>
              <p className="text-sm text-gray-400">Start with a pre-built template or create from scratch</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEMPLATES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyTemplate(t)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selectedTemplate === t.id ? "border-neon/40 bg-neon/5" : "border-white/5 bg-surface-2/30 hover:border-white/15 hover:bg-surface-2/60"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-neon/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-neon" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{t.name}</p>
                          <p className="text-[10px] text-gray-500">{t.desc}</p>
                        </div>
                      </div>
                      {t.budget > 0 && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                          <span className="text-xs text-gray-500">{t.milestones.length} milestones</span>
                          <span className="text-xs font-medium text-neon">{formatCurrency(t.budget)}</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="space-y-5">
              <CardTitle>Escrow Details</CardTitle>
              <Input label="Title" placeholder="E.g., Website Redesign Project" value={form.title} onChange={(e) => update("title", e.target.value)} />
              <Textarea label="Description" placeholder="Describe the work, deliverables, and expectations..." rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" value={form.category} onChange={(e) => update("category", e.target.value)} options={[{ value: "", label: "Select..." }, ...PROJECT_CATEGORIES.map((c) => ({ value: c, label: c }))]} />
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input label="Budget" type="number" placeholder="5000" value={form.budget} onChange={(e) => update("budget", e.target.value)} />
                  </div>
                  <Select label="Currency" value={form.currency} onChange={(e) => update("currency", e.target.value)} options={[{ value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "GBP", label: "GBP" }, { value: "ETH", label: "ETH" }, { value: "BTC", label: "BTC" }]} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Seller Email" placeholder="seller@example.com" value={form.sellerEmail} onChange={(e) => update("sellerEmail", e.target.value)} />
                <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Milestones */}
        {step === 2 && (
          <motion.div key="milestones" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="space-y-5">
              <div className="flex items-center justify-between">
                <CardTitle>Milestones</CardTitle>
                <span className={`text-sm font-bold ${totalMilestones === budget ? "text-neon-green" : "text-warning"}`}>
                  {formatCurrency(totalMilestones)} / {formatCurrency(budget)}
                </span>
              </div>

              {/* Progress */}
              <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${budget > 0 ? Math.min((totalMilestones / budget) * 100, 100) : 0}%` }}
                  className={`h-full rounded-full transition-colors ${totalMilestones === budget ? "bg-neon-green" : totalMilestones > budget ? "bg-danger" : "bg-warning"}`}
                />
              </div>

              <Reorder.Group axis="y" values={milestones} onReorder={setMilestones} className="space-y-3">
                {milestones.map((ms, i) => (
                  <Reorder.Item key={ms.id} value={ms}>
                    <div className="flex gap-3 items-center p-4 rounded-xl bg-surface-2/30 border border-white/5 group">
                      <GripVertical className="w-4 h-4 text-gray-600 cursor-grab active:cursor-grabbing flex-shrink-0" />
                      <span className="text-xs text-gray-600 font-mono w-6">{i + 1}.</span>
                      <div className="flex-1">
                        <input
                          value={ms.title}
                          onChange={(e) => updateMilestone(i, "title", e.target.value)}
                          placeholder="Milestone title"
                          className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="number"
                          value={ms.amount}
                          onChange={(e) => updateMilestone(i, "amount", e.target.value)}
                          placeholder="$0"
                          className="w-full bg-transparent text-sm text-right text-white font-medium placeholder-gray-500 focus:outline-none"
                        />
                      </div>
                      {milestones.length > 1 && (
                        <button onClick={() => removeMilestone(i)} className="p-1.5 text-gray-600 hover:text-danger rounded-lg hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              {milestones.length < 10 && (
                <Button variant="ghost" size="sm" onClick={addMilestone}><Plus className="w-4 h-4" />Add Milestone</Button>
              )}
            </Card>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="space-y-5">
              <CardTitle>Review & Confirm</CardTitle>
              <div className="space-y-4 divide-y divide-white/5">
                <div className="py-3"><p className="text-xs text-gray-500 mb-1">Title</p><p className="text-white font-semibold text-lg">{form.title}</p></div>
                <div className="py-3"><p className="text-xs text-gray-500 mb-1">Description</p><p className="text-gray-300 text-sm leading-relaxed">{form.description}</p></div>
                <div className="py-3 flex gap-8 flex-wrap">
                  <div><p className="text-xs text-gray-500 mb-1">Category</p><Badge>{form.category}</Badge></div>
                  <div><p className="text-xs text-gray-500 mb-1">Budget</p><p className="text-2xl font-bold neon-text">{formatCurrency(budget)}</p></div>
                  <div><p className="text-xs text-gray-500 mb-1">Currency</p><p className="text-white">{form.currency}</p></div>
                </div>
                <div className="py-3">
                  <p className="text-xs text-gray-500 mb-3">Milestones ({milestones.length})</p>
                  <div className="space-y-2">
                    {milestones.map((ms, i) => (
                      <div key={ms.id} className="flex justify-between items-center py-2 px-3 rounded-lg bg-surface-2/30">
                        <span className="text-sm text-gray-300"><span className="text-gray-600 mr-2">{i + 1}.</span>{ms.title}</span>
                        <span className="text-sm font-medium text-white">{formatCurrency(Number(ms.amount))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={step > 0 && !canNext()}>
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <CheckCircle2 className="w-4 h-4" /> Create Escrow
          </Button>
        )}
      </div>
    </motion.div>
  );
}
