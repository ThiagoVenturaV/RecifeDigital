import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { LibrasWidget } from './components/LibrasWidget';
import { QuizModal } from './components/QuizModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { CatalogView } from './views/CatalogView';
import { PlayerView } from './views/PlayerView';
import { CertificatesView } from './views/CertificatesView';
import { ProgressView } from './views/ProgressView';
import { INITIAL_COURSES, INITIAL_CERTIFICATES } from './data/coursesData';
import type { Course, Certificate, AccessibilitySettings } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'catalog' | 'player' | 'certificates' | 'progress'>('catalog');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [selectedCourse, setSelectedCourse] = useState<Course>(INITIAL_COURSES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isPWAModalOpen, setIsPWAModalOpen] = useState(false);

  // Initialize accessibility from Cookies if available
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const savedContrast = Cookies.get('acc_high_contrast') === 'true';
    const savedScale = parseFloat(Cookies.get('acc_font_scale') || '1');
    return {
      highContrast: savedContrast,
      fontScale: isNaN(savedScale) ? 1 : savedScale,
      vlibrasActive: true,
      audioDescription: false
    };
  });

  // Apply high contrast & font scale effect to document body and sync to Cookies
  useEffect(() => {
    if (accessibility.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    document.documentElement.style.setProperty('--font-scale', accessibility.fontScale.toString());

    Cookies.set('acc_high_contrast', accessibility.highContrast.toString(), { expires: 30 });
    Cookies.set('acc_font_scale', accessibility.fontScale.toString(), { expires: 30 });
  }, [accessibility]);

  // Auto show PWA Install modal on first visit if not dismissed
  useEffect(() => {
    const isDismissed = Cookies.get('pwa_modal_dismissed');
    const isInstalled = Cookies.get('pwa_installed');
    if (!isDismissed && !isInstalled) {
      const timer = setTimeout(() => setIsPWAModalOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentTab('player');
  };

  const handleCompleteLesson = (lessonId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === selectedCourse.id) {
          const updatedModules = c.modules.map(mod => ({
            ...mod,
            lessons: mod.lessons.map(les => (les.id === lessonId ? { ...les, completed: true } : les))
          }));
          return { ...c, progressPercent: Math.min(100, c.progressPercent + 25), modules: updatedModules };
        }
        return c;
      })
    );
  };

  const handleCompleteExam = (gradePercent: number) => {
    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      issueDate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      workloadHours: selectedCourse.workloadHours,
      grade: Number((gradePercent / 10).toFixed(1)),
      competencies: [selectedCourse.category, 'Produtividade Digital', 'Recife Digital'],
      verificationCode: `RDFE-2026-${Math.floor(1000 + Math.random() * 9000)}X`,
      studentName: 'Thiago Ventura'
    };

    setCertificates(prev => [newCert, ...prev]);
    setIsExamOpen(false);
    setCurrentTab('certificates');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-slate-900 font-sans app-container flex flex-col justify-between">
      <div>
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          accessibility={accessibility}
          setAccessibility={setAccessibility}
          onOpenSearch={() => setCurrentTab('catalog')}
          onOpenPWAInstall={() => setIsPWAModalOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {currentTab === 'catalog' && (
            <CatalogView
              courses={courses}
              onSelectCourse={handleSelectCourse}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {currentTab === 'player' && (
            <PlayerView
              course={selectedCourse}
              onBackToCatalog={() => setCurrentTab('catalog')}
              onOpenExam={() => setIsExamOpen(true)}
              onCompleteLesson={handleCompleteLesson}
            />
          )}

          {currentTab === 'certificates' && (
            <CertificatesView certificates={certificates} />
          )}

          {currentTab === 'progress' && (
            <ProgressView
              courses={courses}
              certificates={certificates}
              onSelectCourse={handleSelectCourse}
            />
          )}
        </main>
      </div>

      {/* Exam Modal */}
      {isExamOpen && (
        <QuizModal
          course={selectedCourse}
          isOpen={isExamOpen}
          onClose={() => setIsExamOpen(false)}
          onCompleteExam={handleCompleteExam}
        />
      )}

      {/* PWA Install Modal with Device Detector */}
      <PWAInstallModal
        isOpen={isPWAModalOpen}
        onClose={() => setIsPWAModalOpen(false)}
      />

      <BottomNavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {accessibility.vlibrasActive && <LibrasWidget />}
    </div>
  );
};

export default App;
