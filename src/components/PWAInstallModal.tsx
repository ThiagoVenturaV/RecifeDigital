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
    Cookies.set('pwa_modal_dismissed', 'true', { expires: 7 }); // Remember for 7 days
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <img src="/recife_azul_sobre_branco.png" alt="Recife Digital" className="h-10 w-auto" />
          <div>
            <span className="text-[10px] font-bold text-[#F95700] uppercase tracking-widest block">
              APLICATIVO OFICIAL
            </span>
            <h3 className="font-extrabold text-xl text-slate-900 font-['Outfit']">
              Instalar Recife Digital
            </h3>
          </div>
        </div>

        {/* Detected Device Tag */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#00529C] rounded-full text-xs font-bold">
          {device.isIOS && <Smartphone className="w-3.5 h-3.5" />}
          {device.isAndroid && <Smartphone className="w-3.5 h-3.5" />}
          {device.isDesktop && <Laptop className="w-3.5 h-3.5" />}
          <span>
            Dispositivo detectado: {device.isIOS ? 'iPhone / iPad (iOS)' : device.isAndroid ? 'Android' : 'Computador (Desktop)'} ({device.browserName})
          </span>
        </div>

        {/* Dynamic Tutorial Steps based on Device */}
        <div className="mt-6 space-y-4">
          <h4 className="font-bold text-sm text-slate-800">
            Tutorial de Instalação Rápida:
          </h4>

          {device.isIOS && (
            <ol className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-[#F95700] text-white font-bold flex items-center justify-center flex-shrink-0">1</span>
                <div>
                  <strong>Toque no botão Compartilhar:</strong> No rodapé do seu navegador Safari, toque no ícone com um quadrado e uma seta para cima (<Share className="w-3.5 h-3.5 inline text-[#00529C]" />).
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-[#F95700] text-white font-bold flex items-center justify-center flex-shrink-0">2</span>
                <div>
                  <strong>Selecione "Adicionar à Tela de Início":</strong> Role a lista de opções para baixo e toque em <PlusSquare className="w-3.5 h-3.5 inline text-emerald-600" /> "Adicionar à Tela de Início".
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-[#F95700] text-white font-bold flex items-center justify-center flex-shrink-0">3</span>
                <div>
                  <strong>Confirme:</strong> Toque em "Adicionar" no canto superior direito. O ícone do Recife Digital surgirá na tela inicial!
                </div>
              </li>
            </ol>
          )}

          {device.isAndroid && (
            <div className="space-y-3">
              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-6 bg-[#F95700] hover:bg-[#E04B00] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>INSTALAR APLICATIVO AGORA</span>
                </button>
              ) : (
                <ol className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-[#F95700] text-white font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <div>
                      <strong>Abra o menu do Chrome:</strong> Toque no ícone de três pontos (<MoreVertical className="w-3.5 h-3.5 inline text-slate-700" />) no canto superior direito.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-[#F95700] text-white font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <div>
                      <strong>Toque em "Instalar aplicativo":</strong> Selecione a opção "Instalar aplicativo" ou "Adicionar à tela inicial".
                    </div>
                  </li>
                </ol>
              )}
            </div>
          )}

          {device.isDesktop && (
            <div className="space-y-3">
              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-6 bg-[#F95700] hover:bg-[#E04B00] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  <span>INSTALAR APPLICATIVO NO COMPUTADOR</span>
                </button>
              ) : (
                <ol className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-[#F95700] text-white font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <div>
                      <strong>Barra de Endereços:</strong> Clique no ícone de instalação (<Download className="w-3.5 h-3.5 inline text-[#00529C]" />) localizado no lado direito da barra de endereço do seu navegador.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-[#F95700] text-white font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <div>
                      <strong>Clique em "Instalar":</strong> Confirme na janela pop-up para acessar o Recife Digital como um aplicativo nativo desktop.
                    </div>
                  </li>
                </ol>
              )}
            </div>
          )}
        </div>

        {installedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Aplicativo instalado com sucesso!</span>
          </div>
        )}

        {/* Actions Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleDismiss}
            className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Entendi, Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
