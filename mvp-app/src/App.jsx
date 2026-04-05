import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import FactureCreation from './components/FactureCreation';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login'); // login, landing, facture

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('landing');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const goToFactureCreation = () => {
    setCurrentPage('facture');
  };

  const goToLanding = () => {
    setCurrentPage('landing');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage 
          user={user} 
          onLogout={handleLogout}
          onCreateFacture={goToFactureCreation}
        />
      )}
      {currentPage === 'facture' && (
        <FactureCreation 
          user={user} 
          onBack={goToLanding}
        />
      )}
    </>
  );
};

export default App;