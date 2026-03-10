import { useState } from 'react';
import { Layout } from './components/Layout';
import { CopilotPanel } from './components/CopilotPanel';
import { AgentHub } from './components/AgentHub';
import { InterventionBoard } from './components/InterventionBoard';
import { MerchantManage } from './components/MerchantManage';
import type { AgentId } from './agents/types';
import './index.css';

type View = 'hub' | 'interventions' | 'merchants';

function App() {
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [activeAgent, setActiveAgent] = useState<AgentId | null>(null);
  const [view, setView] = useState<View>('hub');

  return (
    <Layout
      copilotOpen={copilotOpen}
      onToggleCopilot={() => setCopilotOpen((o) => !o)}
      rightPanel={
        <CopilotPanel
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          activeAgentId={activeAgent}
          onSelectAgent={setActiveAgent}
        />
      }
    >
      <header className="app-header">
        <nav className="app-nav">
          <button
            className={view === 'hub' ? 'active' : ''}
            onClick={() => setView('hub')}
          >
            Agent Hub
          </button>
          <button
            className={view === 'interventions' ? 'active' : ''}
            onClick={() => setView('interventions')}
          >
            Interventions
          </button>
          <button
            className={view === 'merchants' ? 'active' : ''}
            onClick={() => setView('merchants')}
          >
            Manage Merchants
          </button>
        </nav>
        <h1 className="app-title">KAM 360 · Gen-AI</h1>
      </header>

      <main className="app-main">
        {view === 'hub' && (
          <AgentHub
            onSelectAgent={setActiveAgent}
            onOpenCopilot={() => setCopilotOpen(true)}
          />
        )}
        {view === 'interventions' && (
          <InterventionBoard
            onSelectIntervention={(int) => setActiveAgent(int.agentId)}
            onOpenCopilot={() => setCopilotOpen(true)}
          />
        )}
        {view === 'merchants' && <MerchantManage />}
      </main>
    </Layout>
  );
}

export default App;
