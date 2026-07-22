import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Laptop, Share, PlusSquare, MoreVertical, CheckCircle2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { getDeviceInfo } from '../utils/deviceDetector';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const [device, setDevice] = useState(getDeviceInfo());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    setDevice(getDeviceInfo());

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isOpen || device.isStandalone) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalledSuccess(true);
        Cookies.set('pwa_installed', 'true', { expires: 365 });
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    Cookies.set('pwa_modal_dismissed', 'true', { expires: 7 });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        {/* Close button */}
        <button onClick={handleDismiss} className="close-btn">
          <X style={{ width: 20, height: 20 }} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/recife_azul_sobre_branco.png" alt="Recife Digital" style={{ height: 36, width: 'auto' }} />
          <div>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#F95700', textTransform: 'uppercase', display: 'block' }}>
              APLICATIVO OFICIAL
            </span>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>
              Instalar Recife Digital
            </h3>
          </div>
        </div>

        {/* Detected Device Tag */}
        <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 9999, background: '#EFF6FF', color: '#00529C', fontSize: '0.75rem', fontWeight: 700 }}>
          {device.isIOS && <Smartphone style={{ width: 14, height: 14 }} />}
          {device.isAndroid && <Smartphone style={{ width: 14, height: 14 }} />}
          {device.isDesktop && <Laptop style={{ width: 14, height: 14 }} />}
          <span>
            {device.isIOS ? 'iPhone / iPad (iOS)' : device.isAndroid ? 'Android' : 'Computador (Desktop)'} ({device.browserName})
          </span>
        </div>

        {/* Dynamic Tutorial Steps */}
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: 12 }}>
            Tutorial de Instalação Rápida:
          </h4>

          {device.isIOS && (
            <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.75rem', color: '#334155' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 10, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#F95700', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
                <div><strong>Toque no botão Compartilhar:</strong> No rodapé do Safari (<Share style={{ width: 14, height: 14, display: 'inline', color: '#00529C' }} />).</div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 10, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#F95700', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
                <div><strong>Selecione "Adicionar à Tela de Início":</strong> Toque em <PlusSquare style={{ width: 14, height: 14, display: 'inline', color: '#10B981' }} /> "Adicionar à Tela de Início".</div>
              </li>
            </ol>
          )}

          {device.isAndroid && (
            <div>
              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="btn-card-action"
                  style={{ padding: '12px 20px', fontSize: '0.85rem' }}
                >
                  <Download style={{ width: 18, height: 18 }} />
                  <span>INSTALAR APLICATIVO AGORA</span>
                </button>
              ) : (
                <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.75rem', color: '#334155' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 10, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#F95700', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
                    <div><strong>Abra o menu do Chrome:</strong> Toque no ícone (<MoreVertical style={{ width: 14, height: 14, display: 'inline' }} />).</div>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 10, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#F95700', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
                    <div><strong>Toque em "Instalar aplicativo":</strong> Selecione "Instalar aplicativo".</div>
                  </li>
                </ol>
              )}
            </div>
          )}

          {device.isDesktop && (
            <div>
              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="btn-card-action"
                  style={{ padding: '12px 20px', fontSize: '0.85rem' }}
                >
                  <Download style={{ width: 18, height: 18 }} />
                  <span>INSTALAR APLICATIVO NO COMPUTADOR</span>
                </button>
              ) : (
                <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.75rem', color: '#334155' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 10, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#F95700', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
                    <div><strong>Barra de Endereços:</strong> Clique no ícone de instalação (<Download style={{ width: 14, height: 14, display: 'inline', color: '#00529C' }} />) no navegador.</div>
                  </li>
                </ol>
              )}
            </div>
          )}
        </div>

        {installedSuccess && (
          <div style={{ marginTop: 16, padding: 10, background: '#D1FAE5', color: '#065F46', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 style={{ width: 16, height: 16 }} />
            <span>Aplicativo instalado com sucesso!</span>
          </div>
        )}

        {/* Actions Footer */}
        <div style={{ marginTop: 20, paddingTop: 12, borderTop: '1px solid #F1F5F9', textAlign: 'right' }}>
          <button
            onClick={handleDismiss}
            style={{ padding: '8px 16px', background: '#F1F5F9', color: '#334155', fontWeight: 700, fontSize: '0.75rem', borderRadius: 10, border: 'none', cursor: 'pointer' }}
          >
            Entendi, Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
