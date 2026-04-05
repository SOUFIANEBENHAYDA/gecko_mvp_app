import React from 'react';

const LandingPage = ({ user, onLogout, onCreateFacture }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .lp-body { font-family: 'DM Sans', sans-serif; }
        .lp-body h1, .lp-body h2, .lp-body h3 { font-family: 'Sora', sans-serif; }

        .grid-bg-lp {
          background-color: #0f2559;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .nav-glass-lp {
          background: rgba(11,30,74,0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky; top: 0; z-index: 50;
        }
        .lp-orb {
          position: absolute; border-radius: 50%;
          filter: blur(90px); pointer-events: none;
        }
        .badge-lp {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(201,151,58,0.12);
          border: 1px solid rgba(201,151,58,0.28);
          color: #e0b55a;
          font-family: 'Sora', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
          padding: 5px 12px; border-radius: 999px;
        }
        .stat-card-lp {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 22px 18px;
          text-align: center;
        }
        .feature-card-lp {
          background: #fff;
          border: 1px solid rgba(30,58,138,0.08);
          border-radius: 20px;
          padding: 36px 30px;
          text-align: center;
          box-shadow: 0 4px 24px rgba(30,58,138,0.07);
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          position: relative; overflow: hidden;
          flex: 1; min-width: 260px;
        }
        .feature-card-lp::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #2d58c8, #1e3a8a);
          opacity: 0; transition: opacity 0.3s;
        }
        .feature-card-lp:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 48px rgba(30,58,138,0.13);
          border-color: rgba(30,58,138,0.15);
        }
        .feature-card-lp:hover::before { opacity: 1; }
        .icon-wrap-lp {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(45,88,200,0.1), rgba(30,58,138,0.06));
          border: 1px solid rgba(30,58,138,0.1);
          margin: 0 auto 20px;
          font-size: 26px;
        }
        .btn-primary-lp {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #2d58c8 0%, #1e3a8a 100%);
          color: #fff; font-family: 'Sora', sans-serif; font-weight: 600;
          padding: 12px 24px; border-radius: 12px;
          box-shadow: 0 6px 24px rgba(30,58,138,0.3);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          border: none; cursor: pointer; font-size: 14.5px; text-decoration: none;
        }
        .btn-primary-lp:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(30,58,138,0.4);
          background: linear-gradient(135deg, #3262d8 0%, #243ea0 100%);
        }
        .btn-disabled-lp {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.3);
          font-family: 'Sora', sans-serif; font-weight: 600;
          padding: 12px 24px; border-radius: 12px;
          font-size: 14px; cursor: not-allowed;
        }
        .btn-outline-lp {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.85);
          font-family: 'Sora', sans-serif; font-weight: 500;
          padding: 9px 18px; border-radius: 10px;
          cursor: pointer; font-size: 14px; transition: all 0.2s;
        }
        .btn-outline-lp:hover {
          background: rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up-lp { animation: fadeUp 0.6s ease forwards; }
        .d1 { animation-delay: 0.05s; opacity: 0; }
        .d2 { animation-delay: 0.15s; opacity: 0; }
        .d3 { animation-delay: 0.25s; opacity: 0; }
        .d4 { animation-delay: 0.35s; opacity: 0; }
        .d5 { animation-delay: 0.45s; opacity: 0; }
      `}</style>

      <div className="lp-body" style={{ minHeight: '100vh', background: '#f8fafc' }}>

        {/* ── Navbar ── */}
        <nav className="nav-glass-lp">
          <div style={{
            maxWidth: 1200, margin: '0 auto', padding: '0 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
          }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg,#2d58c8,#1e3a8a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>
                GECKO
              </span>
            </div>

            {/* User + Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 400, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Espace
                </div>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, fontFamily: "'Sora',sans-serif" }}>
                  {user.companyName}
                </div>
              </div>
              <button className="btn-outline-lp" onClick={onLogout}>
                Déconnexion
              </button>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="grid-bg-lp" style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 100px' }}>
          <div className="lp-orb" style={{ width: 500, height: 500, background: 'rgba(45,88,200,0.2)', top: -130, right: -100 }} />
          <div className="lp-orb" style={{ width: 280, height: 280, background: 'rgba(201,151,58,0.1)', bottom: 20, left: -60 }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div className="fade-up-lp d1" style={{ marginBottom: 16 }}>
              <span className="badge-lp">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e0b55a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Bienvenue sur votre espace GECKO
              </span>
            </div>

            <h1 className="fade-up-lp d2" style={{
              fontFamily: "'Sora',sans-serif", fontSize: 'clamp(32px,5vw,52px)',
              fontWeight: 800, color: '#fff', letterSpacing: '-0.03em',
              lineHeight: 1.15, margin: '0 0 16px', maxWidth: 640,
            }}>
              Bonjour,{' '}
              <span style={{ background: 'linear-gradient(90deg,#5b8aff,#8ab4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {user.companyName}
              </span>
            </h1>

            <p className="fade-up-lp d3" style={{
              fontSize: 17, color: 'rgba(255,255,255,0.60)', fontWeight: 300,
              lineHeight: 1.7, maxWidth: 520, margin: '0 0 48px',
            }}>
              Votre plateforme de facturation conforme à la{' '}
              <strong style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 500 }}>réforme DGI 2026</strong>.
              Générez vos factures UBL&nbsp;2.1 XML en quelques clics.
            </p>

            {/* Stats */}
            <div className="fade-up-lp d4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { value: '0', label: 'Factures créées' },
                { value: '0 MAD', label: 'Total généré' },
                { value: '100%', label: 'Conformité DGI' },
              ].map((s) => (
                <div key={s.label} className="stat-card-lp" style={{ minWidth: 130 }}>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* wave bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
              <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 0C480 0 240 60 0 20L0 60Z" fill="#f8fafc"/>
            </svg>
          </div>
        </section>

        {/* ── Feature Cards ── */}
        <section style={{ padding: '72px 24px', background: '#f8fafc' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="fade-up-lp d5" style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(30,58,138,0.07)',
                border: '1px solid rgba(30,58,138,0.12)',
                color: '#1e3a8a',
                fontFamily: "'Sora',sans-serif",
                fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                padding: '5px 14px', borderRadius: 999, marginBottom: 16, textTransform: 'uppercase',
              }}>
                Fonctionnalités
              </div>
              <h2 style={{
                fontFamily: "'Sora',sans-serif", fontSize: 'clamp(24px,3.5vw,36px)',
                fontWeight: 800, color: '#0f2559', letterSpacing: '-0.03em', margin: '0 0 12px',
              }}>
                Que souhaitez-vous faire&nbsp;?
              </h2>
              <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
                Gérez votre facturation en toute conformité avec les normes DGI 2026.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>

              {/* Create Invoice */}
              <div className="feature-card-lp">
                <div className="icon-wrap-lp">📄</div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: '#0f2559', marginBottom: 12 }}>
                  Créer une Facture
                </h3>
                <p style={{ color: '#64748b', fontSize: 14.5, lineHeight: 1.65, marginBottom: 28 }}>
                  Générez une facture conforme aux normes DGI avec XML UBL&nbsp;2.1 et signature électronique certifiée.
                </p>
                <button className="btn-primary-lp" onClick={onCreateFacture}>
                  Commencer
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>

              {/* Quick Invoice */}
              <div className="feature-card-lp">
                <div className="icon-wrap-lp">⚡</div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: '#0f2559', marginBottom: 12 }}>
                  Facture Rapide
                </h3>
                <p style={{ color: '#64748b', fontSize: 14.5, lineHeight: 1.65, marginBottom: 28 }}>
                  Générez rapidement une facture avec les paramètres par défaut pré-configurés de votre entreprise.
                </p>
                <span className="btn-disabled-lp">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Bientôt disponible
                </span>
              </div>

              {/* History */}
              <div className="feature-card-lp">
                <div className="icon-wrap-lp">📊</div>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 700, color: '#0f2559', marginBottom: 12 }}>
                  Historique
                </h3>
                <p style={{ color: '#64748b', fontSize: 14.5, lineHeight: 1.65, marginBottom: 28 }}>
                  Consultez l'historique de toutes vos factures et téléchargez les fichiers XML DGI certifiés.
                </p>
                <span className="btn-disabled-lp">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Bientôt disponible
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ background: '#0b1e4a', padding: '36px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'linear-gradient(135deg,#2d58c8,#1e3a8a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: '#fff' }}>
                GECKO
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              © 2025 GECKO — Conforme <strong style={{ color: 'rgba(255,255,255,0.45)' }}>DGI & CNDP (Loi 09-08)</strong>
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              color: '#4ade80', fontFamily: "'Sora',sans-serif", fontSize: 11, fontWeight: 600,
              padding: '4px 12px', borderRadius: 999,
            }}>
              <span style={{ width: 6, height: 6, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
              Système opérationnel
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default LandingPage;