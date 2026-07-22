import React from 'react';
import { X, ShieldCheck, FileText, HelpCircle, Info } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | 'support' | 'about' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const contentMap = {
    privacy: {
      title: 'Política de Privacidade',
      icon: <ShieldCheck style={{ width: 24, height: 24, color: '#00529C' }} />,
      text: 'A plataforma Recife Digital garante a total privacidade e proteção dos dados pessoais dos alunos. Todas as informações de progresso e certificados são armazenadas com segurança e utilizadas exclusivamente para fins de emissão de certificados e capacitação pública em parceria com a CESAR School e Prefeitura do Recife.'
    },
    terms: {
      title: 'Termos de Uso',
      icon: <FileText style={{ width: 24, height: 24, color: '#00529C' }} />,
      text: 'Os cursos e conteúdos disponibilizados no Recife Digital são gratuitos e acessíveis a todos os cidadãos. Ao se matricular, o aluno se compromete a realizar as avaliações com integridade e zelar pelo uso correto da plataforma.'
    },
    support: {
      title: 'Suporte e Atendimento',
      icon: <HelpCircle style={{ width: 24, height: 24, color: '#F95700' }} />,
      text: 'Precisa de ajuda ou dúvidas sobre emissão de certificados? Entre em contato com a equipe de suporte através do e-mail suporte@recifedigital.pe.gov.br ou visite um dos polos de inclusão digital da Prefeitura do Recife.'
    },
    about: {
      title: 'Sobre o Recife Digital',
      icon: <Info style={{ width: 24, height: 24, color: '#00529C' }} />,
      text: 'O Recife Digital é uma iniciativa de inclusão tecnológica e capacitação profissional da Prefeitura do Recife em parceria com a CESAR School, promovendo o desenvolvimento de habilidades digitais e inclusão social.'
    }
  };

  const item = contentMap[type];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-btn">
          <X style={{ width: 20, height: 20 }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          {item.icon}
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>
            {item.title}
          </h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
          {item.text}
        </p>

        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>
            Entendi, Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
