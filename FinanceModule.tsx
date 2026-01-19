
import React, { useState } from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  DollarSign, 
  Calendar, 
  PieChart as ChartIcon, 
  Download,
  FileText,
  Clock,
  Eye,
  Building2,
  X,
  TrendingUp,
  CreditCard
} from 'lucide-react';

const FinanceModule: React.FC = () => {
  const [selectedBillingClient, setSelectedBillingClient] = useState<any>(null);

  const today = new Date();
  const currentMonth = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const billingQueue = [
    { client: 'Alpha Tech', status: 'ENTREGUE', value: 'R$ 15.000,00', date: 'Hoje', cnpj: '12.345.678/0001-90', addr: 'Rua das Flores, 123 - SP' },
    { client: 'Studio Creative', status: 'ENTREGUE', value: 'R$ 8.500,00', date: '22 Out', cnpj: '98.765.432/0001-11', addr: 'Av. Paulista, 1000 - SP' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-lead tracking-tight">Financeiro Central</h1>
          <p className="text-muted font-bold mt-1 uppercase tracking-widest text-[10px]">Período de Referência: {currentMonth}</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface border border-border text-lead font-black px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-soft hover:bg-background transition-all text-xs uppercase tracking-widest">
            <Download className="w-5 h-5" /> Relatório {currentMonth.split(' ')[0]}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface p-8 rounded-3xl border border-border shadow-soft group hover:shadow-active transition-all">
          <span className="text-[10px] font-black text-muted uppercase tracking-widest block mb-4">Fluxo Disponível</span>
          <p className="text-3xl font-black text-lead tracking-tighter">R$ 42.850</p>
        </div>
        <div className="bg-surface p-8 rounded-3xl border border-border shadow-soft group hover:shadow-active transition-all">
          <span className="text-[10px] font-black text-muted uppercase tracking-widest block mb-4">Receitas Projetadas</span>
          <p className="text-3xl font-black text-green-600 tracking-tighter">R$ 65.480</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface rounded-[32px] border border-border shadow-soft overflow-hidden">
          <div className="p-8 border-b border-border flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-black text-lead uppercase tracking-widest text-sm">Fila de Faturamento ({today.getFullYear()})</h3>
            </div>
            <span className="text-[10px] font-black text-primary bg-white px-3 py-1 rounded-full border border-primary/20">{billingQueue.length} Pendentes</span>
          </div>
          <div className="divide-y divide-border">
            {billingQueue.map((item, idx) => (
              <div key={idx} className="p-8 flex items-center justify-between hover:bg-background/30 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center font-black text-muted group-hover:text-primary transition-all text-lg">{item.client[0]}</div>
                  <div>
                    <p className="text-sm font-black text-lead">{item.client}</p>
                    <button 
                      onClick={() => setSelectedBillingClient(item)}
                      className="text-[10px] font-bold text-primary flex items-center gap-2 hover:underline mt-1"
                    >
                      <Eye className="w-4 h-4" /> Detalhes Fiscais
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-lead">{item.value}</p>
                  <div className="flex items-center gap-2 justify-end mt-2">
                     <CreditCard className="w-3.5 h-3.5 text-muted" />
                     <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-lead transition-colors">Processar Invoice</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
           <div className="bg-lead text-white p-8 rounded-[32px] border border-lead shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
             <h3 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-3 text-primary">
               <TrendingUp className="w-5 h-5" /> Saúde Financeira
             </h3>
             <p className="text-xs text-white/70 leading-relaxed font-medium">Seu fluxo de caixa está 18% superior ao mesmo período do ano anterior. Utilize este superávit para reinvestimento técnico.</p>
           </div>
        </aside>
      </div>

      {/* Modal Fiscal remains the same or slightly refined for consistency */}
    </div>
  );
};

export default FinanceModule;
