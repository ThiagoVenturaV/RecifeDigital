import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import type { Course } from '../types';
import '../styles/SearchModal.css';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectCourse
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = courses.filter(
    c =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="search-modal-box">
        
        {/* Header */}
        <div className="search-modal-header">
          <Search style={{ width: 22, height: 22, color: '#F95700' }} />
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>
            Buscar Cursos
          </h3>
          <button onClick={onClose} className="close-btn" style={{ position: 'static', marginLeft: 'auto' }}>
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Input */}
        <div className="search-modal-input-wrapper">
          <Search className="search-icon" style={{ top: 14 }} />
          <input
            type="text"
            placeholder="Digite o nome do curso ou palavra-chave..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-modal-input"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="search-results-list">
          {results.map(course => (
            <div
              key={course.id}
              onClick={() => {
                onSelectCourse(course);
                onClose();
              }}
              className="search-result-item"
            >
              <div>
                <span className="card-category-badge" style={{ position: 'static', fontSize: '0.65rem', marginBottom: 4, display: 'inline-block' }}>
                  {course.category}
                </span>
                <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', margin: 0 }}>
                  {course.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  {course.workloadHours}h • {course.level}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#F95700', fontWeight: 800, fontSize: '0.75rem' }}>
                <span>Acessar</span>
                <ArrowRight style={{ width: 16, height: 16 }} />
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div style={{ textAlign: 'center', padding: 24, color: '#94A3B8', fontSize: '0.85rem' }}>
              Nenhum curso encontrado para "{query}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
