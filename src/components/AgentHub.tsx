import { Zap } from 'lucide-react';
import { AGENTS } from '../agents/definitions';
import type { AgentId } from '../agents/types';

interface AgentHubProps {
  onSelectAgent: (id: AgentId) => void;
  onOpenCopilot: () => void;
}

export function AgentHub({ onSelectAgent, onOpenCopilot }: AgentHubProps) {
  return (
    <div className="agent-hub">
      <p className="hub-desc">
        Multiple agents for the use cases in the Interventions tab. Click an agent to focus the copilot, or ask in natural language.
      </p>
      <div className="agent-grid">
        {AGENTS.map((agent) => (
          <article
            key={agent.id}
            className="agent-card"
            onClick={() => {
              onSelectAgent(agent.id as AgentId);
              onOpenCopilot();
            }}
          >
            <div className="agent-card-header">
              <span className="agent-icon">{agent.icon}</span>
              <h3 className="agent-name">{agent.name}</h3>
            </div>
            <p className="agent-desc">{agent.description}</p>
            <div className="agent-use-cases">
              <span className="label">Use cases</span>
              <ul>
                {agent.useCases.slice(0, 3).map((uc) => (
                  <li key={uc}>{uc}</li>
                ))}
              </ul>
            </div>
            <div className="agent-prompts">
              {agent.suggestedPrompts.slice(0, 2).map((p) => (
                <button
                  key={p}
                  type="button"
                  className="prompt-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAgent(agent.id as AgentId);
                    onOpenCopilot();
                  }}
                >
                  <Zap size={14} />
                  {p}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
      <style>{`
        .agent-hub { padding: 24px; max-width: 1200px; margin: 0 auto; }
        .hub-desc {
          color: var(--text-muted); margin-bottom: 24px; font-size: 15px; line-height: 1.5;
        }
        .agent-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;
        }
        .agent-card {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 20px; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .agent-card:hover {
          border-color: var(--accent); box-shadow: var(--shadow);
        }
        .agent-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .agent-icon { font-size: 28px; }
        .agent-name { margin: 0; font-size: 17px; font-weight: 600; }
        .agent-desc { color: var(--text-muted); font-size: 13px; line-height: 1.5; margin-bottom: 14px; }
        .agent-use-cases .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
        .agent-use-cases ul { margin: 6px 0 0; padding-left: 18px; font-size: 13px; color: var(--text-muted); }
        .agent-use-cases li { margin-bottom: 4px; }
        .agent-prompts { margin-top: 14px; display: flex; flex-direction: column; gap: 8px; }
        .prompt-btn {
          display: flex; align-items: center; gap: 8px; padding: 8px 12px;
          border-radius: 8px; border: 1px solid var(--border); background: var(--bg-panel);
          color: var(--text); font-size: 12px; text-align: left;
        }
        .prompt-btn:hover { background: var(--bg-hover); border-color: var(--accent); color: var(--accent); }
      `}</style>
    </div>
  );
}
