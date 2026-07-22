import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import type { Certificate } from '../types';

interface VerifyCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: Certificate[];
}

export const VerifyCertificateModal: React.FC<VerifyCertificateModalProps> = ({
  isOpen,
  onClose,
  certificates
}) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    cert?: Certificate;
  }>({ status: 'idle' });

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    const found = certificates.find(
      c => c.verificationCode.toUpperCase() === cleanCode
    );

    if (found) {
      setResult({ status: 'valid', cert: found });
    } else {
      setResult({ status: 'invalid' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-[#00529C] rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900 font-['Outfit']">
              Verificar Autenticidade
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Validação de certificado da CESAR School & Prefeitura do Recife
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Código de Verificação do Certificado
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: RDFE-2024-9842X"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 uppercase focus:outline-hidden focus:ring-2 focus:ring-[#F95700]"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1.5 bg-[#F95700] hover:bg-[#E04B00] text-white rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Verification Result Area */}
        {result.status === 'valid' && result.cert && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Certificado Válido & Autêntico</span>
            </div>
            <div className="text-xs text-slate-700 space-y-1 pl-7">
              <p>
                <strong>Aluno:</strong> {result.cert.studentName}
              </p>
              <p>
                <strong>Curso:</strong> {result.cert.courseTitle}
              </p>
              <p>
                <strong>Emissão:</strong> {result.cert.issueDate} ({result.cert.workloadHours}h)
              </p>
              <p className="text-[10px] text-emerald-700 font-mono mt-2">
                Registro Hash Blockchain: 0x9f8a...c32e (Assinado por CESAR School)
              </p>
            </div>
          </div>
        )}

        {result.status === 'invalid' && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 space-y-1">
              <p className="font-bold">Código não encontrado</p>
              <p>
                Verifique se os caracteres do código foram digitados corretamente ou entre em contato com o suporte do Recife Digital.
              </p>
            </div>
          </div>
        )}

        {/* Quick test hint */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Dica para teste: Utilize o código <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">RDFE-2024-9842X</code>
          </p>
        </div>
      </div>
    </div>
  );
};
