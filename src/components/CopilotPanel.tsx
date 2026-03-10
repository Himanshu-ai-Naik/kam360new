import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot } from 'lucide-react';
import { AGENTS, getAgentById } from '../agents/definitions';
import { INTERVENTIONS } from '../agents/interventions-data';
import type { AgentId, CopilotMessage } from '../agents/types';

interface CopilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeAgentId: AgentId | null;
  onSelectAgent: (id: AgentId | null) => void;
}

const WELCOME: CopilotMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your KAM 360 assistant. I give **expected impact** and **suggestions** for each intervention — no need to ask.\n\n• **KAM** — Portfolio, merchants, prioritisation\n• **Adoption** — BNPL, tokenization\n• **Cross-sell** — Refunds, EMI, loyalty\n• **Volume** — Subscriptions, international cards\n• **SR Recovery** — Root cause, routing, 3DS\n\nTry: \"Top interventions with impact\" or ask about any merchant. I'll always include impact and next steps.",
  timestamp: Date.now(),
};

export function CopilotPanel({
  isOpen,
  activeAgentId,
  onSelectAgent,
}: CopilotPanelProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (optionalText?: string) => {
    const text = (optionalText ?? input).trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: 'user', content: text, timestamp: Date.now() },
    ]);
    setIsTyping(true);

    // Simulate agent routing and response
    setTimeout(() => {
      const agent = getAgentById(activeAgentId || 'orchestrator');
      const q = text.toLowerCase();
      const matchIntervention = (i: (typeof INTERVENTIONS)[0]) => {
        const mn = i.merchantName.toLowerCase();
        const nameParts = mn.split(/[\s(]+/).filter((p) => p.length > 2);
        const nameMatch = q.includes(mn) || nameParts.some((p) => q.includes(p));
        return nameMatch || (q.includes('bnpl') && i.category === 'Adoption' && mn.includes('bigbasket')) || (q.includes('bnpl') && i.category === 'Adoption' && mn.includes('flipkart')) || (q.includes('upi') && mn.includes('flipkart')) || (q.includes('zomato') && mn.includes('zomato')) || (q.includes('swiggy') && mn.includes('swiggy')) || (q.includes('bookmyshow') && mn.includes('bookmyshow')) || (q.includes('root cause') && i.agentId === 'sr-recovery') || q.includes('playbook');
      };
      const intMatch = INTERVENTIONS.find(matchIntervention) ?? (q.includes('intervention') || q.includes('impact') || q.includes('insight') ? INTERVENTIONS[0] : null);
      const reply: CopilotMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: agent
          ? `**${agent.shortName} Agent** is on it.\n\n${getSimulatedReply(text, agent.id, intMatch)}`
          : getSimulatedReply(text, 'orchestrator', intMatch),
        agentId: (agent?.id as AgentId) || 'orchestrator',
        interventionId: intMatch?.id,
        timestamp: Date.now(),
        actions: intMatch
          ? intMatch.actions.map((a) => ({ label: a, action: a }))
          : undefined,
      };
      setMessages((m) => [...m, reply]);
      setIsTyping(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="copilot-panel">
      <div className="copilot-header">
        <MessageCircle size={20} />
        <span>KAM 360 Copilot</span>
      </div>

      <div className="copilot-agents">
        {AGENTS.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`chip ${activeAgentId === a.id ? 'active' : ''}`}
            onClick={() => onSelectAgent(activeAgentId === a.id ? null : (a.id as AgentId))}
          >
            <span className="chip-icon">{a.icon}</span>
            {a.shortName}
          </button>
        ))}
      </div>
      <div className="copilot-quick-prompt">
        <button type="button" onClick={() => handleSend('Top interventions with expected impact and suggestions')}>
          ✨ Top interventions with impact
        </button>
      </div>

      <div className="copilot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.role}`}>
            {msg.role === 'assistant' && <Bot size={16} className="msg-icon" />}
            <div className="message-content">
              <div className="message-text">{formatContent(msg.content)}</div>
              {msg.actions && msg.actions.length > 0 && (
                <div className="message-actions">
                  {msg.actions.map((ac) => (
                    <button key={ac.label} type="button" className="action-btn">
                      {ac.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message message-assistant">
            <Bot size={16} className="msg-icon" />
            <div className="typing-dots">...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="copilot-input-wrap">
        <input
          className="copilot-input"
          placeholder="Ask anything... e.g. Root cause for Flipkart UPI SR"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button type="button" className="copilot-send" onClick={handleSend}>
          <Send size={18} />
        </button>
      </div>

      <style>{`
        .copilot-panel { display: flex; flex-direction: column; height: 100%; }
        .copilot-header {
          display: flex; align-items: center; gap: 8px; padding: 16px;
          border-bottom: 1px solid var(--border); font-weight: 600; font-size: 15px;
        }
        .copilot-agents {
          display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 16px;
          border-bottom: 1px solid var(--border);
        }
        .chip {
          display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px;
          border-radius: 20px; border: 1px solid var(--border); background: var(--bg-card);
          color: var(--text-muted); font-size: 12px;
        }
        .chip:hover, .chip.active { background: var(--accent); color: white; border-color: var(--accent); }
        .chip-icon { font-size: 14px; }
        .copilot-quick-prompt { padding: 8px 16px; border-bottom: 1px solid var(--border); }
        .copilot-quick-prompt button {
          width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px dashed var(--border);
          background: transparent; color: var(--text-muted); font-size: 12px; cursor: pointer;
        }
        .copilot-quick-prompt button:hover { background: var(--bg-hover); color: var(--accent); border-color: var(--accent); }
        .copilot-messages {
          flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;
        }
        .message { display: flex; gap: 10px; align-items: flex-start; }
        .message-user { flex-direction: row-reverse; }
        .msg-icon { flex-shrink: 0; color: var(--accent); margin-top: 2px; }
        .message-content { max-width: 85%; }
        .message-text {
          padding: 10px 14px; border-radius: var(--radius); font-size: 13px; line-height: 1.5;
          white-space: pre-wrap;
        }
        .message-user .message-text { background: var(--accent); color: white; }
        .message-assistant .message-text { background: var(--bg-card); border: 1px solid var(--border); }
        .message-text strong { font-weight: 600; }
        .message-actions { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }
        .action-btn {
          padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border);
          background: var(--bg-card); color: var(--text); font-size: 12px;
        }
        .action-btn:hover { background: var(--bg-hover); }
        .typing-dots { padding: 10px 14px; color: var(--text-muted); }
        .copilot-input-wrap {
          display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--border);
        }
        .copilot-input {
          flex: 1; padding: 10px 14px; border-radius: var(--radius); border: 1px solid var(--border);
          background: var(--bg-card); color: var(--text); font-size: 14px;
        }
        .copilot-input::placeholder { color: var(--text-muted); }
        .copilot-send {
          padding: 10px 14px; border-radius: var(--radius); border: none;
          background: var(--accent); color: white;
        }
        .copilot-send:hover { background: var(--accent-dim); }
      `}</style>
    </div>
  );
}

function formatContent(content: string) {
  return content.split(/\n/).map((line, i) => {
    const bold = /^\*\*(.+?)\*\*/.exec(line);
    if (bold) {
      return (
        <span key={i}>
          <strong>{bold[1]}</strong>
          {line.slice(bold[0].length)}
          <br />
        </span>
      );
    }
    return <span key={i}>{line}<br /></span>;
  });
}

function getSimulatedReply(
  query: string,
  agentId: AgentId,
  intervention?: (typeof INTERVENTIONS)[0] | null
): string {
  const q = query.toLowerCase();
  const wantsTopInsights = /top|insight|impact|suggestion|priority|what should i/i.test(query);

  if (wantsTopInsights) {
    const top = INTERVENTIONS.slice(0, 3);
    let out = '**Top 3 interventions with expected impact and suggestions:**\n\n';
    top.forEach((int, idx) => {
      out += `**${idx + 1}. ${int.merchantName}** — ${int.title}\n`;
      if (int.aiImpact) out += `Impact: ${int.aiImpact}\n`;
      if (int.aiSuggestions?.length) {
        out += `Suggestions: ${int.aiSuggestions.slice(0, 2).join(' ')}\n`;
      }
      out += '\n';
    });
    out += 'Open the **Interventions** tab for full list and actions.';
    return out;
  }

  if (intervention) {
    let out = '';
    if (q.includes('root cause')) {
      out += `Root-cause focus: **${intervention.title}**\n\n`;
    } else if (q.includes('playbook')) {
      out += `Playbook: **${intervention.title}**\n\n`;
    } else {
      out += `**${intervention.title}**\n\n`;
    }
    if (intervention.aiImpact) {
      out += `**Expected impact:** ${intervention.aiImpact}\n\n`;
    }
    if (intervention.aiSuggestions?.length) {
      out += `**Suggestions:**\n${intervention.aiSuggestions.map((s) => `• ${s}`).join('\n')}\n\n`;
    }
    out += 'You can Pick Task, run Play Book, or dig into Root Cause from the Interventions tab.';
    return out;
  }

  if (q.includes('create') && q.includes('merchant')) {
    return 'Opening **Create merchant** flow. Use the "Manage Merchants" tab to add a new merchant and assign to your portfolio.';
  }
  if (q.includes('portfolio') || q.includes('health')) {
    return 'Portfolio summary: 5 merchants, 12 issues resolved this week, ₹2.4 Cr business impact. Top priority: SR Recovery on Flipkart (UPI), then Adoption on BigBasket (BNPL). Ask "Top interventions with impact" for AI impact and suggestions.';
  }
  return `Understood. Ask me about a **merchant** or say **"Top interventions with impact"** — I'll give expected impact and suggestions for each.`;
}
