import React, { useState } from 'react';
import { Search, Eye, Volume2, VolumeX, Smartphone, Bell, CheckCheck } from 'lucide-react';
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
  onOpenAuth: () => void;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  accessibility,
  setAccessibility,
  onOpenSearch,
  onOpenPWAInstall,
  onOpenAuth,
  userName = 'Thiago Ventura'
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    { id: '1', title: 'Novo Módulo Disponível!', desc: 'Informática Básica: Módulo 2 adicionado.', time: 'Há 10 min' },
    { id: '2', title: 'Parabéns!', desc: 'Seu certificado de Web Front-End está pronto.', time: 'Ontem' }
  ];

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

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
            <a
              href="https://www me.recife.pe.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              title="Portal da Prefeitura do Recife"
            >
              <img
                src="/recife_azul_sobre_branco.png"
                alt="Prefeitura do Recife"
                className="partner-logo-img"
              />
            </a>
            <a
              href="https://www.cesar.school"
              target="_blank"
              rel="noopener noreferrer"
              title="CESAR School"
            >
              <img
                src="/logoSchool.svg"
                alt="CESAR School"
                className="partner-logo-img"
              />
            </a>
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
                <Volume2 style={{ width: 16, height: 16, color: '#059669' }} />
                <span>Voz Ativa</span>
              </>
            ) : (
              <>
                <VolumeX style={{ width: 16, height: 16, color: '#64748B' }} />
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
            <Smartphone style={{ width: 16, height: 16 }} />
            <span>Baixar App</span>
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="icon-btn"
            title="Buscar cursos"
          >
            <Search style={{ width: 20, height: 20 }} />
          </button>

          {/* Notifications Toggle */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="icon-btn"
              title="Notificações"
              style={{ position: 'relative' }}
            >
              <Bell style={{ width: 20, height: 20 }} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#F95700'
                  }}
                />
              )}
            </button>

            {showNotifications && (
              <div className="accessibility-dropdown" style={{ width: 280 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h4 className="dropdown-title" style={{ margin: 0 }}>Notificações</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      style={{ background: 'none', border: 'none', color: '#00529C', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <CheckCheck style={{ width: 14, height: 14 }} />
                      <span>Limpar</span>
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: 8, borderRadius: 8, background: '#F8FAFC', fontSize: '0.75rem' }}>
                      <strong style={{ display: 'block', color: '#0f172a' }}>{n.title}</strong>
                      <span style={{ color: '#64748B' }}>{n.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Accessibility Quick Menu Toggle */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
              className="icon-btn"
              style={{
                backgroundColor: accessibility.highContrast ? '#FFEDD5' : 'transparent',
                color: accessibility.highContrast ? '#F95700' : '#64748B'
              }}
              title="Recursos de Acessibilidade"
            >
              <Eye style={{ width: 20, height: 20 }} />
            </button>

            {showAccessibilityMenu && (
              <div className="accessibility-dropdown">
                <h4 className="dropdown-title">
                  Acessibilidade
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Alto Contraste</span>
                    <button
                      onClick={() => setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }))}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 9999,
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        backgroundColor: accessibility.highContrast ? '#F95700' : '#E2E8F0',
                        color: accessibility.highContrast ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {accessibility.highContrast ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Tamanho Fonte</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <button
                        onClick={() => setAccessibility(prev => ({ ...prev, fontScale: Math.max(1, prev.fontScale - 0.1) }))}
                        style={{ padding: '2px 8px', borderRadius: 4, background: '#F1F5F9', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                      >
                        A-
                      </button>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{Math.round(accessibility.fontScale * 100)}%</span>
                      <button
                        onClick={() => setAccessibility(prev => ({ ...prev, fontScale: Math.min(1.3, prev.fontScale + 0.1) }))}
                        style={{ padding: '2px 8px', borderRadius: 4, background: '#F1F5F9', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                      >
                        A+
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Login */}
          <button
            onClick={onOpenAuth}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            title={`Perfil de ${userName}`}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt={userName}
              className="avatar-img"
            />
          </button>

        </div>

      </div>
    </header>
  );
};
