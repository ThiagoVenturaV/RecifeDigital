import React from 'react';
import { Download, Share2, Calendar } from 'lucide-react';
import type { Certificate } from '../types';
import { generateCertificatePDF } from '../utils/pdfGenerator';
import '../styles/CertificateCard.css';

interface CertificateCardProps {
  certificate: Certificate;
  isFeatured?: boolean;
  onShare?: (cert: Certificate) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  isFeatured = false,
  onShare
}) => {
  const handleDownloadPDF = () => {
    generateCertificatePDF(certificate);
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare(certificate);
    } else {
      navigator.clipboard.writeText(
        `Confira meu certificado de ${certificate.courseTitle} no Recife Digital! Código: ${certificate.verificationCode}`
      );
      alert('Link de compartilhamento e código copiados para a área de transferência!');
    }
  };

  if (isFeatured) {
    return (
      <div className="cert-featured-card">
        {/* Top Header info */}
        <div className="cert-header-row">
          <span className="cert-tag-recent">
            ★ Mais Recente
          </span>
          <div className="partner-logos">
            <img src="/recife_azul_sobre_branco.png" alt="Prefeitura do Recife" className="partner-logo-img" />
            <img src="/logoSchool.svg" alt="CESAR School" className="partner-logo-img" />
          </div>
        </div>

        {/* Certificate Title & Date */}
        <div>
          <h2 className="cert-blue-title">
            {certificate.courseTitle}
          </h2>
          <p className="cert-date-text">
            <Calendar style={{ width: 16, height: 16 }} />
            Concluído em {certificate.issueDate}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="cert-stats-row">
          <div className="stat-box">
            <span className="stat-label">Carga Horária</span>
            <span className="stat-val-orange">
              {certificate.workloadHours} Horas
            </span>
          </div>

          <div className="stat-box">
            <span className="stat-label">Nota Final</span>
            <span className="stat-val-green">
              {certificate.grade.toFixed(1)} / 10
            </span>
          </div>

          <div className="stat-box">
            <span className="stat-label">Competências</span>
            <span className="stat-val-comp">
              {certificate.competencies.join(', ')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="cert-btn-group">
          <button
            onClick={handleDownloadPDF}
            className="btn-download-pdf"
          >
            <Download style={{ width: 18, height: 18 }} />
            <span>BAIXAR PDF</span>
          </button>

          <button
            onClick={handleShareClick}
            className="btn-share"
          >
            <Share2 style={{ width: 18, height: 18 }} />
            <span>COMPARTILHAR</span>
          </button>
        </div>
      </div>
    );
  }

  // Previous Certificate Card
  return (
    <div className="course-card">
      <div className="card-body">
        <div>
          <div className="cert-header-row">
            <img src="/recife_azul_sobre_branco.png" alt="Prefeitura" className="partner-logo-img" style={{ height: 24 }} />
            <span className="card-category-badge" style={{ position: 'static' }}>
              {certificate.competencies[0] || 'CONCLUÍDO'}
            </span>
          </div>

          <h3 className="card-title" style={{ marginTop: 12 }}>
            {certificate.courseTitle}
          </h3>
          <p className="cert-date-text">
            {certificate.issueDate} • {certificate.workloadHours}h
          </p>
        </div>

        <div className="cert-mini-btn-group">
          <button
            onClick={handleDownloadPDF}
            className="mini-btn"
          >
            <Download style={{ width: 14, height: 14 }} />
            <span>PDF</span>
          </button>

          <button
            onClick={handleShareClick}
            className="mini-btn"
          >
            <Share2 style={{ width: 14, height: 14 }} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
