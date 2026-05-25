import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/api';
import './Auth.css';

/**
 * Auth page with dual views: Login and Register.
 * Users choose their role (Cliente / Empresa) before authentication.
 */
export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState(0);       // 0 = Client, 1 = Company
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;

      if (mode === 'register') {
        response = await authApi.register({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: parseInt(phone, 10),
          role,
        });
      } else {
        response = await authApi.login({
          email: email.trim().toLowerCase(),
          password,
        });
      }

      login(response);
      // Redirect based on role: Company → dashboard, Client → report form
      const destination = response.role === 'Company' ? '/dashboard' : '/report';
      navigate(destination);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* ── Brand ────────────────────────────────────── */}
        <div className="auth-brand">
          <h1 className="auth-logo">RPA</h1>
          <p className="auth-subtitle">
            Reporte problemas de acessibilidade e ajude a tornar sua cidade mais inclusiva.
          </p>
        </div>

        {/* ── Role Selector (only shown in register mode) ── */}
        {mode === 'register' && (
          <div className="auth-role-selector" role="tablist" aria-label="Tipo de acesso">
            <button
              className={`role-tab ${role === 0 ? 'active' : ''}`}
              onClick={() => setRole(0)}
              role="tab"
              aria-selected={role === 0}
              id="tab-client"
            >
              👤 Acesso Cliente
            </button>
            <button
              className={`role-tab ${role === 1 ? 'active' : ''}`}
              onClick={() => setRole(1)}
              role="tab"
              aria-selected={role === 1}
              id="tab-company"
            >
              🏢 Acesso Empresa
            </button>
          </div>
        )}

        {/* ── Mode Toggle ──────────────────────────────── */}
        <div className="auth-mode-toggle">
          <button
            className={`mode-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
            id="mode-login"
          >
            Entrar
          </button>
          <button
            className={`mode-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
            id="mode-register"
          >
            Cadastrar
          </button>
        </div>

        {/* ── Form ─────────────────────────────────────── */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="glass-card">
            <div className="auth-form-fields stagger">
              {mode === 'register' && (
                <div className="form-group animate-fade-in-up">
                  <label className="form-label" htmlFor="input-fullname">Nome completo</label>
                  <input
                    id="input-fullname"
                    className="form-input"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    maxLength={150}
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="form-group animate-fade-in-up">
                <label className="form-label" htmlFor="input-email">E-mail</label>
                <input
                  id="input-email"
                  className="form-input"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={100}
                  autoComplete="email"
                />
              </div>

              <div className="form-group animate-fade-in-up">
                <label className="form-label" htmlFor="input-password">Senha</label>
                <input
                  id="input-password"
                  className="form-input"
                  type="password"
                  placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Sua senha'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === 'register' ? 6 : undefined}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                />
              </div>

              {mode === 'register' && (
                <div className="form-group animate-fade-in-up">
                  <label className="form-label" htmlFor="input-phone">Telefone</label>
                  <input
                    id="input-phone"
                    className="form-input"
                    type="tel"
                    placeholder="11999999999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    required
                    pattern="[0-9]+"
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && <div className="auth-error">{error}</div>}

          {/* Submit button */}
          <button
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
            id="btn-submit"
          >
            {loading ? (
              <span className="spinner" />
            ) : mode === 'login' ? (
              'Entrar'
            ) : (
              'Criar conta'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
