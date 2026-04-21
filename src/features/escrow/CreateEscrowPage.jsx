import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Textarea, Select } from "../../components/ui/FormElements";
import { PROJECT_CATEGORIES } from "../../lib/constants";
import { useEscrowStore, useAuthStore } from "../../store";
import { Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const steps = ["Details", "Milestones", "Review"];

export default function CreateEscrowPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", category: "", sellerEmail: "", deadline: "",
    budget: "",
  });
  const [milestones, setMilestones] = useState([{ title: "", amount: "" }]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addMilestone = () => setMilestones((ms) => [...ms, { title: "", amount: "" }]);
  const removeMilestone = (i) => setMilestones((ms) => ms.filter((_, idx) => idx !== i));
  const updateMilestone = (i, field, value) =>
    setMilestones((ms) => ms.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));

  const totalMilestones = milestones.reduce((s, m) => s + (Number(m.amount) || 0), 0);
  const budget = Number(form.budget) || 0;

  const canNext = () => {
    if (step === 0) return form.title && form.description && form.category && form.budget;
    if (step === 1) return milestones.every((m) => m.title && m.amount) && totalMilestones === budget;
    return true;
  };

  const handleSubmit = () => {
    toast.success("Escrow created successfully!");
    navigate("/");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create New Escrow</h1>
        <p className="text-sm text-gray-500 mt-1">Set up a secure escrow agreement</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-1 ${
              i === step ? "bg-neon/10 text-neon border border-neon/20" :
              i < step ? "bg-neon-green/10 text-neon-green border border-neon-green/20" :
              "bg-surface-2/50 text-gray-500 border border-white/5"
            }`}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-xs">{i + 1}</span>}
              {s}
            </div>
            {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-neon-green" : "bg-white/10"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Details */}
        {step === 0 && (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="space-y-5">
              <CardTitle>Escrow Details</CardTitle>
              <Input label="Title" placeholder="E.g., Website Redesign Project" value={form.title} onChange={(e) => update("title", e.target.value)} />
              <Textarea label="Description" placeholder="Describe the work, deliverables, and expectations..." rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Category" value={form.category} onChange={(e) => update("category", e.target.value)} options={[{ value: "", label: "Select..." }, ...PROJECT_CATEGORIES.map((c) => ({ value: c, label: c }))]} />
                <Input label="Total Budget ($)" type="number" placeholder="5000" value={form.budget} onChange={(e) => update("budget", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Seller Email" placeholder="seller@example.com" value={form.sellerEmail} onChange={(e) => update("sellerEmail", e.target.value)} />
                <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Milestones */}
        {step === 1 && (
          <motion.div key="milestones" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="space-y-5">
              <div className="flex items-center justify-between">
                <CardTitle>Milestones</CardTitle>
                <span className={`text-sm font-medium ${totalMilestones === budget ? "text-neon-green" : "text-warning"}`}>
                  ${totalMilestones.toLocaleString()} / ${budget.toLocaleString()}
                </span>
              </div>
              <div className="space-y-3">
                {milestones.map((ms, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 items-end p-4 rounded-xl bg-surface-2/30 border border-white/5">
                    <div className="flex-1">
                      <Input label={`Milestone ${i + 1}`} placeholder="Milestone title" value={ms.title} onChange={(e) => updateMilestone(i, "title", e.target.value)} />
                    </div>
                    <div className="w-32">
                      <Input label="Amount ($)" type="number" placeholder="0" value={ms.amount} onChange={(e) => updateMilestone(i, "amount", e.target.value)} />
                    </div>
                    {milestones.length > 1 && (
                      <button onClick={() => removeMilestone(i)} className="mb-1 p-2 text-gray-500 hover:text-danger rounded-lg hover:bg-danger/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
              {milestones.length < 10 && (
                <Button variant="ghost" size="sm" onClick={addMilestone}><Plus className="w-4 h-4" />Add Milestone</Button>
              )}
            </Card>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Card className="space-y-5">
              <CardTitle>Review & Confirm</CardTitle>
              <div className="space-y-3 divide-y divide-white/5">
                <div className="py-3"><p className="text-xs text-gray-500">Title</p><p className="text-white font-medium">{form.title}</p></div>
                <div className="py-3"><p className="text-xs text-gray-500">Description</p><p className="text-gray-300 text-sm">{form.description}</p></div>
                <div className="py-3 flex gap-8">
                  <div><p className="text-xs text-gray-500">Category</p><p className="text-white">{form.category}</p></div>
                  <div><p className="text-xs text-gray-500">Budget</p><p className="text-neon font-bold text-lg">${Number(form.budget).toLocaleString()}</p></div>
                </div>
                <div className="py-3">
                  <p className="text-xs text-gray-500 mb-2">Milestones</p>
                  {milestones.map((ms, i) => (
                    <div key={i} className="flex justify-between py-1.5">
                      <span className="text-sm text-gray-300">{i + 1}. {ms.title}</span>
                      <span className="text-sm font-medium text-white">${Number(ms.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        {step < 2 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
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
