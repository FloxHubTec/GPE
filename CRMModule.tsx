
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  ChevronRight, 
  Building2, 
  Users,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
  DollarSign,
  TrendingUp,
  Percent,
  X,
  FileSpreadsheet,
  Eye,
  Settings2,
  History,
  Upload,
  FileDown,
  // Added Download to fix 'Cannot find name Download' error
  Download,
  Type,
  LayoutDashboard,
  Target,
  Rocket,
  BarChart3,
  Edit3,
  Trash2,
  Save,
  PenTool,
  Clock,
  ExternalLink,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CreateClientForm from './CreateClientForm';
import { ProjectStatus } from '../types';

const MOCK_DATA = [
  { name: 'Jan', value: 12000 },
  { name: 'Fev', value: 19000 },
  { name: 'Mar', value: 15000 },
  { name: 'Abr', value: 27000 },
  { name: 'Mai', value: 32000 },
  { name: 'Jun', value: 45000 },
];

const CRMModule: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'list' | 'form' | 'proposal'>('dashboard');
  const [proposalViewMode, setProposalViewMode] = useState<'INTERNAL' | 'CLIENT'>('INTERNAL');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showLeadDetails, setShowLeadDetails] = useState<any>(null);
  const [proposalObjective, setProposalObjective] = useState('');
  const [brandAsset, setBrandAsset] = useState<string | null>(null);
  const [userSignature, setUserSignature] = useState<string | null>(null);
  
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  useEffect(() => {
    const savedSignature = localStorage.getItem('floxhub_user_signature');
    if (savedSignature) setUserSignature(savedSignature);
  }, [view]);

  const [proposalItems, setProposalItems] = useState([
    { id: '1', name: 'Engenharia e Implementação', description: 'Arquitetura de dados, infraestrutura e configuração de squad.', cost: 5000 },
    { id: '2', name: 'Sustentação Técnica (Mensal)', description: 'Horas de desenvolvimento alocadas para evolução do produto.', cost: 8000 },
    { id: '3', name: 'Treinamento & Handoff', description: 'Capacitação da equipe e entrega de documentação.', cost: 2000 },
  ]);
  
  const [margin, setMargin] = useState(40);

  const [clients, setClients] = useState([
    { id: '1', name: 'Alpha Tech', status: ProjectStatus.CONTRACT_SIGNED, value: 15000, email: 'contato@alphatech.com', phone: '(11) 98888-7777' },
    { id: '2', name: 'Global Logistics', status: ProjectStatus.PROPOSTA_SENT, value: 42000, email: 'shipping@global.com', phone: '(11) 97777-6666' },
    { id: '3', name: 'Studio Creative', status: ProjectStatus.CONTRACT_SIGNED, value: 8500, email: 'art@studioc.com', phone: '(11) 96666-5555' },
    { id: '4', name: 'Indústria Prime', status: ProjectStatus.PROSPECTING, value: 0, email: 'compras@prime.com.br', phone: '(11) 95555-4444' },
  ]);

  const applyMargin = (cost: number) => cost * (1 + margin / 100);
  const totalCost = proposalItems.reduce((acc, item) => acc + item.cost, 0);
  const totalFinal = applyMargin(totalCost);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBrandAsset(URL.createObjectURL(file));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setProposalItems(items => items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const openProposalBuilder = (client: any) => {
    setSelectedClient(client);
    setView('proposal');
  };

  if (view === 'form') return <CreateClientForm onCancel={() => setView('list')} onSuccess={() => setView('list')} />;

  if (view === 'proposal') {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button onClick={() => setView('list')} className="p-2 bg-surface border border-border rounded-xl text-muted hover:text-lead transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-black text-lead">Editor de Proposta Comercial</h2>
                <p className="text-xs font-bold text-muted uppercase tracking-widest">{selectedClient?.name}</p>
              </div>
           </div>
           <div className="flex bg-surface p-1 rounded-xl border border-border shadow-soft">
              <button 
                onClick={() => setProposalViewMode('INTERNAL')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${proposalViewMode === 'INTERNAL' ? 'bg-lead text-white' : 'text-muted hover:text-lead'}`}
              >
                <Settings2 className="w-3.5 h-3.5 inline mr-2" /> Estrutura & Custos
              </button>
              <button 
                onClick={() => setProposalViewMode('CLIENT')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${proposalViewMode === 'CLIENT' ? 'bg-primary text-lead' : 'text-muted hover:text-lead'}`}
              >
                <Eye className="w-3.5 h-3.5 inline mr-2" /> Visualização Cliente
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {proposalViewMode === 'INTERNAL' && (
            <div className="lg:col-span-4 space-y-6 animate-in slide-in-from-left-4 duration-500">
              <div className="bg-surface p-6 rounded-3xl border border-border shadow-soft space-y-6">
                <h3 className="text-xs font-black text-lead uppercase tracking-widest border-b border-border pb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" /> Identidade Visual
                </h3>
                <div className="relative border-2 border-dashed border-border rounded-2xl p-4 text-center hover:border-primary transition-colors group">
                  {brandAsset ? (
                    <img src={brandAsset} className="max-h-20 mx-auto rounded-lg mb-2" alt="Brand" />
                  ) : (
                    <div className="py-4">
                      <Plus className="w-6 h-6 text-muted mx-auto mb-2" />
                      <p className="text-[10px] font-bold text-muted uppercase">Upload de Logo/Timbrado</p>
                    </div>
                  )}
                  <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                <h3 className="text-xs font-black text-lead uppercase tracking-widest border-b border-border pb-2 flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" /> Objetivo da Proposta
                </h3>
                <textarea 
                  value={proposalObjective}
                  onChange={(e) => setProposalObjective(e.target.value)}
                  placeholder="Descreva o propósito principal deste projeto..."
                  className="w-full h-32 p-4 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-all resize-none font-medium"
                />

                <h3 className="text-xs font-black text-lead uppercase tracking-widest border-b border-border pb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" /> Calculadora & Margens
                </h3>
                <div className="space-y-4">
                  {proposalItems.map((item) => (
                    <div key={item.id} className="p-4 bg-background rounded-2xl border border-border space-y-3">
                      <input 
                        value={item.name} 
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full bg-transparent text-[10px] font-black uppercase tracking-widest text-lead outline-none border-b border-border focus:border-primary pb-1"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted">R$</span>
                        <input 
                          type="number"
                          value={item.cost} 
                          onChange={(e) => updateItem(item.id, 'cost', +e.target.value)}
                          className="w-full bg-transparent text-sm font-bold outline-none"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <label className="text-[9px] font-black text-primary uppercase block mb-1">Margem de Lucro (%)</label>
                    <input 
                      type="number" 
                      value={margin} 
                      onChange={e => setMargin(+e.target.value)} 
                      className="w-full p-3 bg-primary/5 border border-primary/20 rounded-xl text-sm font-black text-primary" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={`${proposalViewMode === 'INTERNAL' ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col min-h-[1000px] animate-in slide-in-from-right-4 duration-500`}>
             <div className="bg-lead p-12 text-white flex justify-between items-start">
                <div>
                  {brandAsset ? (
                    <img src={brandAsset} className="h-14 mb-8" alt="Logo" />
                  ) : (
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-lead font-black mb-8 text-2xl shadow-lg shadow-primary/20">F</div>
                  )}
                  <h2 className="text-4xl font-black tracking-tighter leading-none">Proposta de Solução</h2>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-3">Sistema de Gestão Floxhub GPE</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest">
                    <FileDown className="w-4 h-4 text-primary" /> DOCX Editável
                  </button>
                  <button className="flex items-center gap-2 px-5 py-3 bg-primary text-lead hover:bg-primary/90 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    <FileDown className="w-4 h-4" /> PDF
                  </button>
                </div>
             </div>

             <div className="p-16 flex-1 space-y-16">
                <section>
                   <div className="flex items-center gap-4 mb-6">
                      <div className="h-[2px] w-8 bg-primary"></div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">01. Introdução e Objetivo Estratégico</p>
                   </div>
                   <div className="prose prose-sm max-w-none text-lead font-medium leading-loose text-lg italic border-l-4 border-primary/20 pl-8">
                      {proposalObjective || "O objetivo desta proposta é apresentar uma solução técnica robusta e escalável, focada no crescimento da organização através da automação de processos e inteligência comercial..."}
                   </div>
                </section>

                <section>
                   <div className="flex items-center gap-4 mb-10">
                      <div className="h-[2px] w-8 bg-primary"></div>
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">02. Itens de Investimento Detalhados</p>
                   </div>
                   <div className="space-y-6">
                      {proposalItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-8 bg-background rounded-[32px] group hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20">
                          <div className="max-w-md">
                            <p className="text-lg font-black text-lead mb-1">{item.name}</p>
                            <p className="text-xs text-muted font-medium leading-relaxed">{item.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-lead tracking-tight">R$ {applyMargin(item.cost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mt-1">Valor Unitário</p>
                          </div>
                        </div>
                      ))}
                   </div>
                </section>

                <div className="pt-20 border-t-2 border-dashed border-border mt-auto">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                      <div>
                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-3">Investimento Total do Projeto</p>
                        <p className="text-6xl font-black text-lead tracking-tighter">R$ {totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <div className="flex items-center gap-2 mt-4">
                           <Zap className="w-4 h-4 text-primary" />
                           <p className="text-[10px] font-bold text-muted uppercase">Válido por 15 dias corridos a partir de {currentDate}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center md:items-end gap-6">
                         {userSignature ? (
                           <div className="text-center md:text-right space-y-2">
                              <p className="text-[9px] font-black text-muted uppercase tracking-widest">Responsável pela Oferta</p>
                              <img src={userSignature} className="h-20 object-contain mix-blend-multiply mx-auto md:mr-0" alt="Assinatura Digital" />
                              <div className="w-48 h-[1px] bg-lead/30 mx-auto md:mr-0"></div>
                              <p className="text-[10px] font-bold text-lead uppercase">Admin Principal • Floxhub GPE</p>
                           </div>
                         ) : (
                           <div className="p-6 border-2 border-dashed border-border rounded-2xl text-center bg-background/50">
                              <PenTool className="w-5 h-5 text-muted mx-auto mb-2 opacity-50" />
                              <p className="text-[9px] font-black text-muted uppercase tracking-tighter leading-tight">Assinatura não cadastrada<br/>nas configurações</p>
                           </div>
                         )}
                         <button className="w-full md:w-auto px-14 py-6 bg-lead text-white font-black rounded-[24px] uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-lead/30 flex items-center justify-center gap-4">
                            <Send className="w-5 h-5 text-primary" /> Efetivar Proposta
                         </button>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="p-8 bg-background/50 border-t border-border text-center">
                <p className="text-[9px] font-black text-muted uppercase tracking-widest">GPE Floxhub Framework • Proposta Gerada Automática pelo CRM</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-500 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-lead tracking-tight">Comercial & CRM</h1>
          <p className="text-muted font-bold mt-1 uppercase tracking-widest text-[10px]">Data Atual: {currentDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView(view === 'dashboard' ? 'list' : 'dashboard')}
            className="bg-surface border border-border text-lead font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-background transition-all shadow-soft text-xs uppercase tracking-widest"
          >
            {view === 'dashboard' ? <Users className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
            {view === 'dashboard' ? 'Ver Leads' : 'Dashboard'}
          </button>
          <button onClick={() => setView('form')} className="bg-primary text-lead font-black px-8 py-3.5 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 text-xs uppercase tracking-widest">
            <Plus className="w-5 h-5" /> Novo Lead
          </button>
        </div>
      </header>

      {view === 'dashboard' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
           {/* High-level KPIs */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Pipeline Total', value: 'R$ 384.200', icon: DollarSign, color: 'text-primary' },
                { label: 'Taxa Conversão', value: '24.2%', icon: Target, color: 'text-blue-500' },
                { label: 'Leads Ativos', value: '18', icon: Users, color: 'text-orange-500' },
                { label: 'Contratos/Mês', value: '4', icon: Rocket, color: 'text-green-600' }
              ].map((kpi, i) => (
                <div key={i} className="bg-surface p-6 rounded-3xl border border-border shadow-soft group hover:shadow-active transition-all">
                   <kpi.icon className={`w-6 h-6 ${kpi.color} mb-4`} />
                   <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{kpi.label}</p>
                   <p className="text-2xl font-black text-lead tracking-tight">{kpi.value}</p>
                </div>
              ))}
           </div>

           {/* Performance Graph */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-surface p-8 rounded-[32px] border border-border shadow-soft min-h-[400px]">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-lead uppercase tracking-widest text-sm">Performance de Vendas (12 Meses)</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-primary rounded-full"></div>
                       <span className="text-[10px] font-bold text-muted uppercase">Meta Atingida</span>
                    </div>
                 </div>
                 <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={MOCK_DATA}>
                          <defs>
                             <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00E054" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#00E054" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                          <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px'}} />
                          <Area type="monotone" dataKey="value" stroke="#00E054" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-surface p-8 rounded-[32px] border border-border shadow-soft">
                 <h3 className="font-black text-lead uppercase tracking-widest text-sm mb-6">Funil de Vendas</h3>
                 <div className="space-y-6">
                    {[
                      { label: 'Prospecção', count: 12, percent: 100, color: 'bg-muted' },
                      { label: 'Proposta Enviada', count: 5, percent: 40, color: 'bg-orange-400' },
                      { label: 'Contrato Assinado', count: 3, percent: 25, color: 'bg-primary' }
                    ].map((step, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-muted uppercase tracking-widest">{step.label}</span>
                            <span className="text-xs font-black text-lead">{step.count}</span>
                         </div>
                         <div className="h-3 w-full bg-background rounded-full overflow-hidden">
                            <div className={`h-full ${step.color} rounded-full`} style={{ width: `${step.percent}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <p className="text-[10px] text-muted font-bold leading-relaxed">Sua conversão de proposta em contrato aumentou 12% desde o último mês.</p>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-surface rounded-3xl border border-border shadow-soft overflow-hidden animate-in slide-in-from-right-2">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background/50 border-b border-border">
                <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest">Empresa / Lead</th>
                <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest">Status Comercial</th>
                <th className="px-8 py-6 text-xs font-black text-muted uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-background/30 transition-colors group">
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center font-black text-muted group-hover:bg-primary/10 group-hover:text-primary transition-all text-lg">{client.name[0]}</div>
                        <div>
                          <p className="font-black text-lead">{client.name}</p>
                          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Lead Qualificado</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className="text-[10px] font-black uppercase text-muted tracking-widest px-4 py-2 bg-background rounded-full border border-border shadow-inner">{client.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      {client.status === ProjectStatus.PROSPECTING && (
                        <button onClick={() => openProposalBuilder(client)} className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary text-[10px] font-black rounded-xl hover:bg-primary/20 transition-all uppercase tracking-widest">
                          <DollarSign className="w-4 h-4" /> Gerar Proposta
                        </button>
                      )}
                      <button 
                        onClick={() => setShowLeadDetails(client)}
                        className="p-3 text-muted hover:text-lead hover:bg-background rounded-xl transition-all border border-transparent hover:border-border"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LEAD DETAILS MODAL (SIDEBAR) */}
      {showLeadDetails && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-lead/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowLeadDetails(null)}></div>
          <div className="relative bg-surface w-full max-w-xl h-full shadow-2xl animate-in slide-in-from-right duration-500 overflow-hidden flex flex-col">
             
             {/* Header */}
             <div className="p-8 border-b border-border bg-white sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
                      {showLeadDetails.name[0]}
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-lead tracking-tight">{showLeadDetails.name}</h3>
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest">Lead ID: #{showLeadDetails.id.padStart(4, '0')}</p>
                   </div>
                </div>
                <button onClick={() => setShowLeadDetails(null)} className="p-3 hover:bg-background rounded-2xl transition-all"><X className="w-6 h-6 text-muted" /></button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-10">
                
                {/* Status Card */}
                <div className="bg-background rounded-3xl p-6 border border-border flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-border">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[10px] font-black text-muted uppercase tracking-widest">Status Atual</span>
                   </div>
                   <span className="text-[10px] font-black text-white bg-lead px-4 py-2 rounded-full uppercase tracking-widest">
                      {showLeadDetails.status}
                   </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white border border-border p-4 rounded-2xl">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">E-mail Corporativo</p>
                      <p className="text-xs font-bold text-lead truncate">{showLeadDetails.email || 'Não informado'}</p>
                   </div>
                   <div className="bg-white border border-border p-4 rounded-2xl">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">Telefone/WhatsApp</p>
                      <p className="text-xs font-bold text-lead">{showLeadDetails.phone || 'Não informado'}</p>
                   </div>
                </div>

                {/* Documents Section */}
                <section>
                   <h4 className="text-[10px] font-black text-lead uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> Documentação do Lead
                   </h4>
                   <div className="space-y-3">
                      <div className="group bg-white p-5 rounded-3xl border border-border hover:border-primary/40 transition-all flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-xs font-black text-lead">Proposta Comercial</p>
                               <p className="text-[9px] text-muted font-bold uppercase mt-0.5">Gerada em 12 Out 2024 • 2.4MB</p>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button className="p-2 text-muted hover:text-primary transition-all"><Eye className="w-4 h-4" /></button>
                            <button className="p-2 text-muted hover:text-primary transition-all"><Download className="w-4 h-4" /></button>
                         </div>
                      </div>

                      {showLeadDetails.status === ProjectStatus.CONTRACT_SIGNED && (
                        <div className="group bg-white p-5 rounded-3xl border border-border hover:border-primary/40 transition-all flex items-center justify-between animate-in slide-in-from-top-2">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                                 <ShieldCheck className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-xs font-black text-lead">Contrato Assinado Digitalmente</p>
                                 <p className="text-[9px] text-muted font-bold uppercase mt-0.5">Validado em 14 Out 2024 • 1.1MB</p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button className="p-2 text-muted hover:text-primary transition-all"><Eye className="w-4 h-4" /></button>
                              <button className="p-2 text-muted hover:text-primary transition-all"><Download className="w-4 h-4" /></button>
                           </div>
                        </div>
                      )}
                   </div>
                </section>

                {/* History Timeline */}
                <section>
                   <h4 className="text-[10px] font-black text-lead uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <History className="w-4 h-4 text-primary" /> Histórico de Interações
                   </h4>
                   <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                      {[
                        { action: 'Lead Criado no Sistema', date: '12 Out 2024 - 14:30', user: 'Admin', icon: Users },
                        { action: 'Proposta Comercial Enviada', date: '12 Out 2024 - 15:10', user: 'Ricardo Mendes', icon: Send },
                        { action: 'Reunião de Alinhamento Executivo', date: '13 Out 2024 - 10:00', user: 'Admin', icon: Video },
                        { action: 'Contrato Assinado e Validado', date: '14 Out 2024 - 11:22', user: 'Sistema GPE', icon: ShieldCheck }
                      ].map((event, i) => (
                        <div key={i} className="relative pl-12">
                           <div className="absolute left-0 top-0 w-10 h-10 bg-white border border-border rounded-full flex items-center justify-center z-10">
                              <event.icon className="w-4 h-4 text-muted" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-lead">{event.action}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="text-[9px] font-bold text-muted uppercase">{event.date}</span>
                                 <span className="w-1 h-1 bg-border rounded-full"></span>
                                 <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{event.user}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>
             </div>

             {/* Footer Actions */}
             <div className="p-8 border-t border-border bg-background flex gap-3">
                <button className="flex-1 py-4 bg-lead text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                   <Edit3 className="w-4 h-4" /> Editar Cadastro
                </button>
                <button className="p-4 bg-white border border-border text-muted hover:text-red-500 rounded-2xl transition-all">
                   <Trash2 className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock component for timeline icon
const Video = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);

export default CRMModule;
