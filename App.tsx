
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  DollarSign, 
  Shield, 
  Settings, 
  Menu, 
  X,
  Bell,
  LogOut,
  HelpCircle,
  ClipboardList
} from 'lucide-react';
import InternDashboard from './modules/InternDashboard';
import LoginPage from './modules/LoginPage';
import CRMModule from './modules/CRMModule';
import FinanceModule from './modules/FinanceModule';
import VaultModule from './modules/VaultModule';
import ConfigModule from './modules/ConfigModule';
import PlanningModule from './modules/PlanningModule';
import MainDashboard from './modules/MainDashboard';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Executivo', icon: LayoutDashboard },
    { id: 'jornada', label: 'Minha Jornada', icon: Briefcase },
    { id: 'crm', label: 'CRM Comercial', icon: Users },
    { id: 'planejamento', label: 'Planejamento', icon: ClipboardList },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'cofre', label: 'Cofre de Projetos', icon: Shield },
    { id: 'config', label: 'Configurações', icon: Settings },
  ];

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'jornada':
        return <InternDashboard />;
      case 'crm':
        return <CRMModule />;
      case 'planejamento':
        return <PlanningModule />;
      case 'financeiro':
        return <FinanceModule />;
      case 'cofre':
        return <VaultModule />;
      case 'config':
        return <ConfigModule />;
      default:
        return (
          <div className="p-12 flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <HelpCircle className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold">Módulo em Desenvolvimento</h2>
            <p className="text-muted mt-2 max-w-sm">
              Estamos expandindo as funcionalidades do GPE Floxhub para melhor atender sua operação.
            </p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-8 px-6 py-2 bg-lead text-white rounded-lg font-bold"
            >
              Voltar ao Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-lead antialiased">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-surface border-r border-border transition-all duration-300 flex flex-col hidden md:flex sticky top-0 h-screen z-50 shrink-0`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-lead text-xl shrink-0">F</div>
          {isSidebarOpen && <span className="font-black text-xl tracking-tight overflow-hidden whitespace-nowrap uppercase">FLOXHUB <span className="text-primary">GPE</span></span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-semibold ${
                activeTab === item.id 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted hover:bg-background hover:text-lead'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
              {activeTab === item.id && isSidebarOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,224,84,0.6)]" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-semibold ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="text-sm">Sair</span>}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 hover:bg-background rounded-xl text-muted"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Top Navbar */}
        <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-40 md:hidden flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black text-lead text-xl">F</div>
            <span className="font-black text-lg tracking-tight uppercase">FLOXHUB</span>
          </div>
          <button className="p-2 hover:bg-background rounded-lg" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
