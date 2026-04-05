import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password || !companyName) {
      setError('Tous les champs sont requis');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Email invalide');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        email,
        companyName,
        role: 'TPE'
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .login-body { font-family: 'DM Sans', sans-serif; }
        .login-body h1, .login-body h2, .login-body h3 { font-family: 'Sora', sans-serif; }

        .grid-bg-login {
          background-color: #0f2559;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .login-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .login-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 48px 40px;
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 10;
        }
        .login-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          transition: border-color 0.25s, background 0.25s;
          outline: none;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.35); }
        .login-input:focus {
          border-color: rgba(45,88,200,0.7);
          background: rgba(255,255,255,0.09);
        }
        .btn-primary-login {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2d58c8 0%, #1e3a8a 100%);
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 15px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(30,58,138,0.40);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          margin-top: 8px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(30,58,138,0.50);
          background: linear-gradient(135deg, #3262d8 0%, #243ea0 100%);
        }
        .btn-primary-login:disabled { opacity: 0.6; cursor: not-allowed; }
        .error-box {
          background: rgba(220,38,38,0.12);
          border: 1px solid rgba(220,38,38,0.3);
          color: #fca5a5;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 13.5px;
          display: flex; align-items: center; gap: 8px;
        }
        .badge-login {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(201,151,58,0.12);
          border: 1px solid rgba(201,151,58,0.28);
          color: #e0b55a;
          font-family: 'Sora', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
          padding: 5px 12px; border-radius: 999px;
          margin-bottom: 24px;
        }
        .login-label {
          display: block;
          margin-bottom: 8px;
          color: rgba(255,255,255,0.7);
          font-size: 13.5px;
          font-weight: 500;
        }
        .form-group { margin-bottom: 18px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeUp 0.6s ease forwards; }
      `}</style>

      <div
        className="login-body grid-bg-login"
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '20px',
        }}
      >
        {/* Orbs */}
        <div className="login-orb" style={{ width: 500, height: 500, background: 'rgba(45,88,200,0.22)', top: -150, right: -120 }} />
        <div className="login-orb" style={{ width: 280, height: 280, background: 'rgba(201,151,58,0.10)', bottom: 40, left: -60 }} />

        <div className="login-card fade-in">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {/* Logo mark */}
            <div style={{
              width: 52, height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg,#2d58c8,#1e3a8a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(30,58,138,0.4)',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>

            <h1 style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
              margin: '0 0 4px',
            }}>
              GECKO
            </h1>

            <div className="badge-login" style={{ margin: '10px auto 0', display: 'inline-flex' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e0b55a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Conformité DGI 2026
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="login-label">Nom de l'Entreprise</label>
              <input
                className="login-input"
                type="text"
                placeholder="Ex: Mon Entreprise SARL"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="login-label">Email</label>
              <input
                className="login-input"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="login-label">Mot de Passe</label>
              <input
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="btn-primary-login"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/>
                    <line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                  </svg>
                  Connexion en cours…
                </>
              ) : (
                <>
                  Se Connecter
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: 24,
            color: 'rgba(255,255,255,0.28)',
            fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Version Beta — Données de test non persistantes.
          </p>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
};

export default LoginPage;