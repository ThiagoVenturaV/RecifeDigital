import React from 'react';
import { BookOpen, TrendingUp, Award, User } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: 'catalog' | 'player' | 'certificates' | 'progress';
  setCurrentTab: (tab: 'catalog' | 'player' | 'certificates' | 'progress') => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, setCurrentTab }) => {
  return (
    <nav className="bottom-nav">
      {/* Cursos */}
      <button
        onClick={() => setCurrentTab('catalog')}
        className={`bottom-nav-item ${currentTab === 'catalog' ? 'active' : ''}`}
      >
        <BookOpen style={{ width: 20, height: 20, marginBottom: 2 }} />
        <span>Cursos</span>
      </button>

      {/* Meu Progresso */}
      <button
        onClick={() => setCurrentTab('progress')}
        className={`bottom-nav-item ${currentTab === 'progress' ? 'active' : ''}`}
      >
        <TrendingUp style={{ width: 20, height: 20, marginBottom: 2 }} />
        <span>Progresso</span>
      </button>

      {/* Certificados */}
      <button
        onClick={() => setCurrentTab('certificates')}
        className={`bottom-nav-item ${currentTab === 'certificates' ? 'active' : ''}`}
      >
        <Award style={{ width: 20, height: 20, marginBottom: 2 }} />
        <span>Certificados</span>
      </button>

      {/* Perfil */}
      <button
        onClick={() => setCurrentTab('progress')}
        className={`bottom-nav-item ${currentTab === 'progress' ? 'active' : ''}`}
      >
        <User style={{ width: 20, height: 20, marginBottom: 2 }} />
        <span>Perfil</span>
      </button>
    </nav>
  );
};
