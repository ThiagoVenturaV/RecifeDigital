import React, { useState } from 'react';
import { CertificateCard } from '../components/CertificateCard';
import { VerifyCertificateModal } from '../components/VerifyCertificateModal';
import type { Certificate } from '../types';
import { ShieldCheck, Filter, GraduationCap } from 'lucide-react';

interface CertificatesViewProps {
  certificates: Certificate[];
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ certificates }) => {
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const featuredCert = certificates[0];
  const pastCerts = certificates.slice(1);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-black text-3xl md:text-4xl text-slate-900 font-['Outfit'] tracking-tight">
            Meus Certificados
          </h1>
          <p className="text-slate-600 text-sm mt-1.5 max-w-2xl leading-relaxed">
            Celebre suas conquistas. Aqui estão os certificados dos cursos que você concluiu com sucesso na plataforma Recife Digital em parceria com a CESAR School.
          </p>
        </div>

        <button className="py-2.5 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center gap-2 shadow-2xs">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Filtrar</span>
        </button>
      </div>

      {/* Main Grid: Featured Certificate & Authenticity Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Featured Certificate (Left 8 cols) */}
        <div className="lg:col-span-8">
          {featuredCert ? (
            <CertificateCard certificate={featuredCert} isFeatured={true} />
          ) : (
            <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 text-slate-500">
              Nenhum certificado emitido ainda. Conclua os módulos para emitir o seu!
            </div>
          )}
        </div>

        {/* Authenticity & Total Count Sidebar (Right 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Authenticity Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-[#00529C] rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit']">
                Autenticidade
              </h3>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              Todos os certificados são emitidos com assinatura digital da CESAR School e validação de código via Blockchain.
            </p>

            <button
              onClick={() => setIsVerifyModalOpen(true)}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-[#00529C] border border-[#00529C] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verificar Código</span>
            </button>
          </div>

          {/* Total Certificates Stat Box */}
          <div className="bg-gradient-to-br from-[#00529C] to-[#003F78] rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs text-white/80 font-bold uppercase tracking-wider block">
                Total de Certificados
              </span>
              <span className="font-black text-4xl mt-1 block">
                {certificates.length}
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
              <GraduationCap className="w-8 h-8" />
            </div>
          </div>

        </div>

      </div>

      {/* Conquistas Anteriores Section */}
      {pastCerts.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="font-extrabold text-xl md:text-2xl text-slate-900 font-['Outfit']">
            Conquistas Anteriores
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
