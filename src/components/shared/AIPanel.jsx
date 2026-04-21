import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore, useEscrowStore } from "../../store";
import { useLocation } from "react-router-dom";
import { Sparkles, X, Send, Bot, User, AlertTriangle, Lightbulb, Shield } from "lucide-react";

const contextSuggestions = {
  "/": [
    "Show me a summary of my active escrows",
    "Which escrow has the highest risk?",
    "How much total value is locked?",
  ],
  "/create": [
    "Suggest a fair milestone split for a $5,000 project",
    "What are common escrow pitfalls?",
    "Generate a contract description for web development",
  ],
  "/disputes": [
    "Summarize the latest dispute",
    "What's a fair resolution for a partial delivery?",
    "How does arbitration work?",
  ],
  "/profile": [
    "How is my trust score calculated?",
    "How can I improve my reputation?",
    "What affects my risk score?",
  ],
};

const AI_RESPONSES = {
  risk: "Based on my analysis: **esc-004 (Brand Identity)** has the highest risk at 45%. It's unfunded and the deadline is approaching. I recommend funding it or renegotiating the timeline.",
  summary: "You have **4 active escrows** with **$49,000** total value. $33,500 is locked, $13,250 has been released. Your success rate is 20% (1/5 completed).",
  milestones: "For a $5,000 web project, I recommend:\n• **Phase 1** — Design (25%) — $1,250\n• **Phase 2** — Development (50%) — $2,500\n• **Phase 3** — Testing & Launch (25%) — $1,250\nThis ensures balanced risk distribution.",
  dispute: "The dispute involves incomplete deliverables. Based on the evidence, the seller completed ~70% of the work. **Recommendation:** Release 70% ($3,500) to the seller and refund 30% ($1,500) to the buyer.",
  contract: "Here's a draft description:\n\n*\"Full-stack web application development including responsive frontend (React), REST API backend (Node.js), PostgreSQL database, user authentication, and deployment to production. Includes 30 days of bug-fix support post-launch.\"*",
  trust: "Your trust score (92) is calculated from:\n• Completion rate (95%) → +40 pts\n• On-time delivery → +25 pts\n• No disputes filed → +20 pts\n• Fast response time → +7 pts",
  default: "I've analyzed the current context. Based on the escrow data, everything looks healthy. Is there anything specific you'd like me to review?",
};

function getResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes("risk") || lower.includes("highest")) return AI_RESPONSES.risk;
  if (lower.includes("summary") || lower.includes("active") || lower.includes("value")) return AI_RESPONSES.summary;
  if (lower.includes("milestone") || lower.includes("split") || lower.includes("suggest")) return AI_RESPONSES.milestones;
  if (lower.includes("dispute") || lower.includes("resolution") || lower.includes("fair")) return AI_RESPONSES.dispute;
  if (lower.includes("contract") || lower.includes("generate") || lower.includes("description")) return AI_RESPONSES.contract;
  if (lower.includes("trust") || lower.includes("score") || lower.includes("reputation")) return AI_RESPONSES.trust;
  return AI_RESPONSES.default;
}

export function AIPanel() {
  const { aiPanelOpen, setAIPanelOpen } = useUIStore();
  const location = useLocation();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 I'm your AI escrow copilot. I can analyze contracts, assess risk, suggest milestones, and resolve disputes. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const suggestions = contextSuggestions[location.pathname] || contextSuggestions["/"];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsTyping(true);

    // Simulate streaming with progressive reveal
    const response = getResponse(msg);
    const words = response.split(" ");
    let current = "";
    let i = 0;

    const interval = setInterval(() => {
      if (i >= words.length) {
        clearInterval(interval);
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
        return;
      }
      current += (i > 0 ? " " : "") + words[i];
      i++;
    }, 30);

    // Fallback: add full response after delay
    setTimeout(() => {
      clearInterval(interval);
      setIsTyping(false);
      setMessages((prev) => {
        if (prev[prev.length - 1]?.content === response) return prev;
        return [...prev, { role: "assistant", content: response }];
      });
    }, Math.min(words.length * 35, 3000));
  };

  return (
    <AnimatePresence>
      {aiPanelOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-[400px] z-40 glass-strong border-l border-white/5 flex flex-col"
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Copilot</p>
                <p className="text-[10px] text-gray-500">Context-aware • Real-time</p>
              </div>
            </div>
            <button onClick={() => setAIPanelOpen(false)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Smart Suggestions */}
          <div className="px-4 py-3 border-b border-white/5 flex-shrink-0">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Suggestions for this page
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/20 hover:bg-neon-purple/20 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-neon-purple/20" : "bg-neon/20"}`}>
                  {msg.role === "assistant" ? <Bot className="w-3.5 h-3.5 text-neon-purple" /> : <User className="w-3.5 h-3.5 text-neon" />}
                </div>
                <div className={`rounded-2xl px-4 py-2.5 text-sm max-w-[85%] leading-relaxed whitespace-pre-wrap ${msg.role === "assistant" ? "bg-surface-2 text-gray-300" : "bg-neon/10 text-neon border border-neon/20"}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-neon-purple/20 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-neon-purple" /></div>
                <div className="bg-surface-2 rounded-2xl px-4 py-3 flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neon-purple/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-neon-purple/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-neon-purple/60 animate-bounce" style={{ animationDelay: "300ms" }} />
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
                placeholder="Ask about escrows, disputes, risk..."
                className="flex-1 h-10 px-4 rounded-xl bg-surface-2 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-neon-purple/50 transition-colors"
              />
              <button type="submit" disabled={!input.trim()} className="w-10 h-10 rounded-xl bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 flex items-center justify-center transition-all disabled:opacity-30">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
