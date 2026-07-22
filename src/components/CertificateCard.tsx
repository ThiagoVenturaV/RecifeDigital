import React from 'react';
import { Download, Share2, Calendar } from 'lucide-react';
import type { Certificate } from '../types';
import { generateCertificatePDF } from '../utils/pdfGenerator';

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
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Top Header info */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <SparkleIcon className="w-3.5 h-3.5 text-emerald-600" /> Mais Recente
          </span>
          <div className="flex items-center space-x-3">
            <img src="/recife_azul_sobre_branco.png" alt="Prefeitura do Recife" className="h-8 w-auto object-contain" />
            <img src="/logoSchool.svg" alt="CESAR School" className="h-6 w-auto object-contain" />
          </div>
        </div>

        {/* Certificate Title & Date */}
        <div className="mt-4">
          <h2 className="font-black text-2xl md:text-3xl text-[#00529C] font-['Outfit'] leading-snug">
            {certificate.courseTitle}
          </h2>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            Concluído em {certificate.issueDate}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Carga Horária
            </span>
            <span className="font-extrabold text-xl text-[#F95700] mt-1 block">
              {certificate.workloadHours} Horas
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Nota Final
            </span>
            <span className="font-extrabold text-xl text-emerald-600 mt-1 block">
              {certificate.grade.toFixed(1)} / 10
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Competências
            </span>
            <span className="font-bold text-sm text-[#F95700] mt-1 block line-clamp-1">
              {certificate.competencies.join(', ')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 sm:flex-initial py-3.5 px-8 bg-[#F95700] hover:bg-[#E04B00] text-white font-black text-base rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>BAIXAR PDF</span>
          </button>

          <button
            onClick={handleShareClick}
            className="flex-1 sm:flex-initial py-3.5 px-8 bg-white hover:bg-slate-50 text-[#00529C] border-2 border-[#00529C] font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            <span>COMPARTILHAR</span>
          </button>
        </div>
      </div>
    );
  }

  // Previous Certificate Card (Grid item)
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <img src="/prefeitura-recife.svg" alt="Prefeitura" className="h-6 w-auto opacity-75" />
          <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#00529C] font-bold text-[10px] uppercase tracking-wide">
            {certificate.competencies[0] || 'CONCLUÍDO'}
          </span>
        </div>

        <h3 className="font-bold text-base text-slate-900 mt-4 leading-snug">
          {certificate.courseTitle}
        </h3>
        <p className="text-slate-500 text-xs mt-1">
          {certificate.issueDate} • {certificate.workloadHours}h
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={handleDownloadPDF}
          className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>PDF</span>
        </button>

        <button
          onClick={handleShareClick}
          className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a1 1 0 011 1v1.323l1.954-1.129a1 1 0 111 1.732l-1.954 1.129 1.954 1.129a1 1 0 01-1 1.732L11 6.323V7.65a1 1 0 11-2 0V6.323L7.046 7.452a1 1 0 01-1-1.732l1.954-1.129-1.954-1.129a1 1 0 011-1.732L9 4.323V3a1 1 0 011-1z" />
  </svg>
);
