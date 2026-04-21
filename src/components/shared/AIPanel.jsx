import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "../../store";
import { Sparkles, X, Send, Bot, User } from "lucide-react";

const AI_RESPONSES = [
  "Based on the contract terms, the milestone deliverables appear clearly defined. I recommend proceeding with approval.",
  "The dispute evidence suggests a communication gap. I'd recommend requesting a revision with specific feedback rather than escalating.",
  "This escrow has a low risk score (12%). Both parties have strong reputation histories.",
  "I've analyzed the GitHub repository linked to this milestone. 84% of the requirements appear to be met based on commit history.",
  "For fair resolution, I suggest releasing 70% of the disputed amount to the seller and refunding 30% to the buyer.",
];

export function AIPanel() {
  const { aiPanelOpen, setAIPanelOpen } = useUIStore();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI escrow assistant. I can analyze contracts, summarize disputes, assess risk, and suggest resolutions. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const resp = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      setMessages((prev) => [...prev, { role: "assistant", content: resp }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {aiPanelOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-[380px] z-40 glass-strong border-l border-white/5 flex flex-col"
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-neon-purple" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Assistant</p>
                <p className="text-[10px] text-gray-500">Powered by EscrowFlow AI</p>
              </div>
            </div>
            <button onClick={() => setAIPanelOpen(false)} className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-neon-purple/20" : "bg-neon/20"}`}>
                  {msg.role === "assistant" ? <Bot className="w-3.5 h-3.5 text-neon-purple" /> : <User className="w-3.5 h-3.5 text-neon" />}
                </div>
                <div className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] ${msg.role === "assistant" ? "bg-surface-2 text-gray-300" : "bg-neon/10 text-neon border border-neon/20"}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-neon-purple/20 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-neon-purple" /></div>
                <div className="bg-surface-2 rounded-2xl px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 flex-shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about escrows, disputes..."
                className="flex-1 h-10 px-4 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neon-purple/50"
              />
              <button type="submit" className="w-10 h-10 rounded-xl bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 flex items-center justify-center transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
