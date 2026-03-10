import { useMemo, useState } from 'react';
import { AlertTriangle, TrendingUp, ShoppingCart, Rocket, Wrench } from 'lucide-react';
import { INTERVENTIONS } from '../agents/interventions-data';
import { getAgentById } from '../agents/definitions';
import type { Intervention } from '../agents/types';

const CATEGORY_ICON: Record<string, typeof AlertTriangle> = {
  Adoption: TrendingUp,
  'Cross-sell': ShoppingCart,
  'Volume Growth': Rocket,
  'SR Recovery': Wrench,
};

interface InterventionBoardProps {
  onSelectIntervention: (int: Intervention) => void;
  onOpenCopilot: () => void;
}

export function InterventionBoard({ onSelectIntervention, onOpenCopilot }: InterventionBoardProps) {
  const [filter, setFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  const categories = useMemo(() => ['All', ...new Set(INTERVENTIONS.map((i) => i.category))], []);
  const priorities = useMemo(() => ['All', 'Critical', 'High Priority', 'Medium', 'Low'], []);

  const filtered = useMemo(() => {
    return INTERVENTIONS.filter((i) => {
      const catOk = filter === 'All' || i.category === filter;
      const priOk = priorityFilter === 'All' || i.priority === priorityFilter;
      return catOk && priOk;
    });
  }, [filter, priorityFilter]);

  return (
    <div className="intervention-board">
      <div className="board-filters">
        <div className="filter-group">
          <span className="filter-label">Category</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Priority</span>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="intervention-list">
        {filtered.map((int) => {
          const AgentIcon = CATEGORY_ICON[int.category] || AlertTriangle;
          const agent = getAgentById(int.agentId);
          return (
            <div
              key={int.id}
              className={`intervention-card priority-${int.priority.replace(/\s/g, '-').toLowerCase()}`}
            >
              <div className="int-header">
                <AgentIcon size={18} className="int-cat-icon" />
                <span className="int-category">{int.category}</span>
                <span className="int-merchant">{int.merchantName}</span>
                <span className="int-mids">{int.mids} MIDs</span>
                <span className={`int-priority ${int.priority === 'Critical' ? 'critical' : ''}`}>
                  {int.priority === 'Critical' ? '🔥' : '⚡'} {int.priority}
                </span>
              </div>
              <h4 className="int-title">{int.title}</h4>
              <p className="int-desc">{int.description}</p>
              <div className="int-actions">
                {int.actions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="int-action-btn"
                    onClick={() => {
                      onSelectIntervention(int);
                      onOpenCopilot();
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>
              {agent && (
                <div className="int-agent">
                  Handled by: <strong>{agent.shortName} Agent</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .intervention-board { padding: 24px; max-width: 1000px; margin: 0 auto; }
        .board-filters { display: flex; gap: 20px; margin-bottom: 24px; align-items: flex-end; }
        .filter-group { display: flex; flex-direction: column; gap: 6px; }
        .filter-label { font-size: 12px; color: var(--text-muted); }
        .filter-group select {
          padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);
          background: var(--bg-card); color: var(--text); min-width: 160px;
        }
        .intervention-list { display: flex; flex-direction: column; gap: 16px; }
        .intervention-card {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 18px; transition: border-color 0.2s;
        }
        .intervention-card:hover { border-color: var(--accent); }
        .intervention-card.priority-critical { border-left: 3px solid var(--critical); }
        .int-header {
          display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; margin-bottom: 8px;
        }
        .int-cat-icon { color: var(--accent); flex-shrink: 0; }
        .int-category { font-size: 12px; font-weight: 600; color: var(--text-muted); }
        .int-merchant { font-size: 13px; color: var(--text); }
        .int-mids { font-size: 12px; color: var(--text-muted); }
        .int-priority { font-size: 12px; margin-left: auto; }
        .int-priority.critical { color: var(--critical); }
        .int-title { margin: 0 0 8px; font-size: 15px; font-weight: 600; line-height: 1.4; }
        .int-desc { color: var(--text-muted); font-size: 13px; line-height: 1.5; margin-bottom: 12px; }
        .int-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .int-action-btn {
          padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border);
          background: var(--bg-panel); color: var(--text); font-size: 13px;
        }
        .int-action-btn:hover { background: var(--accent); color: white; border-color: var(--accent); }
        .int-agent { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
