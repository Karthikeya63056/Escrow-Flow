import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/FormElements";
import { formatCurrency, formatRelative } from "../../lib/utils";
import { AlertTriangle, MessageCircle, FileUp, Send, User, Shield, Image, Paperclip } from "lucide-react";

const MOCK_DISPUTES = [
  {
    id: "d1",
    escrowTitle: "E-Commerce Platform Redesign",
    amount: 5000,
    status: "open",
    reason: "Deliverables do not match the initial specification. Missing responsive design and payment integration.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    messages: [
      { id: 1, sender: "buyer", name: "Alex Morgan", content: "The delivered frontend is missing responsive breakpoints and the payment gateway integration was not included.", time: new Date(Date.now() - 3 * 86400000).toISOString(), type: "text" },
      { id: 2, sender: "seller", name: "Sarah Chen", content: "Responsive design was not explicitly mentioned in the milestone scope. Payment integration is part of Milestone 3.", time: new Date(Date.now() - 2.5 * 86400000).toISOString(), type: "text" },
      { id: 3, sender: "buyer", name: "Alex Morgan", content: "", time: new Date(Date.now() - 2 * 86400000).toISOString(), type: "evidence", fileName: "contract_screenshot.png", fileSize: "245 KB" },
      { id: 4, sender: "arbitrator", name: "Mike Torres", content: "I've reviewed the contract and the evidence. Responsive design is implied under 'modern UI'. I recommend the seller add responsive breakpoints within 5 business days. If that's done, the milestone should be approved.", time: new Date(Date.now() - 1 * 86400000).toISOString(), type: "text" },
      { id: 5, sender: "system", name: "AI Assistant", content: "📊 AI Analysis: Based on the contract terms, responsive design is standard practice for 'modern UI' deliverables. Recommendation: 70% probability the arbitrator rules in favor of the buyer for this specific point.", time: new Date(Date.now() - 12 * 3600000).toISOString(), type: "ai" },
    ],
  },
  {
    id: "d2",
    escrowTitle: "Mobile App MVP",
    amount: 5000,
    status: "pending",
    reason: "Seller has not delivered any work after 2 weeks of the funded milestone.",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    messages: [
      { id: 6, sender: "buyer", name: "Alex Morgan", content: "It's been 14 days since the milestone was funded and I haven't received any updates or deliverables.", time: new Date(Date.now() - 1 * 86400000).toISOString(), type: "text" },
    ],
  },
];

const senderConfig = {
  buyer: { color: "text-neon", bg: "bg-neon/10", border: "border-neon/20", icon: User },
  seller: { color: "text-neon-purple", bg: "bg-neon-purple/10", border: "border-neon-purple/20", icon: User },
  arbitrator: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", icon: Shield },
  system: { color: "text-gray-400", bg: "bg-white/5", border: "border-white/10", icon: MessageCircle },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DisputeCenterPage() {
  const [selected, setSelected] = useState(MOCK_DISPUTES[0]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [selected?.messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    selected.messages.push({
      id: Date.now(),
      sender: "buyer",
      name: "Alex Morgan",
      content: newMessage,
      time: new Date().toISOString(),
      type: "text",
    });
    setNewMessage("");
    setIsTyping(true);

    // Simulate arbitrator typing
    setTimeout(() => {
      setIsTyping(false);
      selected.messages.push({
        id: Date.now() + 1,
        sender: "arbitrator",
        name: "Mike Torres",
        content: "Thank you for the update. I'll review this and provide my assessment within 24 hours.",
        time: new Date().toISOString(),
        type: "text",
      });
      setSelected({ ...selected });
    }, 2500);

    setSelected({ ...selected });
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
        <div className="flex gap-2">
          <Badge variant="warning">{MOCK_DISPUTES.filter((d) => d.status === "open").length} Open</Badge>
          <Badge variant="default">{MOCK_DISPUTES.filter((d) => d.status === "pending").length} Pending</Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: "70vh" }}>
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
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{d.reason}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-gray-600">{formatRelative(d.createdAt)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{d.messages.length} msgs</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        d.status === "open" ? "bg-warning/10 text-warning" : "bg-gray-500/10 text-gray-400"
                      }`}>{d.status}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Chat */}
        <motion.div variants={item} className="lg:col-span-2">
          {selected ? (
            <Card className="flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 flex-shrink-0">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selected.escrowTitle}</h3>
                  <p className="text-xs text-gray-500 mt-1">{selected.reason}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="warning">{formatCurrency(selected.amount)}</Badge>
                </div>
              </div>

              {/* Messages */}
              <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">
                {selected.messages.map((msg) => {
                  const config = senderConfig[msg.sender] || senderConfig.system;
                  const Icon = config.icon;

                  if (msg.type === "evidence") {
                    return (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${config.color}`}>{msg.name}</span>
                            <span className="text-[10px] text-gray-600 ml-auto">{formatRelative(msg.time)}</span>
                          </div>
                          <div className={`p-3 rounded-xl ${config.bg} border ${config.border} inline-flex items-center gap-3`}>
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                              <Image className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm text-white font-medium">{msg.fileName}</p>
                              <p className="text-[10px] text-gray-500">{msg.fileSize} • Evidence</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  if (msg.type === "ai") {
                    return (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-neon-purple" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-neon-purple">{msg.name}</span>
                            <Badge variant="purple" className="text-[9px]">AI</Badge>
                            <span className="text-[10px] text-gray-600 ml-auto">{formatRelative(msg.time)}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-neon-purple/5 border border-neon-purple/20">
                            <p className="text-sm text-gray-300 leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${config.color}`}>{msg.name}</span>
                          <span className="text-[10px] text-gray-600">{msg.sender}</span>
                          <span className="text-[10px] text-gray-600 ml-auto">{formatRelative(msg.time)}</span>
                        </div>
                        <div className={`p-3 rounded-xl ${config.bg} border ${config.border}`}>
                          <p className="text-sm text-gray-300 leading-relaxed">{msg.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center"><Shield className="w-4 h-4 text-warning" /></div>
                    <div className="bg-warning/5 border border-warning/20 rounded-xl px-4 py-3">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-warning/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-warning/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-warning/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="pt-4 border-t border-white/5 mt-4 flex gap-2 flex-shrink-0">
                <button className="w-10 h-10 rounded-xl bg-surface-2 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all" title="Attach evidence">
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  placeholder="Type your response..."
                  className="flex-1 h-10 px-4 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-warning/50 transition-colors"
                />
                <Button onClick={handleSend} size="md" className="bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20 shadow-none">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-full text-gray-500">
              <p>Select a dispute to view</p>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
