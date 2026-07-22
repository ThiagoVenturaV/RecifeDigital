import React, { useState } from 'react';
import { Search, Eye, Volume2, VolumeX, Smartphone } from 'lucide-react';
import type { AccessibilitySettings } from '../types';
import { tts } from '../utils/ttsEngine';
import '../styles/Header.css';

interface HeaderProps {
  currentTab: 'catalog' | 'player' | 'certificates' | 'progress';
  setCurrentTab: (tab: 'catalog' | 'player' | 'certificates' | 'progress') => void;
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  onOpenSearch: () => void;
  onOpenPWAInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  accessibility,
  setAccessibility,
  onOpenSearch,
  onOpenPWAInstall
}) => {
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  const toggleTTS = () => {
    const nextState = !accessibility.audioDescription;
    setAccessibility(prev => ({ ...prev, audioDescription: nextState }));
    tts.setEnabled(nextState);
  };

  return (
    <header className="header">
      <div className="max-w-7xl header-inner">
        
        {/* Left: Brand Name Text & Partner Logos */}
        <div className="header-brand-box">
          <button 
            onClick={() => setCurrentTab('catalog')} 
            className="header-brand-btn"
          >
            <span className="brand-text">
              Recife <span>Digital</span>
            </span>
          </button>
          
          <div className="partner-logos">
            <img
              src="/recife_azul_sobre_branco.png"
              alt="Prefeitura do Recife"
              className="partner-logo-img"
            />
            <img
              src="/logoSchool.svg"
              alt="CESAR School"
              className="partner-logo-img"
            />
          </div>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="nav-desktop">
          <button
            onClick={() => setCurrentTab('catalog')}
            className={`nav-link-btn ${currentTab === 'catalog' ? 'active' : ''}`}
          >
            Cursos
          </button>
          <button
            onClick={() => setCurrentTab('progress')}
            className={`nav-link-btn ${currentTab === 'progress' ? 'active' : ''}`}
          >
            Meu Progresso
          </button>
          <button
            onClick={() => setCurrentTab('certificates')}
            className={`nav-link-btn ${currentTab === 'certificates' ? 'active' : ''}`}
          >
            Certificados
          </button>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          
          {/* Native TTS (Audio Reader) Toggle Button */}
          <button
            onClick={toggleTTS}
            className={`badge-btn ${accessibility.audioDescription ? 'tts-active' : ''}`}
            title={accessibility.audioDescription ? 'Desativar Leitor de Tela Nativo (TTS)' : 'Ativar Leitor de Tela Nativo (TTS / Voz)'}
          >
            {accessibility.audioDescription ? (
              <>
                <Volume2 className="icon-sm" />
                <span>Voz Ativa</span>
              </>
            ) : (
              <>
                <VolumeX className="icon-sm" />
                <span>Ouvir Site</span>
              </>
            )}
          </button>

          {/* PWA Install Button */}
          <button
            onClick={onOpenPWAInstall}
            className="badge-btn"
            title="Instalar App Recife Digital (PWA)"
          >
            <Smartphone className="icon-sm" />
            <span>Baixar App</span>
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="icon-btn"
            title="Buscar cursos"
          >
            <Search className="icon-md" />
          </button>

          {/* Accessibility Quick Menu Toggle */}
          <div className="relative-container">
            <button
              onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
              className={`icon-btn ${accessibility.highContrast ? 'contrast-active' : ''}`}
              title="Recursos de Acessibilidade"
            >
              <Eye className="icon-md" />
            </button>

            {showAccessibilityMenu && (
              <div className="accessibility-dropdown">
                <h4 className="dropdown-title">
                  Acessibilidade
                </h4>
                
                <div className="dropdown-options">
                  <div className="option-row">
                    <span>Alto Contraste</span>
                    <button
                      onClick={() => setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }))}
                      className={`toggle-btn ${accessibility.highContrast ? 'on' : 'off'}`}
                    >
                      {accessibility.highContrast ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div className="option-row">
                    <span>Tamanho Fonte</span>
                    <div className="scale-btn-group">
                      <button
                        onClick={() => setAccessibility(prev => ({ ...prev, fontScale: Math.max(1, prev.fontScale - 0.1) }))}
                        className="scale-btn"
                      >
                        A-
                      </button>
                      <span className="scale-value">{Math.round(accessibility.fontScale * 100)}%</span>
                      <button
                        onClick={() => setAccessibility(prev => ({ ...prev, fontScale: Math.min(1.3, prev.fontScale + 0.1) }))}
                        className="scale-btn"
                      >
                        A+
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => setCurrentTab('progress')}
            className="avatar-btn"
            title="Seu Perfil"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Thiago Ventura"
              className="avatar-img"
            />
          </button>

        </div>

      </div>
    </header>
  );
};
