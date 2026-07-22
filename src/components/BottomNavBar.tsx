import React from 'react';
import { BookOpen, TrendingUp, Award, User } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: 'catalog' | 'player' | 'certificates' | 'progress';
  setCurrentTab: (tab: 'catalog' | 'player' | 'certificates' | 'progress') => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Cursos */}
        <button
          onClick={() => setCurrentTab('catalog')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
            currentTab === 'catalog'
              ? 'text-[#F95700] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Cursos</span>
        </button>

        {/* Meu Progresso */}
        <button
          onClick={() => setCurrentTab('progress')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
            currentTab === 'progress'
              ? 'text-[#F95700] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Meu Progresso</span>
        </button>

        {/* Certificados */}
        <button
          onClick={() => setCurrentTab('certificates')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
            currentTab === 'certificates'
              ? 'text-[#F95700] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Certificados</span>
        </button>

        {/* Perfil */}
        <button
          onClick={() => setCurrentTab('progress')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
            currentTab === 'progress'
              ? 'text-[#F95700] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[11px]">Perfil</span>
        </button>
      </div>
    </div>
  );
};
