import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { LibrasWidget } from './components/LibrasWidget';
import { QuizModal } from './components/QuizModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { InfoModal } from './components/InfoModal';
import { CatalogView } from './views/CatalogView';
import { PlayerView } from './views/PlayerView';
import { CertificatesView } from './views/CertificatesView';
import { ProgressView } from './views/ProgressView';
import { INITIAL_COURSES, INITIAL_CERTIFICATES } from './data/coursesData';
import type { Course, Certificate, AccessibilitySettings } from './types';
import { tts } from './utils/ttsEngine';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'catalog' | 'player' | 'certificates' | 'progress'>('catalog');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [selectedCourse, setSelectedCourse] = useState<Course>(INITIAL_COURSES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Auth State
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isPWAModalOpen, setIsPWAModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'terms' | 'support' | 'about' | null>(null);
  
  // Session State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!Cookies.get('auth_token') || !!Cookies.get('user_name');
  });
  const [userName, setUserName] = useState<string>(() => {
    return Cookies.get('user_name') || 'Thiago Ventura';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return Cookies.get('user_email') || 'thiago@recifedigital.pe.gov.br';
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const savedContrast = Cookies.get('acc_high_contrast') === 'true';
    const savedScale = parseFloat(Cookies.get('acc_font_scale') || '1');
    const savedTTS = Cookies.get('acc_tts') === 'true';
    return {
      highContrast: savedContrast,
      fontScale: isNaN(savedScale) ? 1 : savedScale,
      vlibrasActive: true,
      audioDescription: savedTTS
    };
  });

  useEffect(() => {
    if (accessibility.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    document.documentElement.style.setProperty('--font-scale', accessibility.fontScale.toString());

    Cookies.set('acc_high_contrast', accessibility.highContrast.toString(), { expires: 30 });
    Cookies.set('acc_font_scale', accessibility.fontScale.toString(), { expires: 30 });
    Cookies.set('acc_tts', accessibility.audioDescription.toString(), { expires: 30 });
  }, [accessibility]);

  // Read screen content out loud automatically when changing tabs if TTS is enabled
  useEffect(() => {
    if (accessibility.audioDescription) {
      let announcement = '';
      if (currentTab === 'catalog') {
        announcement = 'Você está na página de Catálogo de Cursos do Recife Digital. Explore cursos básicos e intermediários.';
      } else if (currentTab === 'player') {
        announcement = `Você está assistindo à aula do curso ${selectedCourse.title}.`;
      } else if (currentTab === 'certificates') {
        announcement = `Página de Meus Certificados. Você possui ${certificates.length} certificado emitido.`;
      } else if (currentTab === 'progress') {
        announcement = 'Página do seu Progresso. Veja suas horas estudadas e desempenho.';
      }
      tts.speak(announcement);
    }
  }, [currentTab, accessibility.audioDescription]);

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
    if (accessibility.audioDescription) {
      tts.speak(`Curso selecionado: ${course.title}. ${course.description}`);
    }
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
      studentName: userName || 'Thiago Ventura'
    };

    setCertificates(prev => [newCert, ...prev]);
    setIsExamOpen(false);
    setCurrentTab('certificates');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on serverless fallback
    }
    Cookies.remove('auth_token');
    Cookies.remove('user_name');
    Cookies.remove('user_email');
    setIsLoggedIn(false);
    setUserName('');
    setUserEmail('');
  };

  const handleLoginSuccess = (name: string, email: string) => {
    setUserName(name);
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  return (
    <div className="app-container">
      <div>
        <Header
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          accessibility={accessibility}
          setAccessibility={setAccessibility}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenPWAInstall={() => setIsPWAModalOpen(true)}
          onOpenAuth={mode => {
            setAuthMode(mode);
            setIsAuthModalOpen(true);
          }}
          isLoggedIn={isLoggedIn}
          userName={userName}
          userEmail={userEmail}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
          {currentTab === 'catalog' && (
            <CatalogView
              courses={courses}
              onSelectCourse={handleSelectCourse}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenInfo={type => setInfoModalType(type)}
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

      {/* Interactive Modals */}
      {isExamOpen && (
        <QuizModal
          course={selectedCourse}
          isOpen={isExamOpen}
          onClose={() => setIsExamOpen(false)}
          onCompleteExam={handleCompleteExam}
        />
      )}

      <PWAInstallModal
        isOpen={isPWAModalOpen}
        onClose={() => setIsPWAModalOpen(false)}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        courses={courses}
        onSelectCourse={handleSelectCourse}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <InfoModal
        isOpen={infoModalType !== null}
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      <BottomNavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {accessibility.vlibrasActive && <LibrasWidget />}
    </div>
  );
};

export default App;
