import React from 'react';

const LandingPage = ({ user, onLogout, onCreateFacture }) => {
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
    },
    navbar: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      backdropFilter: 'blur(10px)',
    },
    logo: {
      fontSize: '28px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    logoutBtn: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '1px solid white',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s',
    },
    content: {
      padding: '60px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    hero: {
      color: 'white',
      textAlign: 'center',
      marginBottom: '60px',
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    heroSubtitle: {
      fontSize: '20px',
      opacity: 0.9,
      marginBottom: '30px',
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginBottom: '40px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
    },
    cardIcon: {
      fontSize: '48px',
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '15px',
    },
    cardDescription: {
      color: '#666',
      marginBottom: '25px',
      lineHeight: '1.6',
    },
    cardButton: {
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: '30px',
      borderRadius: '10px',
      backdropFilter: 'blur(10px)',
      color: 'white',
      marginBottom: '40px',
    },
    statBox: {
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    statLabel: {
      fontSize: '14px',
      opacity: 0.9,
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logo}>
          <span>🦎 GECKO</span>
        </div>
        <div style={styles.userInfo}>
          <div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Bienvenue!</div>
            <div style={{fontWeight: 'bold'}}>{user.companyName}</div>
          </div>
          <button 
            style={styles.logoutBtn}
            onClick={onLogout}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Bienvenue sur GECKO</h1>
          <p style={styles.heroSubtitle}>
            Votre plateforme de facturation conforme à la DGI 2026
          </p>
        </div>

        {/* Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>0</div>
            <div style={styles.statLabel}>Factures créées</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>0 MAD</div>
            <div style={styles.statLabel}>Total généré</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>100%</div>
            <div style={styles.statLabel}>Conformité DGI</div>
          </div>
        </div>

        {/* Features Cards */}
        <div style={styles.cardsContainer}>
          {/* Facture Card */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>📄</div>
            <h3 style={styles.cardTitle}>Créer une Facture</h3>
            <p style={styles.cardDescription}>
              Créez une facture conforme aux normes DGI avec XML et signature électronique.
            </p>
            <button 
              style={styles.cardButton}
              onClick={onCreateFacture}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5568d3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
            >
              Commencer
            </button>
          </div>

          {/* Quick Invoice Card */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>⚡</div>
            <h3 style={styles.cardTitle}>Facture Rapide</h3>
            <p style={styles.cardDescription}>
              Générez rapidement une facture avec les paramètres par défaut de votre entreprise.
            </p>
            <button 
              style={{...styles.cardButton, backgroundColor: '#999'}}
              disabled
            >
              Bientôt disponible
            </button>
          </div>

          {/* History Card */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>📊</div>
            <h3 style={styles.cardTitle}>Historique</h3>
            <p style={styles.cardDescription}>
              Consultez l'historique de toutes vos factures et téléchargez les fichiers XML.
            </p>
            <button 
              style={{...styles.cardButton, backgroundColor: '#999'}}
              disabled
            >
              Bientôt disponible
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
