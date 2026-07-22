import React, { useState } from 'react';
import { Search, Bell, Eye, Smartphone } from 'lucide-react';
import type { AccessibilitySettings } from '../types';

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

  const notifications = [
    { id: '1', title: 'Novo Módulo Disponível!', desc: 'Informática Básica: Módulo 2 adicionado.', time: 'Há 10 min' },
    { id: '2', title: 'Parabéns!', desc: 'Seu certificado de Web Front-End está pronto.', time: 'Ontem' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Name Text & Partner Logos */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCurrentTab('catalog')} 
            className="flex items-center space-x-2 text-left focus:outline-hidden focus:ring-2 focus:ring-orange-500 rounded-md p-1"
          >
            <span className="font-black text-2xl tracking-tight text-[#00529C] font-['Outfit']">
              Recife <span className="text-[#F95700]">Digital</span>
            </span>
          </button>
          
          <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-slate-200">
            <img
              src="/recife_azul_sobre_branco.png"
              alt="Prefeitura do Recife"
              className="h-8 w-auto object-contain"
            />
            <img
              src="/logoSchool.svg"
              alt="CESAR School"
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => setCurrentTab('catalog')}
            className={`font-semibold text-base py-5 transition-colors border-b-2 ${
              currentTab === 'catalog'
                ? 'border-[#F95700] text-[#F95700]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Cursos
          </button>
          <button
            onClick={() => setCurrentTab('progress')}
            className={`font-semibold text-base py-5 transition-colors border-b-2 ${
              currentTab === 'progress'
                ? 'border-[#F95700] text-[#F95700]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Meu Progresso
          </button>
          <button
            onClick={() => setCurrentTab('certificates')}
            className={`font-semibold text-base py-5 transition-colors border-b-2 ${
              currentTab === 'certificates'
                ? 'border-[#F95700] text-[#F95700]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Certificados
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* PWA Install Button */}
          <button
            onClick={onOpenPWAInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-[#F95700] font-bold text-xs border border-orange-200 transition-colors"
            title="Instalar App Recife Digital (PWA)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Baixar App</span>
          </button>

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-orange-500"
            title="Buscar cursos"
            aria-label="Buscar cursos"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Accessibility Quick Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
              className={`p-2 rounded-full transition-colors focus:ring-2 focus:ring-orange-500 ${
                accessibility.highContrast || accessibility.fontScale > 1
                  ? 'bg-orange-100 text-[#F95700]'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Recursos de Acessibilidade"
              aria-label="Menu de Acessibilidade"
            >
              <Eye className="w-5 h-5" />
            </button>

            {showAccessibilityMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
                <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#F95700]" /> Acessibilidade
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Alto Contraste</span>
                    <button
                      onClick={() =>
                        setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }))
                      }
                      className={`w-10 h-6 rounded-full transition-colors relative ${
                        accessibility.highContrast ? 'bg-[#F95700]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          accessibility.highContrast ? 'translate-x-4' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-700 block">Tamanho da Fonte</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setAccessibility(prev => ({
                            ...prev,
                            fontScale: Math.max(1, prev.fontScale - 0.1)
                          }))
                        }
                        className="px-2 py-1 bg-slate-100 text-slate-800 rounded-md font-bold"
                      >
                        A-
                      </button>
                      <span className="text-xs font-mono text-slate-600 flex-1 text-center">
                        {Math.round(accessibility.fontScale * 100)}%
                      </span>
                      <button
                        onClick={() =>
                          setAccessibility(prev => ({
                            ...prev,
                            fontScale: Math.min(1.3, prev.fontScale + 0.1)
                          }))
                        }
                        className="px-2 py-1 bg-slate-100 text-slate-800 rounded-md font-bold"
                      >
                        A+
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 relative transition-colors focus:ring-2 focus:ring-orange-500"
              title="Notificações"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F95700] rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
                <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center justify-between">
                  <span>Notificações</span>
                  <span className="text-xs text-[#F95700] font-normal cursor-pointer">Marcar como lidas</span>
                </h4>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-orange-50/50 transition-colors">
                      <p className="font-semibold text-xs text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => setCurrentTab('progress')}
            className="flex items-center space-x-2 focus:ring-2 focus:ring-orange-500 rounded-full"
            title="Seu Perfil"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Thiago Ventura"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/20"
            />
          </button>
        </div>

      </div>
    </header>
  );
};
