import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Lock,
  FileText,
  Award,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import type { Course, Lesson } from '../types';

interface PlayerViewProps {
  course: Course;
  onBackToCatalog: () => void;
  onOpenExam: () => void;
  onCompleteLesson: (lessonId: string) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  course,
  onBackToCatalog,
  onOpenExam,
  onCompleteLesson
}) => {
  const currentModule = course.modules[1] || course.modules[0];
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(
    currentModule?.lessons[1] || currentModule?.lessons[0]
  );

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [fixacaoSubmitted, setFixacaoSubmitted] = useState<boolean>(false);
  const [fixacaoSuccess, setFixacaoSuccess] = useState<boolean>(false);

  const handleFixacaoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson.quickQuestions || selectedLesson.quickQuestions.length === 0) return;
    
    const q1 = selectedLesson.quickQuestions[0];
    if (q1 && selectedOption === q1.correctAnswer) {
      setFixacaoSuccess(true);
      onCompleteLesson(selectedLesson.id);
    } else {
      setFixacaoSuccess(false);
    }
    setFixacaoSubmitted(true);
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button
          onClick={onBackToCatalog}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#00529C', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          <span>Voltar aos Cursos</span>
        </button>

        <button
          onClick={onOpenExam}
          className="btn-card-action"
          style={{ marginTop: 0, width: 'auto', padding: '8px 16px' }}
        >
          <Award style={{ width: 16, height: 16 }} />
          <span>Emitir Certificado / Prova</span>
        </button>
      </div>

      <div className="player-grid">
        
        {/* Left Sidebar Navigation (Desktop) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card-details-box">
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#00529C', marginBottom: 4 }}>
              {course.title}
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: 16 }}>
              {currentModule?.title}
            </p>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: '#FFF0E6', color: '#F95700', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
                <Play style={{ width: 16, height: 16 }} />
                <span>Aulas</span>
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'none', color: '#475569', fontWeight: 500, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
                <FileText style={{ width: 16, height: 16 }} />
                <span>Exercícios</span>
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'none', color: '#475569', fontWeight: 500, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
                <BookOpen style={{ width: 16, height: 16 }} />
                <span>Materiais</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Center Video & Details */}
        <div>
          <div className="video-frame-box">
            <iframe
              src={selectedLesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
              title={selectedLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="card-details-box">
            <span className="card-category-badge" style={{ position: 'static', display: 'inline-block', marginBottom: 12, background: '#FFF0E6', color: '#F95700' }}>
              Módulo 2 • Aula {selectedLesson.id}
            </span>

            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', marginBottom: 12 }}>
              {selectedLesson.title}
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
              {selectedLesson.description}
            </p>

            {/* Description Tab & Topics */}
            <div style={{ paddingTop: 16, borderTop: '1px solid #E2E8F0' }}>
              <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: 8 }}>Tópicos Abordados:</h4>
              <ul style={{ paddingLeft: 20, fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {selectedLesson.topicsCovered.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Module Content & Fixação Rápida */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Module Content */}
          <div className="card-details-box">
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1rem', marginBottom: 12 }}>
              Conteúdo do Módulo
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentModule?.lessons.map(les => {
                const isSelected = selectedLesson.id === les.id;
                return (
                  <button
                    key={les.id}
                    onClick={() => setSelectedLesson(les)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 12,
                      borderRadius: 12,
                      border: isSelected ? '1px solid #F95700' : '1px solid #E2E8F0',
                      background: isSelected ? '#FFF0E6' : '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {les.completed ? (
                      <CheckCircle2 style={{ width: 16, height: 16, color: '#10B981', flexShrink: 0 }} />
                    ) : isSelected ? (
                      <Play style={{ width: 16, height: 16, color: '#F95700', flexShrink: 0 }} />
                    ) : (
                      <Lock style={{ width: 16, height: 16, color: '#94A3B8', flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#F95700' : '#1e293b' }}>
                      {les.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fixação Rápida */}
          <div className="card-details-box" style={{ backgroundColor: '#FAF6F0' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <HelpCircle style={{ width: 18, height: 18, color: '#F95700' }} />
              Fixação Rápida
            </h3>

            {selectedLesson.quickQuestions && selectedLesson.quickQuestions.length > 0 ? (
              <form onSubmit={handleFixacaoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                  {selectedLesson.quickQuestions[0].question}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedLesson.quickQuestions[0].options?.map(opt => (
                    <label
                      key={opt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: 10,
                        borderRadius: 10,
                        border: selectedOption === opt.id ? '1px solid #F95700' : '1px solid #E2E8F0',
                        background: '#ffffff',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="radio"
                        name="fixacao"
                        value={opt.id}
                        checked={selectedOption === opt.id}
                        onChange={() => setSelectedOption(opt.id)}
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!selectedOption}
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    background: selectedOption ? '#00529C' : '#CBD5E1',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    border: 'none',
                    cursor: selectedOption ? 'pointer' : 'not-allowed'
                  }}
                >
                  RESPONDER
                </button>

                {fixacaoSubmitted && (
                  <div
                    style={{
                      padding: 10,
                      borderRadius: 10,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: fixacaoSuccess ? '#D1FAE5' : '#FFE4E6',
                      color: fixacaoSuccess ? '#065F46' : '#9F1239'
                    }}
                  >
                    {fixacaoSuccess ? '✓ Resposta Correta! Aula concluída.' : '✕ Resposta incorreta. Tente novamente!'}
                  </div>
                )}
              </form>
            ) : null}
          </div>

        </div>

      </div>
    </div>
  );
};
