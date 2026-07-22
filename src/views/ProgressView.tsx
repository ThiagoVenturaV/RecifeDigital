import React from 'react';
import type { Course, Certificate } from '../types';
import { BookOpen, Star, Sparkles } from 'lucide-react';

interface ProgressViewProps {
  courses: Course[];
  certificates: Certificate[];
  onSelectCourse: (course: Course) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  courses,
  certificates,
  onSelectCourse
}) => {
  const enrolledCourses = courses.filter(c => c.isEnrolled);
  const totalHoursCompleted = certificates.reduce((acc, c) => acc + c.workloadHours, 0);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Student Profile Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            alt="Thiago Ventura"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-orange-500/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-2xl md:text-3xl text-slate-900 font-['Outfit']">
                Thiago Ventura
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Aluno Ativo
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Matrícula Conecta Recife: #8849-2026 • Recife, Pernambuco
            </p>
          </div>
        </div>

        {/* Quick Badges */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full md:w-auto justify-around">
          <div className="text-center px-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Horas Estudadas
            </span>
            <span className="font-black text-2xl text-[#F95700] mt-0.5 block">
              {totalHoursCompleted + 45}h
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200" />

          <div className="text-center px-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Certificados
            </span>
            <span className="font-black text-2xl text-[#00529C] mt-0.5 block">
              {certificates.length}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Cursos em Andamento</span>
            <BookOpen className="w-5 h-5 text-[#F95700]" />
          </div>
          <span className="font-black text-3xl text-slate-900 block">
            {enrolledCourses.length}
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Média de Desempenho</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <span className="font-black text-3xl text-emerald-600 block">
            9.7 / 10
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Nível da Jornada</span>
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <span className="font-black text-2xl text-purple-700 block">
            Intermediário
          </span>
        </div>
      </div>

      {/* Active Courses Progress Detailed */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
        <h2 className="font-extrabold text-xl text-slate-900 font-['Outfit']">
          Progresso Detalhado dos Cursos
        </h2>

        <div className="space-y-6">
          {enrolledCourses.map(course => (
            <div key={course.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{course.title}</h3>
                  <span className="text-xs text-slate-500">{course.category} • {course.workloadHours}h</span>
                </div>
                <button
                  onClick={() => onSelectCourse(course)}
                  className="py-2 px-4 bg-[#F95700] hover:bg-[#E04B00] text-white font-bold text-xs rounded-xl transition-colors self-start sm:self-auto"
                >
                  Continuar Aula
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Concluído</span>
                  <span>{course.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F95700] h-full rounded-full transition-all duration-500"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
