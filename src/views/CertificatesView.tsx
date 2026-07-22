import React, { useState } from 'react';
import { CertificateCard } from '../components/CertificateCard';
import { VerifyCertificateModal } from '../components/VerifyCertificateModal';
import type { Certificate } from '../types';
import { ShieldCheck, GraduationCap } from 'lucide-react';
import '../styles/CertificatesView.css';

interface CertificatesViewProps {
  certificates: Certificate[];
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ certificates }) => {
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const featuredCert = certificates[0];
  const pastCerts = certificates.slice(1);

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      {/* Header Section */}
      <div className="cert-page-header">
        <div>
          <h1 className="cert-page-title">
            Meus Certificados
          </h1>
          <p className="cert-page-subtitle">
            Celebre suas conquistas. Aqui estão os certificados dos cursos que você concluiu com sucesso na plataforma Recife Digital em parceria com a CESAR School.
          </p>
        </div>
      </div>

      {/* Main Grid: Featured Certificate & Authenticity Sidebar */}
      <div className="cert-hero-grid">
        <div>
          {featuredCert ? (
            <CertificateCard certificate={featuredCert} isFeatured={true} />
          ) : (
            <div className="card-details-box" style={{ textAlign: 'center', color: '#64748B' }}>
              Nenhum certificado emitido ainda. Conclua os módulos para emitir o seu!
            </div>
          )}
        </div>

        {/* Authenticity & Total Count Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Authenticity Box */}
          <div className="card-details-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <ShieldCheck style={{ width: 28, height: 28, color: '#00529C' }} />
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>
                Autenticidade
              </h3>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginBottom: 16 }}>
              Todos os certificados são emitidos com assinatura digital da CESAR School e validação de código via Blockchain.
            </p>

            <button
              onClick={() => setIsVerifyModalOpen(true)}
              className="btn-share"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <ShieldCheck style={{ width: 16, height: 16 }} />
              <span>Verificar Código</span>
            </button>
          </div>

          {/* Total Certificates Stat Box */}
          <div className="cert-stat-banner">
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>
                Total de Certificados
              </span>
              <span className="cert-stat-num">
                {certificates.length}
              </span>
            </div>
            <div className="cert-icon-wrapper">
              <GraduationCap style={{ width: 32, height: 32 }} />
            </div>
          </div>

        </div>
      </div>

      {/* Conquistas Anteriores */}
      {pastCerts.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', marginBottom: 16 }}>
            Conquistas Anteriores
          </h2>

          <div className="courses-grid">
            {pastCerts.map(cert => (
              <CertificateCard key={cert.id} certificate={cert} isFeatured={false} />
            ))}
          </div>
        </div>
      )}

      {/* Verify Authenticity Modal */}
      <VerifyCertificateModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        certificates={certificates}
      />

    </div>
  );
};
