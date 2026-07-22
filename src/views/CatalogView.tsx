import React, { useState } from 'react';
import type { Course } from '../types';
import { CourseCard } from '../components/CourseCard';
import { Search, Sparkles } from 'lucide-react';

interface CatalogViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  courses,
  onSelectCourse,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Informática', 'Mobile', 'Sociedade', 'Programação', 'Design'];

  // Filtered courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const basicCourses = filteredCourses.filter(c => c.level === 'Nível Básico');
  const intermediateCourses = filteredCourses.filter(
    c => c.level === 'Nível Intermediário' || c.level === 'Nível Avançado'
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Banner (Matching Figma Mobile & Desktop Hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF5500] to-[#E04B00] text-white p-6 sm:p-10 md:p-12 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Capacitação Acessível & Gratuita</span>
          </div>

          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl font-['Outfit'] tracking-tight leading-tight">
            Bem-vindo ao Recife Digital
          </h1>

          <p className="text-white/90 text-base sm:text-lg leading-relaxed">
            Desenvolva novas habilidades tecnológicas e conecte-se com o futuro. Explore nossos cursos focados em inclusão digital e tecnologia.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                if (courses.length > 0) onSelectCourse(courses[0]);
              }}
              className="py-3.5 px-8 bg-white text-[#FF5500] hover:bg-slate-50 font-black text-base rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5"
            >
              Comece a Aprender
            </button>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -top-12 w-64 h-64 bg-orange-300/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Search & Filter bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#00529C] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por curso..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#FF5500]"
            />
          </div>
        </div>
      </div>

      {/* Nível Básico Section */}
      {(selectedCategory === 'Todos' || basicCourses.length > 0) && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h2 className="font-extrabold text-xl md:text-2xl text-slate-900 font-['Outfit'] flex items-center gap-2">
              <span className="text-xl">🎓</span> Nível Básico
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {basicCourses.length} curso(s)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {basicCourses.map(course => (
              <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
            ))}
          </div>
        </section>
      )}

      {/* Nível Intermediário Section */}
      {(selectedCategory === 'Todos' || intermediateCourses.length > 0) && (
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h2 className="font-extrabold text-xl md:text-2xl text-slate-900 font-['Outfit'] flex items-center gap-2">
              <span className="text-xl">💻</span> Nível Intermediário & Avançado
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {intermediateCourses.length} curso(s)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {intermediateCourses.map(course => (
              <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
            ))}
          </div>
        </section>
      )}

      {/* Footer Section */}
      <footer className="mt-16 pt-8 border-t border-slate-200 text-slate-500 text-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img src="/recife_azul_sobre_branco.png" alt="Prefeitura do Recife" className="h-7 w-auto object-contain opacity-85" />
          <img src="/logoSchool.svg" alt="CESAR School" className="h-6 w-auto object-contain opacity-85" />
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-slate-800 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-slate-800 transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-slate-800 transition-colors">Suporte</a>
          <a href="#" className="hover:text-slate-800 transition-colors">Sobre o Recife Digital</a>
        </div>
        <p>© 2026 Prefeitura do Recife & CESAR School. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
};
