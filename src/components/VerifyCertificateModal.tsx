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
    <div className="modal-overlay">
      <div className="modal-content">
        
        {/* Close Button */}
        <button onClick={onClose} className="close-btn">
          <X style={{ width: 20, height: 20 }} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: 10, background: '#EFF6FF', borderRadius: 12, color: '#00529C' }}>
            <ShieldCheck style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.25rem' }}>
              Verificar Autenticidade
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.75rem' }}>
              Validação de certificado da CESAR School & Prefeitura do Recife
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleVerify} style={{ marginTop: 20 }}>
          <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
            Código de Verificação do Certificado
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Ex: RDFE-2024-9842X"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="search-input"
              style={{ paddingLeft: 12, fontFamily: 'monospace', fontSize: '0.85rem' }}
              required
            />
            <button
              type="submit"
              className="btn-card-action"
              style={{ marginTop: 0, width: 'auto', padding: '8px 16px' }}
            >
              <Search style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </form>

        {/* Verification Result Area */}
        {result.status === 'valid' && result.cert && (
          <div style={{ marginTop: 20, padding: 16, borderRadius: 16, background: '#D1FAE5', border: '1px solid #A7F3D0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#065F46', fontWeight: 800, fontSize: '0.85rem' }}>
              <CheckCircle2 style={{ width: 18, height: 18 }} />
              <span>Certificado Válido & Autêntico</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#1e293b', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p><strong>Aluno:</strong> {result.cert.studentName}</p>
              <p><strong>Curso:</strong> {result.cert.courseTitle}</p>
              <p><strong>Emissão:</strong> {result.cert.issueDate} ({result.cert.workloadHours}h)</p>
            </div>
          </div>
        )}

        {result.status === 'invalid' && (
          <div style={{ marginTop: 20, padding: 16, borderRadius: 16, background: '#FFE4E6', border: '1px solid #FECDD3', color: '#9F1239', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800 }}>
              <AlertCircle style={{ width: 18, height: 18 }} />
              <span>Código não encontrado</span>
            </div>
            <p style={{ marginTop: 4 }}>Verifique se os caracteres foram digitados corretamente.</p>
          </div>
        )}

        {/* Quick test hint */}
        <div style={{ marginTop: 20, paddingTop: 12, borderTop: '1px solid #F1F5F9', textAlign: 'center', fontSize: '0.7rem', color: '#94A3B8' }}>
          Dica para teste: Utilize o código <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>RDFE-2024-9842X</code>
        </div>
      </div>
    </div>
  );
};
