
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Calendar,
  Lock,
  ArrowRight,
  LogOut,
  Bell,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  X
} from 'lucide-react';
import ScoreWidget from '../components/ScoreWidget';
import { Task } from '../types';
import { syncScoreToBackend } from '../services/scoreService';

const MOCK_TASKS: Task[] = [
  { id: '1', description: 'Atualizar documentação técnica', weight: 50, completed: false, category: 'FRONTEND', priority: 'MEDIUM', durationMinutes: 45, deadline: '2024-10-24' },
  { id: '2', description: 'Revisar PR #442', weight: 30, completed: true, category: 'FRONTEND', priority: 'HIGH', durationMinutes: 20, deadline: '2024-10-24' },
  { id: '3', description: 'Daily Scrum Team Alpha', weight: 20, completed: false, category: 'MEETING', priority: 'LOW', durationMinutes: 15, deadline: '2024-10-25' },
  { id: '4', description: 'Configurar variáveis de ambiente', weight: 100, completed: false, category: 'BACKEND', priority: 'HIGH', durationMinutes: 60, deadline: '2024-10-23' },
  { id: '5', description: 'Alinhamento com Gestor', weight: 15, completed: false, category: 'ADMIN', priority: 'MEDIUM', durationMinutes: 30, deadline: '2024-10-24' },
];

const InternDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [score, setScore] = useState(30);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Filtering and Sorting State
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'WEIGHT' | 'DEADLINE' | 'STATUS'>('DEADLINE');

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newStatus = !t.completed;
        if (newStatus) {
          handleScoreGain(t.weight);
        }
        return { ...t, completed: newStatus };
      }
      return t;
    }));
  };

  const handleScoreGain = (points: number) => {
    setScore(prev => prev + points);
    syncScoreToBackend('intern-001', points);
  };

  const confirmCheckToggle = () => {
    setShowConfirmDialog(true);
  };

  const handleCheckAction = () => {
    setIsCheckedIn(!isCheckedIn);
    setLastCheckIn(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    setShowConfirmDialog(false);
  };

  const priorityStyles = {
    HIGH: 'bg-red-500/10 text-red-600',
    MEDIUM: 'bg-orange-500/10 text-orange-600',
    LOW: 'bg-blue-500/10 text-blue-600',
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];
    
    if (filterCategory !== 'ALL') {
      result = result.filter(t => t.category === filterCategory);
    }

    result.sort((a, b) => {
      if (sortBy === 'WEIGHT') return b.weight - a.weight;
      if (sortBy === 'DEADLINE') return a.deadline.localeCompare(b.deadline);
      if (sortBy === 'STATUS') return Number(a.completed) - Number(b.completed);
      return 0;
    });

    return result;
  }, [tasks, filterCategory, sortBy]);

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background p-4 lg:p-8 gap-8 relative">
      
      {/* Confirmation Dialog Modal */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-lead/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-2xl shadow-2xl p-8 border border-border animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-lead mb-2">Confirmar {isCheckedIn ? 'Saída' : 'Entrada'}?</h3>
              <p className="text-sm text-muted mb-8">Deseja registrar o seu {isCheckedIn ? 'encerramento' : 'início'} de jornada agora?</p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 py-3 px-4 border border-border rounded-xl font-bold text-muted hover:bg-background transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleCheckAction}
                  className="flex-1 py-3 px-4 bg-primary text-lead rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                  Sim, Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Column: Stats & Profile */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="bg-surface rounded-2xl p-8 shadow-soft border border-border">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 overflow-hidden">
               <img src="https://picsum.photos/100/100" alt="Avatar" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-lead">Gabriel Silva</h2>
              <p className="text-sm font-medium text-muted">Dev Estagiário • Floxhub</p>
            </div>
          </div>

          <ScoreWidget score={score} maxScore={500} />

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-lead">XP Total</span>
              </div>
              <span className="text-lg font-bold text-lead">{score} pts</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-background rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-lead">Rank Semanal</span>
              </div>
              <span className="text-lg font-bold text-lead">#12</span>
            </div>
          </div>

          <button 
            onClick={confirmCheckToggle}
            className={`w-full mt-8 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
              isCheckedIn 
                ? 'bg-lead text-white hover:bg-lead/90' 
                : 'bg-primary text-lead hover:shadow-active'
            }`}
          >
            <Clock className="w-5 h-5" />
            {isCheckedIn ? 'Encerrar Expediente' : 'Check-in'}
          </button>
          
          {lastCheckIn && (
            <p className="text-center text-xs text-muted mt-3 font-medium">
              Último registro às {lastCheckIn}
            </p>
          )}
        </div>

        <div className="bg-surface rounded-2xl p-6 shadow-soft border border-border">
          <h3 className="text-sm font-bold text-lead uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Cofre de Acessos
          </h3>
          <div className="space-y-3">
            <div className="group flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium text-lead">AWS Production</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
            </div>
            <div className="group flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-muted" />
                <span className="text-sm font-medium text-lead">Stripe API Keys</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Main Content */}
      <div className="lg:w-2/3 flex flex-col gap-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-lead tracking-tight">Minha Jornada</h1>
            <p className="text-muted font-medium mt-1">Quarta-feira, 24 de Outubro</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 bg-surface border border-border rounded-xl text-muted hover:text-primary transition-colors shadow-soft">
              <Bell className="w-5 h-5" />
            </button>
             <button className="p-3 bg-surface border border-border rounded-xl text-muted hover:text-red-500 transition-colors shadow-soft">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="font-bold text-lead">Tarefas de Hoje</h3>
                <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full uppercase">
                  {completedCount}/{tasks.length} Concluídas
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Filter */}
                <div className="flex items-center gap-2 bg-background p-1 rounded-xl border border-border">
                  <Filter className="w-3.5 h-3.5 text-muted ml-2" />
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-bold uppercase tracking-wider outline-none text-muted focus:ring-0 pr-8"
                  >
                    <option value="ALL">Categorias</option>
                    <option value="FRONTEND">Front-end</option>
                    <option value="BACKEND">Back-end</option>
                    <option value="MEETING">Reunião</option>
                    <option value="ADMIN">Admin</option>
                    <option value="PLANNING">Planejamento</option>
                  </select>
                </div>
                
                {/* Sort */}
                <div className="flex items-center gap-2 bg-background p-1 rounded-xl border border-border">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted ml-2" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none text-[10px] font-bold uppercase tracking-wider outline-none text-muted focus:ring-0 pr-8"
                  >
                    <option value="DEADLINE">Prazo</option>
                    <option value="WEIGHT">XP/Peso</option>
                    <option value="STATUS">Status</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {filteredAndSortedTasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    task.completed 
                      ? 'bg-primary/5 border-primary/20 opacity-75 scale-[0.98]' 
                      : 'bg-surface border-border hover:border-primary/40 hover:shadow-md'
                  }`}
                >
                  {/* Satisfaction animation highlight */}
                  {task.completed && (
                    <div className="absolute inset-0 bg-primary/10 animate-in fade-out duration-1000 pointer-events-none" />
                  )}

                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all duration-300 ${
                    task.completed ? 'bg-primary border-primary scale-110' : 'border-border bg-white'
                  }`}>
                    {task.completed && <CheckCircle2 className="w-4 h-4 text-lead" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold transition-all duration-300 ${task.completed ? 'text-lead/60 line-through' : 'text-lead'}`}>
                        {task.description}
                      </p>
                      {/* Priority Tag */}
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{task.category}</span>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">+{task.weight} XP</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="text-xs font-medium text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.durationMinutes}m
                    </div>
                    <div className="text-[9px] font-bold text-muted/60 uppercase">
                      Até {new Date(task.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredAndSortedTasks.length === 0 && (
                <div className="py-12 text-center">
                  <X className="w-12 h-12 text-border mx-auto mb-4" />
                  <p className="text-sm font-bold text-muted">Nenhuma tarefa encontrada com estes filtros.</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
              <h3 className="font-bold text-lead mb-4">Métricas de Foco</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Produtividade Real</span>
                    <span className="text-xs font-bold text-primary">82%</span>
                  </div>
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Tempo em Reuniões</span>
                    <span className="text-xs font-bold text-lead">18%</span>
                  </div>
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-lead" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mt-4">
                   <div className="flex gap-3">
                      <Zap className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-lead">Dica do GPE</p>
                        <p className="text-xs text-lead/70 mt-1">Você está 15% acima da sua média de produtividade hoje. Continue assim!</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft">
              <h3 className="font-bold text-lead mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Próximos Eventos
              </h3>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-primary bg-background rounded-r-lg">
                   <p className="text-xs font-bold text-lead">Review de Sprint</p>
                   <p className="text-[10px] text-muted font-medium mt-0.5">Hoje • 16:30 - 17:30</p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-background rounded-r-lg">
                   <p className="text-xs font-bold text-lead">Planning Squad Beta</p>
                   <p className="text-[10px] text-muted font-medium mt-0.5">Amanhã • 09:00 - 10:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;
