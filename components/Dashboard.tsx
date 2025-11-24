import React from 'react';
import { StudySession } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  sessions: StudySession[];
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ sessions }) => {
  // Process Data for Pie Chart (Time per Topic)
  const topicMap: Record<string, number> = {};
  sessions.forEach(s => {
    topicMap[s.topic] = (topicMap[s.topic] || 0) + s.durationSeconds;
  });
  
  const pieData = Object.keys(topicMap).map(key => ({
    name: key,
    value: Math.round(topicMap[key] / 60) // in minutes
  })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

  // Process Data for Bar Chart (Sessions per day)
  const dateMap: Record<string, number> = {};
  sessions.slice(-30).forEach(s => { // Last 30 entries approximation
    const date = new Date(s.startTime).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    dateMap[date] = (dateMap[date] || 0) + (s.durationSeconds / 60);
  });

  const barData = Object.keys(dateMap).map(key => ({
    date: key,
    minutes: Math.round(dateMap[key])
  }));

  const totalTimeMinutes = Math.floor(sessions.reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60);
  const totalQuizzes = sessions.filter(s => s.quizResult).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-white mb-8">Seu Progresso</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-900/50 to-slate-900 border border-purple-500/30 p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm">Tempo Total Estudado</h3>
          <p className="text-4xl font-bold text-white mt-2">{totalTimeMinutes} <span className="text-lg text-gray-500">min</span></p>
        </div>
        <div className="bg-gradient-to-br from-pink-900/50 to-slate-900 border border-pink-500/30 p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm">Sessões Realizadas</h3>
          <p className="text-4xl font-bold text-white mt-2">{sessions.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/50 to-slate-900 border border-blue-500/30 p-6 rounded-2xl">
          <h3 className="text-gray-400 text-sm">Quizzes Completados</h3>
          <p className="text-4xl font-bold text-white mt-2">{totalQuizzes}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Topic Distribution */}
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Distribuição por Tópico (min)</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name}) => name}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center mt-20">Sem dados suficientes.</p>
          )}
        </div>

        {/* Daily Performance */}
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-white/5 min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Desempenho Recente (min/dia)</h3>
           {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                />
                <Bar dataKey="minutes" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
           ) : (
             <p className="text-gray-500 text-center mt-20">Estude hoje para ver o gráfico!</p>
           )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
