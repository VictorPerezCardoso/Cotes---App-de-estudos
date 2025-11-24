import React, { useState, useEffect } from 'react';
import { StudySession, QuizQuestion, QuizResult } from '../types';
import { generateQuiz } from '../services/geminiService';
import { CheckCircle, XCircle, Volume2, Award, ArrowRight } from 'lucide-react';
import Confetti from './Confetti';

interface QuizProps {
  session: StudySession;
  onFinish: (result: QuizResult) => void;
}

const Quiz: React.FC<QuizProps> = ({ session, onFinish }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const qs = await generateQuiz(session.topic);
      setQuestions(qs);
      setLoading(false);
    };
    fetchQuestions();
  }, [session.topic]);

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    
    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // Finish
      if (score > questions.length / 2) {
        setShowConfetti(true);
      }
      setTimeout(() => {
          const result: QuizResult = {
            topic: session.topic,
            score,
            totalQuestions: questions.length,
            date: new Date().toISOString()
          };
          onFinish(result);
      }, 3000); // Wait for confetti or just a moment before closing
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        <p className="text-xl text-gray-300 animate-pulse">Gerando desafio sobre {session.topic}...</p>
      </div>
    );
  }

  if (questions.length === 0) {
      return (
          <div className="text-center p-8">
              <p>Não foi possível gerar perguntas. Tente estudar outro tópico.</p>
              <button onClick={() => onFinish({ topic: session.topic, score: 0, totalQuestions: 0, date: new Date().toISOString() })} className="mt-4 text-purple-400">Voltar</button>
          </div>
      )
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-8 relative">
      {showConfetti && <Confetti />}
      
      <div className="mb-6 flex justify-between items-center text-gray-400">
        <span>Questão {currentIndex + 1} de {questions.length}</span>
        <span className="text-purple-400 font-bold">Pontos: {score}</span>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="flex justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">{currentQ.question}</h2>
            <button 
                onClick={() => handleSpeak(currentQ.question)}
                className="text-gray-500 hover:text-white h-fit"
            >
                <Volume2 className="w-6 h-6" />
            </button>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let buttonStyle = "border-gray-700 hover:bg-white/5";
            
            if (showFeedback) {
              if (idx === currentQ.correctAnswerIndex) {
                buttonStyle = "bg-green-500/20 border-green-500 text-green-200";
              } else if (idx === selectedOption) {
                buttonStyle = "bg-red-500/20 border-red-500 text-red-200";
              } else {
                buttonStyle = "opacity-50 border-transparent";
              }
            } else if (selectedOption === idx) {
               buttonStyle = "border-purple-500 bg-purple-500/20";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${buttonStyle}`}
              >
                <span>{option}</span>
                {showFeedback && idx === currentQ.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-green-500" />}
                {showFeedback && idx === selectedOption && idx !== currentQ.correctAnswerIndex && <XCircle className="w-5 h-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-8 flex justify-end animate-fade-in">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-white text-slate-900 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {currentIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
