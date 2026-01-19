
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Settings2, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  ToggleRight,
  ToggleLeft,
  Database,
  Mail,
  Check,
  ChevronRight,
  ShieldAlert,
  X,
  Lock,
  Eye,
  Edit3,
  Trash2,
  Save,
  PenTool,
  Upload,
  Trash,
  Loader2
} from 'lucide-react';
import { supabase } from '../services/supabase';

interface UserMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserPermission {
  module_id: string;
  enabled: boolean;
}

const MODULES_CONFIG = [
  { id: 'crm', name: 'CRM Comercial', desc: 'Gestão de leads, propostas e financeiro de vendas.', color: 'text-primary' },
  { id: 'planejamento', name: 'Planejamento Estratégico', desc: 'Briefing técnico, alocação de squad e prazos.', color: 'text-blue-500' },
  { id: 'cofre', name: 'Cofre de Segurança', desc: 'Acesso a senhas e chaves de API críticas.', color: 'text-orange-500' },
  { id: 'financeiro', name: 'Financeiro Central', desc: 'Faturamento, notas fiscais e relatórios.', color: 'text-green-600' }
];

const ConfigModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'permissions' | 'signature'>('users');
  const [selectedUser, setSelectedUser] = useState<UserMember | null>(null);
  const [userSignature, setUserSignature] = useState<string | null>(null);
  const [userPermissions, setUserPermissions] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedSignature = localStorage.getItem('floxhub_user_signature');
    if (savedSignature) setUserSignature(savedSignature);
  }, []);

  // Carrega permissões do usuário selecionado
  useEffect(() => {
    if (selectedUser) {
      fetchUserPermissions(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchUserPermissions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('module_id, enabled')
        .eq('user_id', userId);

      if (error) throw error;

      const permMap: Record<string, boolean> = {};
      // Inicializa todos como true por padrão se não houver registro
      MODULES_CONFIG.forEach(m => permMap[m.id] = true);
      
      if (data && data.length > 0) {
        data.forEach(p => {
          permMap[p.module_id] = p.enabled;
        });
      }
      setUserPermissions(permMap);
    } catch (err) {
      console.error('Erro ao carregar permissões:', err);
    }
  };

  const handleTogglePermission = (moduleId: string) => {
    setUserPermissions(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const savePermissions = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    
    try {
      const payload = Object.entries(userPermissions).map(([moduleId, enabled]) => ({
        user_id: selectedUser.id,
        module_id: moduleId,
        enabled: enabled
      }));

      const { error } = await supabase
        .from('user_permissions')
        .upsert(payload, { onConflict: 'user_id, module_id' });

      if (error) throw error;
      
      alert(`Privilégios de ${selectedUser.name} atualizados com sucesso.`);
      setSelectedUser(null);
    } catch (err) {
      console.error('Erro ao salvar permissões:', err);
      alert('Falha ao sincronizar com o banco de dados.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUserSignature(base64String);
        localStorage.setItem('floxhub_user_signature', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    setUserSignature(null);
    localStorage.removeItem('floxhub_user_signature');
  };

  const users: UserMember[] = [
    { id: 'user_admin_01', name: 'Admin Principal', email: 'admin@floxhub.com', role: 'Super Admin', status: 'Ativo' },
    { id: 'user_dev_02', name: 'Gabriel Silva', email: 'gabriel.silva@floxhub.com', role: 'Desenvolvedor', status: 'Ativo' },
    { id: 'user_comm_03', name: 'Ricardo Mendes', email: 'ricardo@floxhub.com', role: 'Gestor Comercial', status: 'Ativo' },
  ];

  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-lead tracking-tight">Configurações do Ecossistema</h1>
          <p className="text-muted font-medium mt-1">Governança atualizada em {currentMonth}.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveSubTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'users' ? 'bg-lead text-white shadow-lg' : 'text-muted hover:bg-surface border border-transparent'}`}
          >
            <Users className="w-5 h-5" /> Usuários e Equipe
          </button>
          <button 
            onClick={() => setActiveSubTab('signature')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'signature' ? 'bg-lead text-white shadow-lg' : 'text-muted hover:bg-surface border border-transparent'}`}
          >
            <PenTool className="w-5 h-5" /> Minha Assinatura
          </button>
          <button 
            onClick={() => setActiveSubTab('permissions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'permissions' ? 'bg-lead text-white shadow-lg' : 'text-muted hover:bg-surface border border-transparent'}`}
          >
            <ShieldCheck className="w-5 h-5" /> Políticas Globais
          </button>
        </aside>

        <div className="lg:col-span-3">
          {activeSubTab === 'users' && (
            <div className="bg-surface rounded-3xl border border-border shadow-soft overflow-hidden animate-in fade-in duration-300">
              <div className="p-8 border-b border-border flex items-center justify-between bg-white">
                <div>
                  <h2 className="font-black text-lead uppercase tracking-widest text-sm">Membros da Organização</h2>
                  <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-tighter">Clique no usuário para gerenciar privilégios individuais</p>
                </div>
                <button className="flex items-center gap-2 bg-primary px-6 py-3 rounded-xl text-lead font-bold text-xs hover:shadow-active transition-all"><UserPlus className="w-4 h-4" /> Novo Convite</button>
              </div>
              <div className="divide-y divide-border">
                {users.map((user) => (
                  <div 
                    key={user.id} 
                    onClick={() => setSelectedUser(user)}
                    className="p-6 flex items-center justify-between hover:bg-background/50 group cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center font-black text-primary text-lg group-hover:scale-110 transition-transform">{user.name[0]}</div>
                      <div>
                        <p className="text-sm font-black text-lead">{user.name}</p>
                        <p className="text-[10px] text-muted font-black uppercase tracking-widest">{user.role} • {user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase border border-green-100">Ativo</span>
                      <ChevronRight className="w-5 h-5 text-border group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'signature' && (
            <div className="bg-surface rounded-3xl border border-border shadow-soft p-8 space-y-8 animate-in fade-in duration-300">
               <div>
                  <h2 className="font-black text-lead uppercase tracking-widest text-sm">Assinatura Digital</h2>
                  <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-tighter">Sua assinatura será incluída automaticamente em todas as propostas comerciais geradas por você.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="relative border-2 border-dashed border-border rounded-[32px] p-10 text-center hover:border-primary transition-all group flex flex-col items-center justify-center min-h-[250px] bg-background/30">
                      {userSignature ? (
                        <div className="space-y-4 w-full">
                          <img src={userSignature} className="max-h-32 mx-auto object-contain bg-white p-4 rounded-xl shadow-sm border border-border" alt="Assinatura Digital" />
                          <div className="flex justify-center gap-3">
                             <button onClick={removeSignature} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg text-[10px] font-black uppercase hover:bg-red-100 transition-all">
                                <Trash className="w-3.5 h-3.5" /> Remover
                             </button>
                             <label className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase hover:bg-primary/20 transition-all cursor-pointer">
                                <Upload className="w-3.5 h-3.5" /> Alterar
                                <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                             </label>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-border mb-4 group-hover:scale-110 transition-transform">
                             <PenTool className="w-8 h-8 text-muted group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-xs font-bold text-muted uppercase tracking-widest leading-relaxed">Clique ou arraste para<br/>subir sua assinatura em PNG/JPG</p>
                          <input type="file" accept="image/*" onChange={handleSignatureUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-lead text-white p-8 rounded-[32px] flex flex-col justify-center">
                     <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                     <h4 className="font-black text-sm uppercase tracking-widest mb-2">Segurança Floxhub</h4>
                     <p className="text-xs text-white/60 leading-relaxed font-medium">Sua assinatura é armazenada localmente de forma criptografada e vinculada apenas ao seu perfil. Ela serve como validação técnica em propostas enviadas via GPE.</p>
                  </div>
               </div>
            </div>
          )}

          {activeSubTab === 'permissions' && (
             <div className="py-12 text-center bg-surface rounded-3xl border border-border">
                <ShieldCheck className="w-12 h-12 text-muted/20 mx-auto mb-4" />
                <p className="text-sm font-bold text-muted">Configurações de políticas globais aplicadas a todos os grupos.</p>
             </div>
          )}
        </div>
      </div>

      {/* Gerenciar Privilégios Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-lead/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedUser(null)}></div>
          <div className="relative bg-surface w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
             <div className="p-8 bg-background border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center text-primary text-2xl font-black">{selectedUser.name[0]}</div>
                  <div>
                    <h3 className="font-black text-xl text-lead tracking-tight">Gerenciar Privilégios</h3>
                    <p className="text-xs font-bold text-muted uppercase tracking-widest mt-1">{selectedUser.name} • {selectedUser.role}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-3 hover:bg-border rounded-2xl transition-all"><X className="w-6 h-6 text-muted" /></button>
             </div>

             <div className="p-8 overflow-y-auto space-y-8">
                {MODULES_CONFIG.map((module) => {
                  const isEnabled = userPermissions[module.id] !== false;
                  return (
                    <div key={module.id} className={`p-6 rounded-3xl border transition-all ${isEnabled ? 'bg-background/40 border-primary/20 group' : 'bg-background/20 border-border opacity-60'}`}>
                      <div className="flex items-start justify-between mb-4">
                         <div>
                           <h4 className={`text-sm font-black uppercase tracking-widest ${isEnabled ? module.color : 'text-muted'}`}>{module.name}</h4>
                           <p className="text-[10px] text-muted font-bold mt-1 max-w-[80%]">{module.desc}</p>
                         </div>
                         <button 
                           onClick={() => handleTogglePermission(module.id)}
                           className="transition-transform active:scale-90"
                         >
                           {isEnabled ? (
                             <ToggleRight className="w-10 h-10 text-primary" />
                           ) : (
                             <ToggleLeft className="w-10 h-10 text-muted" />
                           )}
                         </button>
                      </div>
                      
                      {isEnabled && (
                        <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2">
                           <button className="flex items-center justify-center gap-2 p-2.5 bg-white border border-border rounded-xl text-[9px] font-black uppercase text-muted hover:text-primary hover:border-primary transition-all">
                             <Eye className="w-3.5 h-3.5" /> Ver
                           </button>
                           <button className="flex items-center justify-center gap-2 p-2.5 bg-white border border-border rounded-xl text-[9px] font-black uppercase text-muted hover:text-blue-500 hover:border-blue-500 transition-all">
                             <Edit3 className="w-3.5 h-3.5" /> Edit
                           </button>
                           <button className="flex items-center justify-center gap-2 p-2.5 bg-white border border-border rounded-xl text-[9px] font-black uppercase text-muted hover:text-red-500 hover:border-red-500 transition-all">
                             <Trash2 className="w-3.5 h-3.5" /> Del
                           </button>
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>

             <div className="p-8 bg-background border-t border-border flex justify-end gap-4">
                <button onClick={() => setSelectedUser(null)} className="px-8 py-3.5 text-sm font-black text-muted uppercase tracking-widest">Cancelar</button>
                <button 
                  onClick={savePermissions} 
                  disabled={isSaving}
                  className="px-10 py-3.5 bg-lead text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-primary" />}
                  Salvar Privilégios
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigModule;
