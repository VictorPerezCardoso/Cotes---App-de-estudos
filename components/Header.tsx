import React from 'react';
import { ViewState, User } from '../types';
import { LogOut, LayoutDashboard, BrainCircuit, History, BookOpen } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, onNavigate, onLogout }) => {
  if (!user) return null;

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => onNavigate(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        currentView === view
          ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/70 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                COTES
            </h1>
        </div>

        <nav className="flex items-center gap-2">
          <NavItem view={ViewState.HUB} icon={BookOpen} label="Estudar" />
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={ViewState.KNOWLEDGE_BASE} icon={History} label="Histórico" />
        </nav>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden md:block">Olá, {user.name.split(' ')[0]}</span>
          <button
            onClick={onLogout}
            className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
