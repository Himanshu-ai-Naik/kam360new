/**
 * Agent and intervention types for KAM 360 Gen-AI experience.
 * Maps to use cases from the Interventions tab: Adoption, Cross-sell, Volume Growth, SR Recovery.
 */

export type InterventionCategory = 'Adoption' | 'Cross-sell' | 'Volume Growth' | 'SR Recovery';
export type Priority = 'Critical' | 'High Priority' | 'Medium' | 'Low';
export type AgentId = 'orchestrator' | 'adoption' | 'crosssell' | 'volume' | 'sr-recovery';

export interface Merchant {
  id: string;
  name: string;
  industry: string;
  mids: number;
  healthScore: number;
  volume7d: string;
  successRate: string;
  revAtRisk: string;
  tickets: number;
  slaDue: string;
  lastContact: string;
}

export interface Intervention {
  id: string;
  category: InterventionCategory;
  merchantId: string;
  merchantName: string;
  mids: number;
  priority: Priority;
  title: string;
  description: string;
  actions: ('Pick Task' | 'Play Book' | 'Root Cause' | 'Ignore')[];
  agentId: AgentId;
}

export interface AgentDefinition {
  id: AgentId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  useCases: string[];
  capabilities: string[];
  suggestedPrompts: string[];
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentId?: AgentId;
  interventionId?: string;
  actions?: { label: string; action: string }[];
  timestamp: number;
}
