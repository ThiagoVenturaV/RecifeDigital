import React from 'react';
import { Clock, PlayCircle } from 'lucide-react';
import type { Course } from '../types';
import '../styles/CourseCard.css';

interface CourseCardProps {
  course: Course;
  onSelectCourse: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelectCourse }) => {
  return (
    <div className="course-card">
      
      {/* Thumbnail Header */}
      <div className="card-thumb-wrapper">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="card-thumb-img"
        />
        <span className="card-category-badge">
          {course.category}
        </span>
      </div>

      {/* Card Content */}
      <div className="card-body">
        <div>
          <h3 className="card-title">
            {course.title}
          </h3>
          <p className="card-desc">
            {course.description}
          </p>
        </div>

        {/* Progress or Hours info */}
        <div className="card-footer">
          {course.isEnrolled && course.progressPercent > 0 ? (
            <div>
              <div className="card-progress-header">
                <span>Progresso</span>
                <span>{course.progressPercent}% concluído</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="card-info-row">
              <div className="workload-text">
                <Clock style={{ width: 14, height: 14 }} />
                <span>{course.workloadHours}h de carga horária</span>
              </div>
              <button
                onClick={() => onSelectCourse(course)}
                className="action-link-btn"
              >
                {course.isEnrolled ? 'Continuar' : 'Inscrever-se'}
              </button>
            </div>
          )}

          {course.isEnrolled && (
            <button
              onClick={() => onSelectCourse(course)}
              className="btn-card-action"
            >
              <PlayCircle style={{ width: 16, height: 16 }} />
              <span>Acessar Aulas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
