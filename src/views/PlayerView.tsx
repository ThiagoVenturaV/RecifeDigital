import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Lock,
  FileText,
  Award,
  Settings,
  LogOut,
  BookOpen,
  HelpCircle,
  MessageSquare
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
  // Find current active module and lesson
  const currentModule = course.modules[1] || course.modules[0];
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(
    currentModule?.lessons[1] || currentModule?.lessons[0]
  );

  const [activeTab, setActiveTab] = useState<'descricao' | 'materiais'>('descricao');
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
    <div className="min-h-screen bg-[#FAF6F0] -mx-4 sm:-mx-6 lg:-mx-8 -my-6 sm:-my-8">
      
      {/* Top Mobile Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <button
          onClick={onBackToCatalog}
          className="flex items-center gap-1.5 text-[#00529C] font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
        <span className="font-extrabold text-sm text-slate-900 truncate max-w-[200px] font-['Outfit']">
          {course.title}
        </span>
        <button
          onClick={onOpenExam}
          className="p-1.5 bg-[#F95700] text-white rounded-lg text-xs font-bold"
        >
          Prova
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Navigation (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-6">
            
            {/* Header info */}
            <div>
              <button
                onClick={onBackToCatalog}
                className="flex items-center gap-1.5 text-[#00529C] hover:text-[#003F78] font-bold text-xs mb-3 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Catálogo</span>
              </button>
              <h3 className="font-black text-lg text-[#00529C] font-['Outfit'] leading-snug">
                {course.title}
              </h3>
              <span className="text-xs text-slate-500 font-medium block mt-1">
                {currentModule?.title}
              </span>
            </div>

            {/* Menu Links */}
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-orange-50 text-[#F95700] font-bold text-sm">
                <Play className="w-4 h-4" />
                <span>Aulas</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Exercícios</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Materiais</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Dúvidas</span>
              </button>
            </nav>

            {/* Certificate Button */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <button
                onClick={onOpenExam}
                className="w-full py-3 px-4 bg-[#F95700] hover:bg-[#E04B00] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>EMITIR CERTIFICADO</span>
              </button>

              <div className="pt-2 text-xs text-slate-500 space-y-2">
                <button className="w-full flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Configurações</span>
                </button>
                <button
                  onClick={onBackToCatalog}
                  className="w-full flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Center Player & Details Column */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Main Video Player Container (Exact Match to Figma player) */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 shadow-xl border border-slate-800 group">
            <iframe
              src={selectedLesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
              title={selectedLesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Lesson Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
            
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-[#F95700] text-xs font-bold mb-2">
                Módulo 2 • Aula {selectedLesson.id}
              </span>
              <h1 className="font-extrabold text-2xl md:text-3xl text-slate-900 font-['Outfit'] leading-snug">
                {selectedLesson.title}
              </h1>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                {selectedLesson.description}
              </p>
            </div>

            {/* Instructor Badge */}
            {selectedLesson.instructorName && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <img
                  src={
                    selectedLesson.instructorAvatar ||
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={selectedLesson.instructorName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    {selectedLesson.instructorName}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {selectedLesson.instructorRole}
                  </span>
                </div>
              </div>
            )}

            {/* Description / Support Tabs */}
            <div className="space-y-4">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('descricao')}
                  className={`pb-3 font-bold text-sm transition-colors border-b-2 mr-6 ${
                    activeTab === 'descricao'
                      ? 'border-[#F95700] text-[#F95700]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Descrição
                </button>
                <button
                  onClick={() => setActiveTab('materiais')}
                  className={`pb-3 font-bold text-sm transition-colors border-b-2 ${
                    activeTab === 'materiais'
                      ? 'border-[#F95700] text-[#F95700]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Materiais de Apoio
                </button>
              </div>

              {activeTab === 'descricao' ? (
                <div className="space-y-3 text-sm text-slate-700">
                  <p className="font-bold text-slate-900">Tópicos abordados:</p>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                    {selectedLesson.topicsCovered.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <p className="font-bold text-slate-800">Arquivos para download:</p>
                  <a href="#" className="flex items-center gap-2 text-[#00529C] hover:underline font-semibold">
                    <FileText className="w-4 h-4" /> Apostila_Excel_Modulo2.pdf (1.8 MB)
                  </a>
                  <a href="#" className="flex items-center gap-2 text-[#00529C] hover:underline font-semibold">
                    <FileText className="w-4 h-4" /> Exemplo_Planilha_Pratica.xlsx (420 KB)
                  </a>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Sidebar: Module Content & Fixação Rápida Widget */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Módulo Content List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
              Conteúdo do Módulo
            </h3>
            
            <div className="space-y-2.5">
              {currentModule?.lessons.map(les => {
                const isSelected = selectedLesson.id === les.id;
                return (
                  <button
                    key={les.id}
                    onClick={() => setSelectedLesson(les)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-orange-50/70 border-[#F95700] ring-1 ring-[#F95700]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {les.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : isSelected ? (
                      <Play className="w-4 h-4 text-[#F95700] fill-[#F95700] flex-shrink-0 mt-0.5" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#F95700]' : 'text-slate-800'}`}>
                        {les.title}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {isSelected ? 'Assistindo agora • ' : ''}{les.durationMinutes} min
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fixação Rápida Widget (Matching Figma Interactive Widget) */}
          <div className="bg-[#FAF6F0] rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 text-[#F95700] rounded-xl">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 font-['Outfit']">
                Fixação Rápida
              </h3>
            </div>

            {selectedLesson.quickQuestions && selectedLesson.quickQuestions.length > 0 ? (
              <form onSubmit={handleFixacaoSubmit} className="space-y-4">
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {selectedLesson.quickQuestions[0].question}
                </p>

                {/* Question Options */}
                <div className="space-y-2">
                  {selectedLesson.quickQuestions[0].options?.map(opt => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedOption === opt.id
                          ? 'bg-white border-[#F95700] ring-1 ring-[#F95700] font-bold text-slate-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fixacao"
                        value={opt.id}
                        checked={selectedOption === opt.id}
                        onChange={() => setSelectedOption(opt.id)}
                        className="accent-[#F95700]"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!selectedOption}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    selectedOption
                      ? 'bg-[#00529C] hover:bg-[#003F78] text-white shadow-xs'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  RESPONDER
                </button>

                {fixacaoSubmitted && (
                  <div
                    className={`p-3 rounded-xl text-xs ${
                      fixacaoSuccess
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {fixacaoSuccess
                      ? '✓ Resposta Correta! Aula concluída.'
                      : '✕ Resposta incorreta. Tente novamente!'}
                  </div>
                )}
              </form>
            ) : (
              <p className="text-xs text-slate-500">Nenhum exercício para esta aula.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
