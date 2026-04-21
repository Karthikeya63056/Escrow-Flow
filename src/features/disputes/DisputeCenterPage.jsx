import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/FormElements";
import { formatCurrency, formatRelative } from "../../lib/utils";
import { AlertTriangle, MessageCircle, FileUp, Send, User, Shield } from "lucide-react";

const MOCK_DISPUTES = [
  {
    id: "d1",
    escrowTitle: "E-Commerce Platform Redesign",
    amount: 5000,
    status: "open",
    reason: "Deliverables do not match the initial specification. Missing responsive design and payment integration.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    messages: [
      { id: 1, sender: "buyer", name: "Alex Morgan", content: "The delivered frontend is missing responsive breakpoints and the payment gateway integration was not included.", time: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: 2, sender: "seller", name: "Sarah Chen", content: "Responsive design was not explicitly mentioned in the milestone scope. Payment integration is part of Milestone 3.", time: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: 3, sender: "arbitrator", name: "Mike Torres", content: "I've reviewed the contract. Responsive design is implied under 'modern UI'. I recommend the seller add responsive breakpoints within 5 days.", time: new Date(Date.now() - 1 * 86400000).toISOString() },
    ],
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DisputeCenterPage() {
  const [selected, setSelected] = useState(MOCK_DISPUTES[0]);
  const [newMessage, setNewMessage] = useState("");

  const senderStyles = {
    buyer: { color: "text-neon", bg: "bg-neon/10", border: "border-neon/20", icon: User },
    seller: { color: "text-neon-purple", bg: "bg-neon-purple/10", border: "border-neon-purple/20", icon: User },
    arbitrator: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", icon: Shield },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-warning" /> Dispute Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage and resolve escrow disputes</p>
        </div>
        <Badge variant="warning">{MOCK_DISPUTES.length} Active</Badge>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispute List */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader><CardTitle>Disputes</CardTitle></CardHeader>
            <div className="space-y-2">
              {MOCK_DISPUTES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelected(d)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.id === d.id ? "border-warning/30 bg-warning/5" : "border-white/5 bg-surface-2/30 hover:bg-surface-2/60"
                  }`}
                >
                  <p className="text-sm font-medium text-white truncate">{d.escrowTitle}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{formatRelative(d.createdAt)}</span>
                    <span className="text-xs font-medium text-warning">{formatCurrency(d.amount)}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Chat + Evidence */}
        <motion.div variants={item} className="lg:col-span-2">
          {selected ? (
            <Card className="flex flex-col h-[600px]">
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selected.escrowTitle}</h3>
                  <p className="text-xs text-gray-500 mt-1">{selected.reason}</p>
                </div>
                <Badge variant="warning">Open</Badge>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {selected.messages.map((msg) => {
                  const style = senderStyles[msg.sender];
                  const Icon = style.icon;
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${style.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${style.color}`}>{msg.name}</span>
                          <span className="text-[10px] text-gray-600">{msg.sender}</span>
                          <span className="text-[10px] text-gray-600 ml-auto">{formatRelative(msg.time)}</span>
                        </div>
                        <div className={`p-3 rounded-xl ${style.bg} border ${style.border}`}>
                          <p className="text-sm text-gray-300">{msg.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="pt-4 border-t border-white/5 mt-4 flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-surface-2 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all">
                  <FileUp className="w-4 h-4" />
                </button>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 h-10 px-4 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-warning/50"
                />
                <Button size="md" className="bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-[600px] text-gray-500">
              <p>Select a dispute to view details</p>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
