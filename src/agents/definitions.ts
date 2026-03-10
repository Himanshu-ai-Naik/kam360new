import type { AgentDefinition } from './types';

/**
 * Multiple agents solving for Interventions tab use cases.
 * KAMs get a single copilot that routes to these specialists.
 */
export const AGENTS: AgentDefinition[] = [
  {
    id: 'orchestrator',
    name: 'KAM 360 Assistant',
    shortName: 'KAM',
    description: 'Create and manage merchants, prioritize interventions, and coordinate specialists.',
    icon: '🎯',
    useCases: [
      'Create new merchant',
      'Assign merchant to portfolio',
      'Prioritize interventions across merchants',
      'Weekly briefing and health overview',
      'SLA and ticket triage',
    ],
    capabilities: ['Merchant CRUD', 'Portfolio view', 'Agent routing', 'Task assignment'],
    suggestedPrompts: [
      'Top interventions with expected impact and suggestions',
      'Which merchants need attention this week?',
      'Summarize my portfolio health',
      'Add a new merchant for onboarding',
    ],
  },
  {
    id: 'adoption',
    name: 'Adoption Agent',
    shortName: 'Adoption',
    description: 'Improve feature adoption: BNPL, tokenization, UPI AutoPay, and checkout penetration.',
    icon: '📈',
    useCases: [
      'BNPL feature activation (low adoption)',
      'Card tokenization adoption below target',
      'Pay Later / checkout penetration',
      'Promotional push and UI optimization',
    ],
    capabilities: ['Adoption analytics', 'Playbooks', 'A/B suggestions', 'Merchant-specific tips'],
    suggestedPrompts: [
      'BNPL impact and suggestions for BigBasket',
      'Playbook: Increase card tokenization to 60%',
      'Expected impact for adoption interventions',
    ],
  },
  {
    id: 'crosssell',
    name: 'Cross-sell Agent',
    shortName: 'Cross-sell',
    description: 'Instant refunds, loyalty suite, EMI at checkout, and revenue expansion.',
    icon: '🛒',
    useCases: [
      'Instant refunds for failed transactions',
      'Loyalty rewards program',
      'EMI / no-cost EMI for high-value orders',
      'Surface offers at checkout',
    ],
    capabilities: ['Product recommendations', 'Revenue impact', 'Implementation playbooks', 'Eligibility checks'],
    suggestedPrompts: [
      'Impact and suggestions for Zomato instant refunds',
      'EMI impact for Flipkart high-value orders',
      'Cross-sell loyalty suite — expected impact',
    ],
  },
  {
    id: 'volume',
    name: 'Volume Growth Agent',
    shortName: 'Volume',
    description: 'Recurring revenue, subscriptions, e-mandate, international cards, and volume levers.',
    icon: '🚀',
    useCases: [
      'Subscription / recurring payments',
      'E-mandate and SI integration',
      'International card acceptance',
      'Multi-currency and cross-border',
    ],
    capabilities: ['Volume forecasting', 'Integration checklists', 'Go-live playbooks', 'Revenue uplift'],
    suggestedPrompts: [
      'Swiggy One subscription — expected impact and suggestions',
      'International cards for Zomato — impact',
      'Playbook: Enable e-mandate for recurring',
    ],
  },
  {
    id: 'sr-recovery',
    name: 'SR Recovery Agent',
    shortName: 'SR Recovery',
    description: 'Success rate recovery: root cause, routing, 3DS, net banking, and PSP optimization.',
    icon: '🔧',
    useCases: [
      'UPI success rate below threshold',
      'PSP routing failures and optimization',
      'Card 3DS authentication failures',
      'Net banking success rate degradation',
      'Bank / gateway-specific issues',
    ],
    capabilities: ['Root cause analysis', 'Routing recommendations', 'Playbooks', 'Benchmark comparison'],
    suggestedPrompts: [
      'UPI SR Flipkart — impact and suggestions',
      '3DS failures BookMyShow — expected impact',
      'SBI net banking SR — root cause and suggestions',
    ],
  },
];

export const getAgentById = (id: string) => AGENTS.find((a) => a.id === id);
