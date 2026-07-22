import React, { useState } from 'react';
import type { Course } from '../types';
import { CourseCard } from '../components/CourseCard';
import { Search, Sparkles } from 'lucide-react';

interface CatalogViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenInfo: (type: 'privacy' | 'terms' | 'support' | 'about') => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  courses,
  onSelectCourse,
  searchQuery,
  setSearchQuery,
  onOpenInfo
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Informática', 'Mobile', 'Sociedade', 'Programação', 'Design'];

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
    <div style={{ paddingBottom: '3rem' }}>
      
      {/* Hero Banner */}
      <div className="hero-banner">
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 640 }}>
          <div className="hero-tag">
            <Sparkles style={{ width: 14, height: 14, color: '#FCD34D' }} />
            <span>Capacitação Acessível & Gratuita</span>
          </div>

          <h1 className="hero-title">
            Bem-vindo ao Recife Digital
          </h1>

          <p className="hero-desc">
            Desenvolva novas habilidades tecnológicas e conecte-se com o futuro. Explore nossos cursos focados em inclusão digital e tecnologia.
          </p>

          <div>
            <button
              onClick={() => {
                if (courses.length > 0) onSelectCourse(courses[0]);
              }}
              className="btn-primary"
            >
              Comece a Aprender
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="filter-bar">
        {/* Category Chips */}
        <div className="chips-wrapper">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="search-input-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por curso..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Nível Básico Section */}
      {(selectedCategory === 'Todos' || basicCourses.length > 0) && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div className="section-title">
            <span>🎓 Nível Básico</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
              {basicCourses.length} curso(s)
            </span>
          </div>

          <div className="courses-grid">
            {basicCourses.map(course => (
              <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
            ))}
          </div>
        </section>
      )}

      {/* Nível Intermediário Section */}
      {(selectedCategory === 'Todos' || intermediateCourses.length > 0) && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div className="section-title">
            <span>💻 Nível Intermediário & Avançado</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
              {intermediateCourses.length} curso(s)
            </span>
          </div>

          <div className="courses-grid">
            {intermediateCourses.map(course => (
              <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
            ))}
          </div>
        </section>
      )}

      {/* Footer Section */}
      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontSize: '0.75rem', color: '#64748B' }}>
        <div className="partner-logos" style={{ paddingLeft: 0, borderLeft: 'none' }}>
          <a href="https://www.recife.pe.gov.br" target="_blank" rel="noreferrer">
            <img src="/recife_azul_sobre_branco.png" alt="Prefeitura do Recife" className="partner-logo-img" />
          </a>
          <a href="https://www.cesar.school" target="_blank" rel="noreferrer">
            <img src="/logoSchool.svg" alt="CESAR School" className="partner-logo-img" />
          </a>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={() => onOpenInfo('privacy')} style={{ background: 'none', border: 'none', color: '#00529C', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            Privacidade
          </button>
          <button onClick={() => onOpenInfo('terms')} style={{ background: 'none', border: 'none', color: '#00529C', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            Termos de Uso
          </button>
          <button onClick={() => onOpenInfo('support')} style={{ background: 'none', border: 'none', color: '#00529C', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            Suporte
          </button>
          <button onClick={() => onOpenInfo('about')} style={{ background: 'none', border: 'none', color: '#00529C', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            Sobre
          </button>
        </div>

        <p>© 2026 Prefeitura do Recife & CESAR School. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
};
