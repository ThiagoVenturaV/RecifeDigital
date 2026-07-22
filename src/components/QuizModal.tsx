import React, { useState, useEffect } from 'react';
import { X, Clock, AlertCircle, Award, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
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

  // Countdown timer effect
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex flex-col">
      
      {/* Top Header Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            AVALIAÇÃO FINAL
          </span>
          <h2 className="font-extrabold text-xl text-[#00529C] font-['Outfit']">
            {course.title}
          </h2>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full font-mono text-sm font-bold text-[#00529C]">
            <Clock className="w-4 h-4 text-[#F95700]" />
            <span>TEMPO RESTANTE {formatTime(secondsLeft)}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Progress Line below header */}
      <div className="bg-slate-100 h-1.5 w-full">
        <div
          className="bg-[#F95700] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p>
            Leia atentamente cada questão. Você precisa de <strong>70% de acerto</strong> para ser aprovado e habilitar a emissão do seu certificado do Recife Digital & CESAR School.
          </p>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {exam.questions.map((q, idx) => {
            const selectedOpt = userAnswers[q.id];
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4"
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-100 font-extrabold text-sm text-slate-700 flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 leading-snug pt-1">
                    {q.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="space-y-2.5 pl-11">
                  {q.options?.map(opt => {
                    const isSelected = selectedOpt === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-orange-50/70 border-[#F95700] ring-1 ring-[#F95700] text-slate-900 font-semibold'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-[#F95700] bg-[#F95700] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm leading-relaxed">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Finish Bar */}
      {!isSubmitted && (
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              Certifique-se de revisar suas respostas. Questões respondidas: <strong>{answeredCount} de {totalQuestions}</strong>.
            </p>
            <button
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className={`w-full sm:w-auto py-3 px-8 rounded-xl font-extrabold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                answeredCount > 0
                  ? 'bg-[#F95700] hover:bg-[#E04B00]'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Award className="w-5 h-5" />
              <span>FINALIZAR PROVA</span>
            </button>
          </div>
        </div>
      )}

      {/* Score Modal Result */}
      {isSubmitted && scoreResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-orange-100 text-[#F95700]">
              {scoreResult.isPassed ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              ) : (
                <AlertCircle className="w-10 h-10 text-amber-600" />
              )}
            </div>

            <div>
              <h3 className="font-extrabold text-2xl text-slate-900 font-['Outfit']">
                {scoreResult.isPassed ? 'Parabéns! Aprovação Concluída!' : 'Tente Novamente!'}
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                {scoreResult.isPassed
                  ? 'Você atingiu os critérios necessários para receber seu certificado!'
                  : 'Você precisa de no mínimo 70% de acerto para ser aprovado.'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                Sua Nota Final
              </span>
              <span className={`font-black text-4xl mt-1 block ${scoreResult.isPassed ? 'text-emerald-600' : 'text-slate-800'}`}>
                {scoreResult.percentage}%
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                {scoreResult.correctCount} acertos de {scoreResult.totalCount} questões
              </span>
            </div>

            <div className="flex gap-3">
              {!scoreResult.isPassed && (
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setUserAnswers({});
                    setSecondsLeft(exam.durationMinutes * 60);
                  }}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refazer</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-[#F95700] hover:bg-[#E04B00] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>{scoreResult.isPassed ? 'Ver Certificado' : 'Fechar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
