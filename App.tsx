import React, { useState, useEffect } from 'react';
import { User, StudySession, ViewState, QuizResult } from './types';
import Auth from './components/Auth';
import Header from './components/Header';
import LearningHub from './components/LearningHub';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import KnowledgeBase from './components/KnowledgeBase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.AUTH);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);

  // Load initial state
  useEffect(() => {
    const savedUser = localStorage.getItem('cotes_active_user');
    const savedSessions = localStorage.getItem('cotes_sessions');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView(ViewState.HUB);
    }

    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Persist sessions
  useEffect(() => {
    localStorage.setItem('cotes_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem('cotes_active_user', JSON.stringify(loggedUser));
    setCurrentView(ViewState.HUB);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cotes_active_user');
    setCurrentView(ViewState.AUTH);
  };

  const handleSessionComplete = (session: StudySession) => {
    setActiveSession(session);
    // Don't save to full history yet, wait for quiz
    // But for safety, let's keep it in memory
    setCurrentView(ViewState.QUIZ);
  };

  const handleQuizFinish = (result: QuizResult) => {
    if (activeSession) {
      const completedSession: StudySession = {
        ...activeSession,
        quizResult: result
      };
      setSessions(prev => [...prev, completedSession]);
      setActiveSession(null);
      setCurrentView(ViewState.DASHBOARD);
    } else {
        // Fallback
        setCurrentView(ViewState.HUB);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.AUTH:
        return <Auth onLogin={handleLogin} />;
      case ViewState.HUB:
        return <LearningHub onSessionComplete={handleSessionComplete} />;
      case ViewState.QUIZ:
        return activeSession ? (
          <Quiz session={activeSession} onFinish={handleQuizFinish} />
        ) : (
          <div className="text-center text-red-400">Erro: Nenhuma sessão ativa encontrada.</div>
        );
      case ViewState.DASHBOARD:
        return <Dashboard sessions={sessions} />;
      case ViewState.KNOWLEDGE_BASE:
        return <KnowledgeBase sessions={sessions} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-purple-500 selection:text-white pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-900/20 blur-[120px]"></div>
      </div>

      <Header 
        user={user} 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onLogout={handleLogout} 
      />

      <main className="relative z-10 container mx-auto px-4 py-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
