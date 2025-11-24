import React from 'react';
import { StudySession } from '../types';
import { CalendarDays, Clock, CheckCircle } from 'lucide-react';

interface KnowledgeBaseProps {
  sessions: StudySession[];
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ sessions }) => {
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const getCalendarUrl = (session: StudySession) => {
    // Schedule for tomorrow same time
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    
    // Format YYYYMMDDTHHMMSSZ
    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const startStr = format(startDate);
    const endStr = format(new Date(startDate.getTime() + 60 * 60 * 1000)); // 1 hour duration default

    const title = encodeURIComponent(`Revisão: ${session.topic}`);
    const details = encodeURIComponent(`Revisar materiais sobre ${session.topic}. Pontuação anterior: ${session.quizResult?.score || 0}`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <Clock className="w-8 h-8 text-purple-400" /> Histórico de Aprendizado
      </h2>

      <div className="space-y-4">
        {sortedSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-12">Nenhuma sessão registrada ainda.</p>
        ) : (
            sortedSessions.map((session) => (
            <div key={session.id} className="bg-slate-800/30 border border-white/5 rounded-xl p-6 hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-500 bg-slate-900 px-2 py-1 rounded">
                    {new Date(session.startTime).toLocaleDateString()}
                    </span>
                    <h3 className="font-bold text-xl text-white">{session.topic}</h3>
                </div>
                
                <p className="text-gray-400 text-sm mb-2">
                    Duração: {Math.floor(session.durationSeconds / 60)} min {session.durationSeconds % 60} seg
                </p>

                {session.quizResult && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                    <CheckCircle className="w-3 h-3" />
                    Quiz: {session.quizResult.score}/{session.quizResult.totalQuestions}
                    </div>
                )}
                </div>

                <div className="flex items-center">
                <a
                    href={getCalendarUrl(session)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-all text-sm font-semibold"
                >
                    <CalendarDays className="w-4 h-4" />
                    Agendar Revisão
                </a>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
