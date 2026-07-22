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
    <div style={{ paddingBottom: '3rem' }}>
      
      {/* Student Profile Banner */}
      <div className="card-details-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            alt="Thiago Ventura"
            style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.8rem' }}>
                Thiago Ventura
              </h1>
              <span style={{ padding: '2px 10px', borderRadius: 9999, background: '#D1FAE5', color: '#065F46', fontSize: '0.7rem', fontWeight: 800 }}>
                Aluno Ativo
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.75rem', marginTop: 4 }}>
              Matrícula Conecta Recife: #8849-2026 • Recife, Pernambuco
            </p>
          </div>
        </div>

        {/* Quick Badges */}
        <div style={{ display: 'flex', gap: 20, background: '#F8FAFC', padding: 12, borderRadius: 16, border: '1px solid #E2E8F0' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>
              Horas Estudadas
            </span>
            <span style={{ fontWeight: 900, fontSize: '1.5rem', color: '#F95700', display: 'block' }}>
              {totalHoursCompleted + 45}h
            </span>
          </div>

          <div style={{ width: 1, background: '#E2E8F0' }} />

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>
              Certificados
            </span>
            <span style={{ fontWeight: 900, fontSize: '1.5rem', color: '#00529C', display: 'block' }}>
              {certificates.length}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="courses-grid" style={{ marginBottom: 24 }}>
        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>Cursos em Andamento</span>
            <BookOpen style={{ width: 18, height: 18, color: '#F95700' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '2rem', color: '#0f172a', display: 'block', marginTop: 8 }}>
            {enrolledCourses.length}
          </span>
        </div>

        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>Média de Desempenho</span>
            <Star style={{ width: 18, height: 18, color: '#F59E0B' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '2rem', color: '#10B981', display: 'block', marginTop: 8 }}>
            9.7 / 10
          </span>
        </div>

        <div className="stat-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>
            <span>Nível da Jornada</span>
            <Sparkles style={{ width: 18, height: 18, color: '#7C3AED' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.5rem', color: '#7C3AED', display: 'block', marginTop: 8 }}>
            Intermediário
          </span>
        </div>
      </div>

      {/* Active Courses Progress Detailed */}
      <div className="card-details-box">
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', marginBottom: 16 }}>
          Progresso Detalhado dos Cursos
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {enrolledCourses.map(course => (
            <div key={course.id} style={{ padding: 16, borderRadius: 16, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>{course.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{course.category} • {course.workloadHours}h</span>
                </div>
                <button
                  onClick={() => onSelectCourse(course)}
                  className="btn-card-action"
                  style={{ marginTop: 0, width: 'auto', padding: '6px 14px', fontSize: '0.75rem' }}
                >
                  Continuar Aula
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>
                  <span>Concluído</span>
                  <span>{course.progressPercent}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
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
