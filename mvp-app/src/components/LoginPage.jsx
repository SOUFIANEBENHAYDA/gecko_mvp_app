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

    // Basic validation
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

    // Simulate API call
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

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#333',
    },
    logo: {
      fontSize: '48px',
      marginBottom: '10px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#667eea',
      margin: 0,
    },
    subtitle: {
      fontSize: '14px',
      color: '#999',
      margin: '5px 0 0 0',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#333',
      fontWeight: 'bold',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '10px',
    },
    error: {
      backgroundColor: '#fee',
      color: '#c33',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '20px',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>🦎</div>
          <h1 style={styles.title}>GECKO</h1>
          <p style={styles.subtitle}>Conformité DGI 2026</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom de l'Entreprise</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Ex: Mon Entreprise SARL"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Mot de Passe</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#999',
          fontSize: '12px',
        }}>
          Version Beta. Données de test non persistantes.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
