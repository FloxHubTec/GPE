
import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Briefcase, 
  AlertCircle, 
  ChevronRight, 
  Download, 
  Filter,
  Calendar,
  PieChart as PieIcon,
  FileText,
  Settings2,
  RefreshCcw,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 45000, target: 40000 },
  { month: 'Fev', revenue: 52000, target: 40000 },
  { month: 'Mar', revenue: 48000, target: 45000 },
  { month: 'Abr', revenue: 61000, target: 45000 },
  { month: 'Mai', monthFull: 'Maio', revenue: 55000, target: 50000 },
  { month: 'Jun', monthFull: 'Junho', revenue: 72000, target: 50000 },
];

const PIE_DATA = [
  { name: 'SaaS', value: 400, color: '#00E054' },
  { name: 'Consultoria', value: 300, color: '#333333' },
  { name: 'Suporte', value: 200, color: '#64748B' },
];

const MainDashboard: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState('Mensal');
  const currentDate = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-lead tracking-tight">Dashboard Executivo</h1>
          <p className="text-muted font-bold mt-1 uppercase tracking-widest text-[10px]">Visão Geral do Ecossistema • {currentDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface border border-border rounded-xl p-1 flex shadow-soft">
            {['Mensal', 'Trimestral', 'Anual'].map((p) => (
              <button 
                key={p}
                onClick={() => setReportPeriod(p)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${reportPeriod === p ? 'bg-lead text-white' : 'text-muted hover:text-lead'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="p-3 bg-surface border border-border rounded-xl text-lead hover:text-primary transition-all shadow-soft group">
            <RefreshCcw className="w-5 h-5 group-active:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </header>

      {/* High Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Faturamento Total', value: 'R$ 333.000', change: '+12.5%', icon: DollarSign, color: 'text-primary', trend: 'up' },
          { label: 'Projetos Ativos', value: '24', change: '+2', icon: Briefcase, color: 'text-blue-500', trend: 'up' },
          { label: 'Leads no Funil', value: '148', change: '+14%', icon: Users, color: 'text-orange-500', trend: 'up' },
          { label: 'Eficiência Squad', value: '94%', change: '-2%', icon: Zap, color: 'text-green-600', trend: 'down' }
        ].map((card, i) => (
          <div key={i} className="bg-surface p-6 rounded-[32px] border border-border shadow-soft group hover:shadow-active transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-background border border-border group-hover:border-primary/20 transition-all`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${card.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {card.change}
              </span>
            </div>
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">{card.label}</p>
            <p className="text-3xl font-black text-lead tracking-tighter">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-surface p-8 rounded-[40px] border border-border shadow-soft">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-black text-lead uppercase tracking-widest text-sm">Crescimento Financeiro</h3>
              <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-tighter">Comparativo Receita vs Meta</p>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
              <Settings2 className="w-3.5 h-3.5" /> Customizar
            </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E054" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00E054" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}} tickFormatter={(v) => `R$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00E054" strokeWidth={4} fillOpacity={1} fill="url(#revenueGrad)" />
                <Area type="monotone" dataKey="target" stroke="#333" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Distribution */}
        <div className="bg-surface p-8 rounded-[40px] border border-border shadow-soft flex flex-col">
          <h3 className="font-black text-lead uppercase tracking-widest text-sm mb-8">Composição de Receita</h3>
          <div className="flex-1 min-h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
            {PIE_DATA.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] font-black text-lead uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-xs font-black text-muted">{(item.value / 9).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Center */}
      <section className="bg-lead rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-black tracking-tight mb-2">Central de Relatórios Inteligentes</h3>
            <p className="text-white/60 text-sm font-medium leading-relaxed">Gere documentos consolidados em PDF, Excel ou DOCX com inteligência analítica baseada nos dados do CRM e Financeiro.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 shrink-0">
             {[
               { label: 'DRE Consolidado', icon: FileText },
               { label: 'Relatório de Leads', icon: Users },
               { label: 'Performance Squad', icon: Zap },
               { label: 'Forecast Vendas', icon: TrendingUp }
             ].map((report, i) => (
               <button key={i} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all text-left group">
                 <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary transition-colors">
                    <report.icon className="w-4 h-4 text-primary group-hover:text-lead" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest">{report.label}</span>
               </button>
             ))}
          </div>
        </div>
      </section>

      {/* Recent Alerts / Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface p-8 rounded-[40px] border border-border shadow-soft">
           <div className="flex items-center gap-3 mb-6">
             <AlertCircle className="w-5 h-5 text-orange-500" />
             <h3 className="font-black text-lead uppercase tracking-widest text-sm">Ações Prioritárias GPE</h3>
           </div>
           <div className="space-y-4">
              {[
                { title: 'Aprovação de Proposta Alpha Tech', desc: 'Aguardando validação do gestor comercial.', tag: 'CRM', color: 'text-primary' },
                { title: 'Deadline Próximo: App Mobile', desc: 'Etapa de QA encerra em 24h.', tag: 'Projeto', color: 'text-blue-500' }
              ].map((alert, i) => (
                <div key={i} className="p-5 bg-background rounded-2xl border border-border flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer">
                  <div>
                    <p className="text-sm font-black text-lead">{alert.title}</p>
                    <p className="text-xs text-muted font-medium mt-1">{alert.desc}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg bg-white border border-border text-[9px] font-black uppercase tracking-widest ${alert.color}`}>
                    {alert.tag}
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-primary p-1 rounded-[40px] shadow-xl shadow-primary/20">
          <div className="bg-surface h-full w-full rounded-[39px] p-8 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
                <PieIcon className="w-8 h-8 text-primary" />
             </div>
             <h3 className="text-xl font-black text-lead tracking-tight">Personalize seu Dashboard</h3>
             <p className="text-sm text-muted font-medium mt-2 mb-8 max-w-xs">Arraste e solte os widgets que mais importam para o seu dia a dia corporativo.</p>
             <button className="px-10 py-4 bg-lead text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                Configurar Layout
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
