import React, { useState, useEffect } from 'react';
import { X, Clock, AlertCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Course } from '../types';

interface QuizModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onCompleteExam: (scorePercent: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  course,
  isOpen,
  onClose,
  onCompleteExam
}) => {
  const exam = course.finalExam;
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    correctCount: number;
    totalCount: number;
    percentage: number;
    isPassed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isOpen || isSubmitted) return;

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isSubmitted]);

  if (!isOpen) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = exam.questions.length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const handleSubmit = () => {
    let correct = 0;
    exam.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const percentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 100;
    const isPassed = percentage >= exam.passPercentage;

    setScoreResult({
      correctCount: correct,
      totalCount: totalQuestions,
      percentage,
      isPassed
    });

    setIsSubmitted(true);

    if (isPassed) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      onCompleteExam(percentage);
    }
  };

  return (
    <div className="modal-overlay" style={{ alignItems: 'flex-start', paddingTop: 40, overflowY: 'auto' }}>
      
      <div style={{ maxWidth: 800, width: '100%', background: '#ffffff', borderRadius: 28, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', marginBottom: 40 }}>
        
        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 16, marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
              AVALIAÇÃO FINAL
            </span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#00529C' }}>
              {course.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 9999, background: '#EFF6FF', color: '#00529C', fontWeight: 800, fontSize: '0.8rem', fontFamily: 'monospace' }}>
              <Clock style={{ width: 14, height: 14, color: '#F95700' }} />
              <span>TEMPO RESTANTE {formatTime(secondsLeft)}</span>
            </div>

            <button onClick={onClose} className="close-btn" style={{ position: 'static' }}>
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div className="progress-bar-bg" style={{ marginBottom: 20 }}>
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Info Banner */}
        <div style={{ padding: 12, borderRadius: 12, background: '#FEF3C7', border: '1px solid #FDE68A', color: '#78350F', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <AlertCircle style={{ width: 18, height: 18, color: '#D97706', flexShrink: 0 }} />
          <span>Leia atentamente cada questão. Você precisa de <strong>70% de acerto</strong> para ser aprovado.</span>
        </div>

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {exam.questions.map((q, idx) => {
            const selectedOpt = userAnswers[q.id];
            return (
              <div key={q.id} className="card-details-box" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#F1F5F9', color: '#334155', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {idx + 1}
                  </span>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                    {q.question}
                  </h3>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 40 }}>
                  {q.options?.map(opt => {
                    const isSelected = selectedOpt === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: 12,
                          borderRadius: 12,
                          border: isSelected ? '1px solid #F95700' : '1px solid #E2E8F0',
                          background: isSelected ? '#FFF0E6' : '#ffffff',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10
                        }}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={isSelected}
                          onChange={() => {}}
                        />
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button Bar */}
        {!isSubmitted && (
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Respondidas: <strong>{answeredCount} de {totalQuestions}</strong>
            </span>
            <button
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className="btn-card-action"
              style={{ marginTop: 0, width: 'auto', padding: '10px 24px', opacity: answeredCount > 0 ? 1 : 0.5, cursor: answeredCount > 0 ? 'pointer' : 'not-allowed' }}
            >
              <Award style={{ width: 18, height: 18 }} />
              <span>FINALIZAR PROVA</span>
            </button>
          </div>
        )}

        {/* Score Modal Result */}
        {isSubmitted && scoreResult && (
          <div style={{ marginTop: 24, padding: 24, borderRadius: 20, background: scoreResult.isPassed ? '#D1FAE5' : '#FFE4E6', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.5rem', color: scoreResult.isPassed ? '#065F46' : '#9F1239' }}>
              {scoreResult.isPassed ? 'Parabéns! Aprovação Concluída!' : 'Tente Novamente!'}
            </h3>
            <span style={{ fontWeight: 900, fontSize: '2.5rem', display: 'block', margin: '8px 0', color: scoreResult.isPassed ? '#059669' : '#BE123C' }}>
              {scoreResult.percentage}%
            </span>
            <button
              onClick={onClose}
              className="btn-primary"
              style={{ marginTop: 12 }}
            >
              {scoreResult.isPassed ? 'Ver Certificado' : 'Fechar'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
