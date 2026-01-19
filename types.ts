
export enum UserRole {
  ADMIN = 'ADMIN',
  ESTAGIARIO = 'ESTAGIARIO',
  GESTOR = 'GESTOR',
  DEVELOPER = 'DEVELOPER'
}

export enum ProjectStatus {
  PROSPECTING = 'PROSPECÇÃO',
  PROPOSTA_SENT = 'PROPOSTA ENVIADA',
  CONTRACT_SIGNED = 'CONTRATO ASSINADO',
  PLANNING = 'PLANEJAMENTO',
  DEVELOPMENT = 'DESENVOLVIMENTO',
  DELIVERY = 'ENTREGA',
  BILLING = 'FATURAMENTO',
  COMPLETED = 'CONCLUÍDO'
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface BillingInfo {
  sameAsCompany: boolean;
  cnpj?: string;
  razaoSocial?: string;
  cep?: string;
  logradouro?: string;
  cidade?: string;
  uf?: string;
}

export interface Client {
  id: string;
  name: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  endereco: string;
  segment: string;
  responsible: string;
  cargo: string;
  email: string;
  telefone: string;
  status: ProjectStatus;
  value: number;
  lastUpdate: string;
  billingInfo: BillingInfo;
}

export interface ProposalItem {
  id: string;
  name: string;
  cost: number;
  finalPrice: number;
}

export interface Task {
  id: string;
  description: string;
  weight: number;
  completed: boolean;
  category: 'FRONTEND' | 'BACKEND' | 'PLANNING' | 'ADMIN' | 'MEETING';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  durationMinutes: number;
  deadline: string;
  projectId?: string;
  assignedDevId?: string;
}

export interface ProjectStage {
  id: string;
  name: string;
  tasks: Task[];
  status: 'TODO' | 'DOING' | 'DONE';
  deadline: string;
  attachments: Attachment[];
  assignedFrontEnd?: string;
  assignedBackEnd?: string;
  structurePaths?: string[]; 
}

export interface ModulePermissions {
  moduleId: string;
  moduleName: string;
  features: {
    id: string;
    name: string;
    enabled: boolean;
  }[];
}
