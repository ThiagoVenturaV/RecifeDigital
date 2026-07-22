import React from 'react';
import { Clock, PlayCircle } from 'lucide-react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onSelectCourse: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelectCourse }) => {
  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Informática':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Mobile':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sociedade':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Programação':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Thumbnail Header */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-xs shadow-2xs ${getCategoryBadgeStyle(
            course.category
          )}`}
        >
          {course.category}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#F95700] transition-colors leading-snug">
            {course.title}
          </h3>
          <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Progress or Hours info */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          {course.isEnrolled && course.progressPercent > 0 ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Progresso</span>
                <span>{course.progressPercent}% concluído</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#F95700] h-full rounded-full transition-all duration-500"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-500 text-xs font-medium">
                <Clock className="w-4 h-4 mr-1 text-slate-400" />
                <span>{course.workloadHours}h de carga horária</span>
              </div>
              <button
                onClick={() => onSelectCourse(course)}
                className="text-xs font-bold text-[#F95700] hover:text-[#E04B00] transition-colors"
              >
                {course.isEnrolled ? 'Continuar' : 'Inscrever-se'}
              </button>
            </div>
          )}

          {course.isEnrolled && (
            <button
              onClick={() => onSelectCourse(course)}
              className="mt-3 w-full py-2.5 px-4 bg-[#F95700] hover:bg-[#E04B00] text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Acessar Aulas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
