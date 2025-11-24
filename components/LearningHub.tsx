import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Sparkles, ExternalLink, Volume2, ArrowRightCircle } from 'lucide-react';
import { Resource, StudySession } from '../types';
import { getLearningResources } from '../services/geminiService';

interface LearningHubProps {
  onSessionComplete: (session: StudySession) => void;
}

const LearningHub: React.FC<LearningHubProps> = ({ onSessionComplete }) => {
  const [topic, setTopic] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    if (!topic.trim()) return;
    setIsRunning(true);
    if (!startTime) setStartTime(new Date().toISOString());

    // Fetch resources if starting new session
    if (resources.length === 0 && !loadingResources) {
      setLoadingResources(true);
      try {
        const data = await getLearningResources(topic);
        setResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingResources(false);
      }
    }
  };

  const handlePause = () => setIsRunning(false);

  const handleStop = () => {
    setIsRunning(false);
    if (timerRef.current) window.clearInterval(timerRef.current);

    if (seconds > 10) { // Only save if session > 10s
        const session: StudySession = {
            id: crypto.randomUUID(),
            topic,
            durationSeconds: seconds,
            startTime: startTime || new Date().toISOString(),
            endTime: new Date().toISOString(),
            resources,
        };
        onSessionComplete(session);
    } else {
        alert("Sessão muito curta para ser registrada (mínimo 10s).");
    }
    
    // Reset handled by parent view switch ideally, but we reset here too
    setSeconds(0);
    setTopic('');
    setResources([]);
    setStartTime(null);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Input & Timer Section */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full md:w-1/2 space-y-4">
          <label className="text-gray-400 text-sm uppercase tracking-wider font-semibold">O que vamos estudar?</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={seconds > 0}
            placeholder="Ex: Revolução Francesa, React Hooks..."
            className="w-full bg-transparent text-3xl md:text-4xl font-bold text-white placeholder-gray-600 outline-none border-b-2 border-gray-700 focus:border-purple-500 transition-colors py-2"
          />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`text-6xl font-mono font-bold tracking-wider ${isRunning ? 'text-green-400' : 'text-gray-400'}`}>
            {formatTime(seconds)}
          </div>
          
          <div className="flex gap-4">
            {!isRunning ? (
              <button
                onClick={handleStart}
                disabled={!topic}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="fill-current w-5 h-5" /> Iniciar
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-bold transition-transform hover:scale-105"
              >
                <Pause className="fill-current w-5 h-5" /> Pausar
              </button>
            )}
            
            {seconds > 0 && (
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition-transform hover:scale-105"
              >
                <Square className="fill-current w-4 h-4" /> Finalizar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Resources Section */}
      {(loadingResources || resources.length > 0) && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="text-yellow-400 w-5 h-5" /> Recursos Sugeridos pela IA
          </h3>

          {loadingResources ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {resources.map((res, idx) => (
                <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-white/5 hover:border-purple-500/50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-purple-300 line-clamp-2">{res.title}</h4>
                    <button 
                        onClick={() => handleSpeak(res.title + ". " + res.summary)}
                        className="text-gray-500 hover:text-white"
                    >
                        <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-3">{res.summary}</p>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs font-bold text-pink-500 hover:text-pink-400"
                  >
                    Acessar Material <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningHub;
