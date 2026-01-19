
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  User, 
  Users,
  Clock,
  Upload,
  FileText,
  Download,
  Trash2,
  FolderTree,
  ChevronRight,
  Info,
  Zap,
  Calendar,
  AlertTriangle,
  X,
  FileCode,
  Folder,
  Save,
  ImageIcon,
  Loader2,
  CheckCircle2,
  Send
} from 'lucide-react';
import { ProjectStage, Attachment } from '../types';
import { supabase } from '../services/supabase';

const DEVS = [
  { id: 'dev1', name: 'Gabriel Silva', role: 'Front-end' },
  { id: 'dev2', name: 'Felipe Moraes', role: 'Back-end' },
  { id: 'dev3', name: 'Ricardo Santos', role: 'Full-stack' },
];

// Componente de Visualização de Estrutura (Blueprint Automático)
const StructureVisualizer: React.FC<{ paths: string[] }> = ({ paths }) => {
  const treeData = useMemo(() => {
    const root: any = {};
    if (!paths || !Array.isArray(paths)) return root;
    
    paths.forEach(path => {
      let current = root;
      path.split('/').filter(Boolean).forEach(part => {
        if (!current[part]) current[part] = {};
        current = current[part];
      });
    });
    return root;
  }, [paths]);

  const renderTree = (node: any, name: string, depth: number = 0) => {
    const isFile = Object.keys(node).length === 0;
    return (
      <div key={name + depth} style={{ marginLeft: depth * 16 }} className="animate-in slide-in-from-left duration-200">
        <div className="flex items-center gap-2 py-1 group cursor-default">
          {isFile ? (
            <FileCode className="w-3.5 h-3.5 text-primary/60" />
          ) : (
            <Folder className="w-3.5 h-3.5 text-orange-400 fill-orange-400/20" />
          )}
          <span className={`text-[11px] font-bold tracking-tight ${isFile ? 'text-lead/80' : 'text-lead uppercase'}`}>
            {name}
          </span>
        </div>
        {Object.entries(node).map(([key, value]) => renderTree(value, key, depth + 1))}
      </div>
    );
  };

  return (
    <div className="bg-background/90 rounded-2xl p-6 border border-border/50 font-mono shadow-inner overflow-x-auto min-h-[120px] max-h-[300px] border-l-4 border-l-primary/30">
      {Object.keys(treeData).length > 0 ? (
        Object.entries(treeData).map(([key, value]) => renderTree(value, key))
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-muted/30">
          <FolderTree className="w-10 h-10 mb-2" />
          <p className="text-[9px] font-black uppercase tracking-[0.2em]">Aguardando Definição de Blueprint</p>
        </div>
      )}
    </div>
  );
};

const PlanningModule: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stages, setStages] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState('Alpha Tech - App Mobile');
  const [projectBriefing, setProjectBriefing] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSendingToDev, setIsSendingToDev] = useState(false);
  
  const [newStage, setNewStage] = useState<Partial<ProjectStage>>({
    name: '',
    deadline: '',
    structurePaths: [],
    status: 'TODO'
  });
  const [pathInput, setPathInput] = useState('');

  useEffect(() => {
    fetchStages();
  }, [selectedProject]);

  const fetchStages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stages')
        .select('*')
        .eq('project_name', selectedProject)
        .order('created_at', { ascending: true });

      if (error) throw error;
      // Normalizar campos snake_case do Supabase para o CamelCase da UI
      const normalized = (data || []).map(s => ({
        ...s,
        structurePaths: s.structure_paths || [],
        assignedFrontEnd: s.assigned_front_end,
        assignedBackEnd: s.assigned_back_end,
      }));
      setStages(normalized);
    } catch (err) {
      console.error('[Planning] Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStage = async () => {
    if (!newStage.name || !newStage.deadline) return;
    
    setLoading(true);
    const stageData = {
      name: newStage.name,
      deadline: newStage.deadline,
      status: 'TODO',
      structure_paths: newStage.structurePaths || [],
      project_name: selectedProject,
      attachments: []
    };

    try {
      const { data, error } = await supabase
        .from('stages')
        .insert([stageData])
        .select();

      if (error) throw error;
      if (data) {
        await fetchStages();
        setShowAddModal(false);
        setNewStage({ name: '', deadline: '', structurePaths: [] });
      }
    } catch (err) {
      alert('Erro ao salvar no banco. Verifique as permissões de tabela.');
    } finally {
      setLoading(false);
    }
  };

  const updateStageField = async (id: string, field: string, value: any) => {
    // Mapear campos para snake_case do banco
    const dbField = field === 'assignedFrontEnd' ? 'assigned_front_end' : 
                   field === 'assignedBackEnd' ? 'assigned_back_end' : 
                   field === 'structurePaths' ? 'structure_paths' : field;

    try {
      const { error } = await supabase
        .from('stages')
        .update({ [dbField]: value })
        .eq('id', id);

      if (error) throw error;
      setStages(stages.map(s => s.id === id ? { ...s, [field]: value } : s));
    } catch (err) {
      console.error('Erro de persistência:', err);
    }
  };

  const removeStage = async (id: string) => {
    if (!confirm('Deseja excluir esta etapa do planejamento?')) return;
    try {
      const { error } = await supabase.from('stages').delete().eq('id', id);
      if (error) throw error;
      setStages(stages.filter(s => s.id !== id));
    } catch (err) {
      alert('Erro ao excluir registro.');
    }
  };

  const addPathToNewStage = () => {
    if (!pathInput) return;
    setNewStage(prev => ({
      ...prev,
      structurePaths: [...(prev.structurePaths || []), pathInput]
    }));
    setPathInput('');
  };

  const handleHandoff = async () => {
    setIsSendingToDev(true);
    try {
      // Simulação de gatilho para o Squad (poderia ser uma function ou webhook)
      await new Promise(r => setTimeout(r, 1500));
      alert('Handoff técnico concluído com sucesso!');
    } finally {
      setIsSendingToDev(false);
    }
  };

  const formattedToday = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-500 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-lead tracking-tight italic">GPE Planning Hub</h1>
          <p className="text-muted font-bold mt-1 uppercase tracking-widest text-[10px]">Arquitetura & Estratégia • {formattedToday}</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-6 py-3.5 bg-surface border border-border rounded-2xl font-black text-sm outline-none focus:border-primary transition-all shadow-soft"
          >
            <option>Alpha Tech - App Mobile</option>
            <option>Global Logistics - ERP</option>
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-lead font-black px-6 py-3.5 rounded-2xl flex items-center gap-3 hover:shadow-active transition-all active:scale-95 uppercase text-xs tracking-widest"
          >
            <Plus className="w-5 h-5" /> Adicionar Etapa
          </button>
        </div>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-20 bg-surface rounded-[40px] border border-border animate-pulse">
           <Loader2 className="w-8 h-8 text-primary animate-spin" />
           <span className="ml-3 text-xs font-black uppercase tracking-widest text-muted">Acessando Cloud GPE...</span>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-10">
            
            <section className="bg-surface rounded-3xl border border-border shadow-soft overflow-hidden">
               <div className="p-6 border-b border-border bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="text-xs font-black text-lead uppercase tracking-widest">Contexto de Arquitetura</h3>
                  </div>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:underline">
                    <Download className="w-3.5 h-3.5" /> PDF de Referência
                  </button>
               </div>
               <div className="p-8">
                  <textarea 
                    value={projectBriefing}
                    onChange={(e) => setProjectBriefing(e.target.value)}
                    placeholder="Defina as diretrizes técnicas aqui..."
                    className="w-full h-28 p-5 bg-background border border-border rounded-2xl text-sm font-medium outline-none focus:border-primary transition-all resize-none leading-relaxed"
                  />
               </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2 ml-2 font-black">
                 <ClipboardList className="w-4 h-4 text-primary" /> Roadmap de Desenvolvimento
              </h3>
              
              <div className="space-y-8">
                {stages.map((stage, idx) => (
                  <div key={stage.id} className="bg-surface rounded-[40px] border border-border transition-all p-10 relative overflow-hidden group hover:border-primary/40 shadow-soft animate-in zoom-in-95">
                    <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => removeStage(stage.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12">
                      <div className="flex-1 space-y-8">
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 rounded-[24px] bg-lead text-white flex items-center justify-center font-black text-2xl shadow-xl">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-black text-xl text-lead uppercase tracking-tight leading-none">{stage.name}</h3>
                            <div className="flex items-center gap-3 mt-3">
                               <input 
                                 type="date" 
                                 value={stage.deadline} 
                                 onChange={(e) => updateStageField(stage.id, 'deadline', e.target.value)}
                                 className="text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border border-border bg-background outline-none focus:border-primary transition-all"
                               />
                               <span className="text-[9px] font-black text-muted uppercase tracking-widest">SLA de Entrega</span>
                            </div>
                          </div>
                        </div>

                        {/* DESENHO TÉCNICO AUTOMÁTICO */}
                        <div className="space-y-4">
                           <div className="flex items-center justify-between px-2">
                              <p className="text-[10px] font-black text-lead uppercase tracking-[0.2em] flex items-center gap-2">
                                 <FolderTree className="w-4 h-4 text-primary" /> Estrutura de Diretórios (Blueprint)
                              </p>
                              <span className="text-[9px] font-bold text-muted uppercase">{stage.structurePaths?.length || 0} Caminhos</span>
                           </div>
                           <StructureVisualizer paths={stage.structurePaths || []} />
                        </div>

                        {/* Atribuição de Squad */}
                        <div className="grid grid-cols-2 gap-6 bg-background/50 p-6 rounded-3xl border border-border">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Dev Front-End</label>
                            <select 
                              value={stage.assignedFrontEnd || ''}
                              onChange={(e) => updateStageField(stage.id, 'assignedFrontEnd', e.target.value)}
                              className="w-full p-3 bg-white border border-border rounded-2xl text-[10px] font-black outline-none focus:border-primary transition-all shadow-sm"
                            >
                              <option value="">Aguardando...</option>
                              {DEVS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Dev Back-End</label>
                            <select 
                              value={stage.assignedBackEnd || ''}
                              onChange={(e) => updateStageField(stage.id, 'assignedBackEnd', e.target.value)}
                              className="w-full p-3 bg-white border border-border rounded-2xl text-[10px] font-black outline-none focus:border-primary transition-all shadow-sm"
                            >
                              <option value="">Aguardando...</option>
                              {DEVS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-72 space-y-6">
                        <div className="bg-background/80 rounded-[32px] p-6 border border-border border-dashed text-center">
                           <p className="text-[10px] font-black text-lead uppercase tracking-widest mb-4 flex items-center gap-2 justify-center">
                              <Upload className="w-4 h-4 text-primary" /> Documentação Técnica
                           </p>
                           <div className="space-y-3">
                              {(stage.attachments || []).map((att: any) => (
                                <div key={att.id} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-border group/att hover:border-primary/40 transition-all">
                                   <div className="flex items-center gap-2 overflow-hidden">
                                      <FileText className="w-4 h-4 text-muted group-hover/att:text-primary transition-colors" />
                                      <span className="text-[9px] font-bold text-lead truncate">{att.name}</span>
                                   </div>
                                   <Download className="w-3.5 h-3.5 text-muted hover:text-primary cursor-pointer transition-colors" />
                                </div>
                              ))}
                              <label className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-[9px] font-black text-muted uppercase hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer bg-white">
                                 <Plus className="w-4 h-4" /> Anexar Diagrama
                                 <input type="file" className="hidden" />
                              </label>
                           </div>
                        </div>
                        <div className="p-6 bg-lead text-white rounded-[32px] flex items-center gap-4 shadow-xl">
                           <Zap className="w-6 h-6 text-primary" />
                           <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-primary">Status Engine</p>
                              <p className="text-[11px] font-bold opacity-80">{stage.status === 'DONE' ? 'Produção' : 'Planejamento'}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
             <div className="bg-lead text-white p-10 rounded-[50px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full -mr-24 -mt-24 blur-[80px] transition-transform duration-1000 group-hover:scale-150"></div>
                <h3 className="text-2xl font-black tracking-tight mb-4 leading-none">Notificar Squad</h3>
                <p className="text-[11px] text-white/50 leading-relaxed font-medium mb-10">Ao confirmar o Handoff, o squad receberá o desenho da arquitetura e as especificações técnicas em seus respectivos dashboards de produção.</p>
                <button 
                  onClick={handleHandoff}
                  disabled={isSendingToDev}
                  className="w-full py-5 bg-primary text-lead rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSendingToDev ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isSendingToDev ? 'Sincronizando...' : 'Executar Handoff'}
                </button>
             </div>

             <div className="bg-surface rounded-[40px] p-8 border border-border shadow-soft">
                <h3 className="text-[11px] font-black text-lead uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                   <Users className="w-5 h-5 text-primary" /> Monitoramento de Squad
                </h3>
                <div className="space-y-6">
                   {DEVS.map(dev => (
                     <div key={dev.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                              <User className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                           </div>
                           <div>
                              <p className="text-[12px] font-black text-lead">{dev.name}</p>
                              <p className="text-[9px] text-muted font-black uppercase tracking-widest">{dev.role}</p>
                           </div>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(0,224,84,0.5)]"></div>
                     </div>
                   ))}
                </div>
             </div>
          </aside>
        </div>
      )}

      {/* MODAL: NOVA ETAPA */}
      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-lead/70 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-surface w-full max-w-2xl rounded-[50px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] border border-white/10">
             <div className="p-10 bg-background border-b border-border flex items-center justify-between">
                <div>
                   <h3 className="text-2xl font-black text-lead tracking-tight">Novo Milestone Técnico</h3>
                   <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-1.5">Defina o escopo e o blueprint de diretórios</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-4 hover:bg-border rounded-[24px] transition-all"><X className="w-6 h-6 text-muted" /></button>
             </div>

             <div className="p-10 overflow-y-auto space-y-10">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Título da Etapa</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Auth Integration"
                        value={newStage.name}
                        onChange={(e) => setNewStage({...newStage, name: e.target.value})}
                        className="w-full px-6 py-4 rounded-[24px] border border-border bg-background outline-none focus:border-primary font-bold text-sm shadow-inner"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Deadline Final</label>
                      <input 
                        type="date" 
                        value={newStage.deadline}
                        onChange={(e) => setNewStage({...newStage, deadline: e.target.value})}
                        className="w-full px-6 py-4 rounded-[24px] border border-border bg-background outline-none focus:border-primary font-bold text-sm shadow-inner"
                      />
                   </div>
                </div>

                <div className="space-y-5">
                   <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                     <FolderTree className="w-4 h-4 text-primary" /> Mapeamento de Diretórios (Blueprint)
                   </label>
                   <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Ex: src/modules/auth/login.tsx"
                        value={pathInput}
                        onChange={(e) => setPathInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addPathToNewStage()}
                        className="flex-1 px-6 py-4 rounded-[24px] border border-border bg-background outline-none focus:border-primary font-bold text-sm shadow-inner"
                      />
                      <button onClick={addPathToNewStage} className="px-8 bg-lead text-white rounded-[24px] font-black text-xs uppercase hover:bg-primary transition-all shadow-xl">Add</button>
                   </div>
                   
                   <div className="bg-background rounded-[32px] border border-border border-dashed p-8 shadow-inner">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-6">Preview do Desenho Estrutural</p>
                      <StructureVisualizer paths={newStage.structurePaths || []} />
                      <div className="mt-6 flex flex-wrap gap-3">
                        {newStage.structurePaths?.map(p => (
                          <span key={p} className="bg-white border border-border px-4 py-2 rounded-2xl text-[9px] font-black text-muted flex items-center gap-3 animate-in zoom-in-50">
                            {p}
                            <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => setNewStage(prev => ({...prev, structurePaths: prev.structurePaths?.filter(x => x !== p)}))} />
                          </span>
                        ))}
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-10 bg-background border-t border-border flex justify-end gap-6">
                <button onClick={() => setShowAddModal(false)} className="px-8 py-4 text-xs font-black text-muted uppercase tracking-[0.2em] hover:text-lead transition-colors">Cancelar</button>
                <button 
                  onClick={handleAddStage} 
                  disabled={loading}
                  className="px-14 py-4 bg-primary text-lead rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 flex items-center gap-3 hover:scale-[1.05] active:scale-95 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Persistir Planejamento
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningModule;
