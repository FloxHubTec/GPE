
import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  ExternalLink, 
  Lock, 
  Folder, 
  Search, 
  Plus, 
  Globe,
  Grid,
  List,
  X,
  History,
  User,
  Calendar
} from 'lucide-react';

interface VaultItem {
  title: string;
  user: string;
  project: string;
  url: string;
}

interface HistoryEntry {
  id: string;
  user: string;
  date: string;
  action: string;
}

const MOCK_HISTORY: Record<string, HistoryEntry[]> = {
  'Google Console': [
    { id: '1', user: 'Admin Principal', date: 'Hoje, 14:20', action: 'Visualizou Senha' },
    { id: '2', user: 'Gabriel Silva', date: 'Ontem, 09:15', action: 'Copiou Usuário' },
    { id: '3', user: 'Admin Principal', date: '22 Out, 18:44', action: 'Alterou Permissões' }
  ],
  'Stripe Dashboard': [
    { id: '1', user: 'Financeiro Root', date: 'Hoje, 10:05', action: 'Gerou nova Chave API' },
    { id: '2', user: 'Admin Principal', date: '21 Out, 11:30', action: 'Visualizou Senha' }
  ],
  'AWS Production': [
    { id: '1', user: 'DevOps Leader', date: 'Hoje, 08:00', action: 'Login efetuado' },
    { id: '2', user: 'Gabriel Silva', date: '20 Out, 16:20', action: 'Visualizou Senha' }
  ]
};

const VaultModule: React.FC = () => {
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<VaultItem | null>(null);

  const items: VaultItem[] = [
    { title: 'Google Console', user: 'admin@floxhub.com', project: 'Analytics Pro', url: 'console.cloud.google.com' },
    { title: 'Stripe Dashboard', user: 'finance@floxhub.com', project: 'Pagamentos', url: 'dashboard.stripe.com' },
    { title: 'AWS Production', user: 'devops@floxhub.com', project: 'Infra Cloud', url: 'aws.amazon.com' },
    { title: 'GitHub Enterprise', user: 'gabriel.silva', project: 'Core Engine', url: 'github.com' },
    { title: 'DigitalOcean', user: 'admin', project: 'Hospedagem', url: 'digitalocean.com' },
    { title: 'Vercel Platform', user: 'deploy@floxhub.com', project: 'Front-end', url: 'vercel.com' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-lead tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Cofre de Projetos
          </h1>
          <p className="text-muted font-medium mt-1">Gestão centralizada de acessos, chaves e senhas de infraestrutura.</p>
        </div>
        <button className="bg-primary text-lead font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]">
          <Plus className="w-5 h-5" />
          Novo Acesso
        </button>
      </header>

      {/* Control Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-border shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por projeto ou ferramenta..." 
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 border-l border-border ml-4">
          <button className="p-2 bg-primary/10 text-primary rounded-lg"><Grid className="w-5 h-5" /></button>
          <button className="p-2 text-muted hover:text-lead rounded-lg"><List className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Grid of Secrets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-surface group rounded-2xl border border-border shadow-soft hover:border-primary transition-all overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-background rounded-xl group-hover:bg-primary/5 transition-colors">
                  <Globe className="w-6 h-6 text-muted group-hover:text-primary transition-colors" />
                </div>
                <button className="text-muted hover:text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-black text-lead mb-1">{item.title}</h3>
              <p className="text-xs text-muted mb-6 flex items-center gap-1">
                <Folder className="w-3 h-3" />
                {item.project}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg border border-border/50">
                  <span className="font-bold text-muted uppercase tracking-wider">Usuário</span>
                  <span className="font-bold text-lead">{item.user}</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 bg-background rounded-lg border border-border/50">
                  <span className="font-bold text-muted uppercase tracking-wider">Senha</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-muted tracking-widest">••••••••</span>
                    <button className="p-1 hover:bg-border rounded transition-colors">
                      <Key className="w-3 h-3 text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background/50 p-4 border-t border-border flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-primary" />
                Encriptado AES-256
              </span>
              <button 
                onClick={() => setSelectedHistoryItem(item)}
                className="hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5" />
                Histórico
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* History Modal */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-lead/40 backdrop-blur-sm" onClick={() => setSelectedHistoryItem(null)}></div>
          <div className="relative bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-background/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lead tracking-tight">Histórico de Acesso</h3>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider">{selectedHistoryItem.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedHistoryItem(null)}
                className="p-2 hover:bg-border rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              {(MOCK_HISTORY[selectedHistoryItem.title] || []).length > 0 ? (
                MOCK_HISTORY[selectedHistoryItem.title].map((entry) => (
                  <div key={entry.id} className="flex gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors bg-background/20 group">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted group-hover:text-primary transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-lead">{entry.user}</span>
                        <span className="text-[10px] font-bold text-muted flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.date}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-muted">{entry.action}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-3">
                  <Lock className="w-12 h-12 text-border mx-auto" />
                  <p className="text-sm font-bold text-muted">Nenhum registro de acesso recente.</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-background/50 border-t border-border flex justify-end">
              <button 
                onClick={() => setSelectedHistoryItem(null)}
                className="px-6 py-2.5 bg-lead text-white text-sm font-bold rounded-xl hover:bg-lead/90 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultModule;
