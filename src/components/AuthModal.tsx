import React, { useState, useEffect } from 'react';
import { X, UserCheck, LogIn, AlertCircle } from 'lucide-react';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const contentType = res.headers.get('content-type');
      let data: any = {};

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Resposta inválida do servidor: ${text.substring(0, 100)}`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.details || 'Falha ao autenticar no banco de dados.');
      }

      // Successful Registration or Login
      const loggedUser = data.user?.name || name || email.split('@')[0];
      const loggedEmail = data.user?.email || email;

      // Save token and info in Cookies & LocalStorage
      Cookies.set('user_name', loggedUser, { expires: 7 });
      Cookies.set('user_email', loggedEmail, { expires: 7 });
      if (data.token) {
        Cookies.set('auth_token', data.token, { expires: 7 });
        localStorage.setItem('auth_token', data.token);
      }
      localStorage.setItem('user_name', loggedUser);
      localStorage.setItem('user_email', loggedEmail);

      setSuccessMessage(`✓ ${data.message || 'Autenticado com sucesso!'}`);
      setTimeout(() => {
        onLoginSuccess(loggedUser, loggedEmail);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Auth Error:', err);
      setErrorMessage(err.message || 'Ocorreu um erro ao conectar-se ao servidor.');
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
            {mode === 'login' ? 'Entrar no Recife Digital' : 'Criar Conta no NeonDB'}
          </h3>
        </div>

        {/* Tab switch */}
        <div className="auth-tab-group">
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
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

          {errorMessage && (
            <div style={{ padding: 12, borderRadius: 12, background: '#FFE4E6', border: '1px solid #FECDD3', color: '#9F1239', fontSize: '0.75rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div style={{ padding: 12, borderRadius: 12, background: '#D1FAE5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '0.75rem', fontWeight: 700, marginBottom: 16 }}>
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-card-action"
            style={{ padding: '12px 20px', fontSize: '0.85rem' }}
          >
            {mode === 'login' ? <LogIn style={{ width: 18, height: 18 }} /> : <UserCheck style={{ width: 18, height: 18 }} />}
            <span>{loading ? 'Salvando no NeonDB...' : mode === 'login' ? 'ENTRAR NA CONTA' : 'CRIAR MINHA CONTA'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
