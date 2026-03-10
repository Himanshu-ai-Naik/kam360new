import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  copilotOpen: boolean;
  onToggleCopilot: () => void;
  rightPanel: ReactNode;
}

export function Layout({ children, copilotOpen, onToggleCopilot, rightPanel }: LayoutProps) {
  return (
    <div className="layout">
      <div className="layout-main">{children}</div>
      <aside className={`layout-copilot ${copilotOpen ? 'open' : ''}`}>
        {rightPanel}
        <button
          type="button"
          className="copilot-toggle"
          onClick={onToggleCopilot}
          aria-label={copilotOpen ? 'Close copilot' : 'Open copilot'}
        >
          {copilotOpen ? '◀' : '▶'}
        </button>
      </aside>
      <style>{`
        .layout { display: flex; min-height: 100vh; }
        .layout-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .layout-copilot {
          width: 400px; min-width: 400px; position: relative;
          background: var(--bg-panel); border-left: 1px solid var(--border);
          display: flex; flex-direction: column; transition: margin 0.2s ease;
        }
        .layout-copilot:not(.open) { margin-right: -400px; min-width: 0; width: 0; }
        .copilot-toggle {
          position: absolute; left: -32px; top: 50%; transform: translateY(-50%);
          width: 28px; height: 56px; border: 1px solid var(--border);
          border-right: none; border-radius: 8px 0 0 8px;
          background: var(--bg-card); color: var(--text);
          font-size: 12px; display: flex; align-items: center; justify-content: center;
        }
        .copilot-toggle:hover { background: var(--bg-hover); }
      `}</style>
    </div>
  );
}
