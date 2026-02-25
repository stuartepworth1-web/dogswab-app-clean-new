import React, { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'logo' | 'tagline' | 'fadeout'>('logo');

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setPhase('tagline');
    }, 1200);

    const taglineTimer = setTimeout(() => {
      setPhase('fadeout');
    }, 2400);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        phase === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #2d2f63 0%, #1a1b3d 50%, #2d2f63 100%)',
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <Sparkles
              className="text-dogswab-mint opacity-20"
              size={12 + Math.random() * 12}
            />
          </div>
        ))}
      </div>

      {/* Main logo content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo animation */}
        <div
          className={`transition-all duration-1000 ease-out ${
            phase === 'logo' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {/* Paw icon with heartbeat animation */}
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping-slow">
              <div className="w-24 h-24 rounded-full bg-dogswab-mint opacity-20"></div>
            </div>
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-dogswab-mint shadow-2xl animate-bounce-gentle">
              <Heart className="w-12 h-12 text-white fill-current animate-pulse-slow" />
            </div>
          </div>

          {/* App name */}
          <div className="text-center mb-4">
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight animate-slide-up">
              DOGSWAB
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-dogswab-mint animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-dogswab-mint animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-dogswab-mint animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        {/* Tagline animation */}
        <div
          className={`transition-all duration-700 ease-out ${
            phase === 'tagline' || phase === 'fadeout'
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
          }`}
        >
          <p className="text-xl text-dogswab-mint font-medium text-center px-8">
            Your Pet's Health Assistant
          </p>
          <p className="text-sm text-white/60 text-center mt-2 px-8">
            AI-Powered Pet Care Education
          </p>
        </div>

        {/* Loading indicator */}
        <div
          className={`mt-12 transition-all duration-500 ${
            phase === 'fadeout' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-dogswab-mint animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 rounded-full bg-dogswab-mint animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 rounded-full bg-dogswab-mint animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 5s infinite ease-in-out;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 3s infinite ease-in-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s infinite ease-in-out;
        }

        .animate-ping-slow {
          animation: ping-slow 3s infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
