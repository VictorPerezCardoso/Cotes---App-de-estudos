import React, { useEffect, useState } from 'react';

const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    // Generate 50 particles
    setParticles(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((i) => {
        const left = Math.random() * 100;
        const animationDuration = 2 + Math.random() * 3;
        const bg = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)];
        
        return (
          <div
            key={i}
            className="absolute top-0 w-3 h-3 rounded-full opacity-80"
            style={{
              left: `${left}%`,
              backgroundColor: bg,
              animation: `fall ${animationDuration}s linear infinite`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
