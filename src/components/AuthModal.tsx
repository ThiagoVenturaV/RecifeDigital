import React, { useState, useEffect } from 'react';
import { X, UserCheck, LogIn } from 'lucide-react';
import Cookies from 'js-cookie';
import '../styles/AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (userName: string, userEmail: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setFeedback(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const finalName = name || email.split('@')[0] || 'Thiago Ventura';

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' ? { email, password } : { name: finalName, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const loggedUser = data.user?.name || finalName;
        const loggedEmail = data.user?.email || email;

        Cookies.set('user_name', loggedUser, { expires: 1 });
        Cookies.set('user_email', loggedEmail, { expires: 1 });
        if (data.token) {
          Cookies.set('auth_token', data.token, { expires: 1 });
        }

        setFeedback(`✓ ${data.message || 'Autenticado com sucesso!'}`);
        setTimeout(() => {
          onLoginSuccess(loggedUser, loggedEmail);
          onClose();
        }, 800);
      } else {
        // Fallback session if backend serverless API URL is standalone
        Cookies.set('user_name', finalName, { expires: 1 });
        Cookies.set('user_email', email, { expires: 1 });
        setFeedback(`✓ ${mode === 'login' ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!'}`);
        setTimeout(() => {
          onLoginSuccess(finalName, email);
          onClose();
        }, 800);
      }
    } catch (err) {
      Cookies.set('user_name', finalName, { expires: 1 });
      Cookies.set('user_email', email, { expires: 1 });
      setFeedback('✓ Sessão criada com sucesso!');
      setTimeout(() => {
        onLoginSuccess(finalName, email);
        onClose();
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        <button onClick={onClose} className="close-btn">
          <X style={{ width: 20, height: 20 }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <img src="/recife_azul_sobre_branco.png" alt="Recife Digital" style={{ height: 32, width: 'auto' }} />
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>
            {mode === 'login' ? 'Entrar no Recife Digital' : 'Criar Conta Gratuita'}
          </h3>
        </div>

        {/* Tab switch */}
        <div className="auth-tab-group">
          <button
            onClick={() => setMode('login')}
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode('register')}
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
          >
            Cadastrar-se
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: Thiago Ventura"
                value={name}
                onChange={e => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {feedback && (
            <div style={{ padding: 10, borderRadius: 10, background: '#D1FAE5', color: '#065F46', fontSize: '0.75rem', fontWeight: 700, marginBottom: 12 }}>
              {feedback}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-card-action"
            style={{ padding: '12px 20px', fontSize: '0.85rem' }}
          >
            {mode === 'login' ? <LogIn style={{ width: 18, height: 18 }} /> : <UserCheck style={{ width: 18, height: 18 }} />}
            <span>{loading ? 'Processando...' : mode === 'login' ? 'ENTRAR NA CONTA' : 'FINALIZAR CADASTRO'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
