import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const FactureCreation = ({ user, onBack }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientIce: '',
    clientEmail: '',
    clientTelephone: '',
    clientAdresse: '',
    amountHt: '',
    tvaRate: '20',
    description: 'Vente TPE',
  });

  const [isValidating, setIsValidating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [xmlData, setXmlData] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [error, setError] = useState('');

  const generateInvoiceNumber = () => {
    return `GCK-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const generateUBLXml = (data, validationId, invoiceNumber) => {
    const tvaAmount = (parseFloat(data.amountHt) * parseFloat(data.tvaRate)) / 100;
    const totalTTC = parseFloat(data.amountHt) + tvaAmount;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2">
    <cbc:ID>${invoiceNumber}</cbc:ID>
    <cbc:UUID>${validationId}</cbc:UUID>
    <cbc:IssueDate>${new Date().toISOString().split('T')[0]}</cbc:IssueDate>
    <cbc:IssueTime>${new Date().toISOString().split('T')[1]}</cbc:IssueTime>
    <cbc:DocumentCurrencyCode>MAD</cbc:DocumentCurrencyCode>
    
    <!-- Supplier -->
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyName>
                <cbc:Name>${user.companyName}</cbc:Name>
            </cac:PartyName>
            <cac:PartyIdentification>
                <cbc:ID schemeID="ICE">123456789012345</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>123456789012345</cbc:CompanyID>
            </cac:PartyTaxScheme>
            <cac:Contact>
                <cbc:Telephone>${user.companyName}</cbc:Telephone>
                <cbc:ElectronicMail>contact@company.com</cbc:ElectronicMail>
            </cac:Contact>
        </cac:Party>
    </cac:AccountingSupplierParty>

    <!-- Customer -->
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyName>
                <cbc:Name>${data.clientName}</cbc:Name>
            </cac:PartyName>
            <cac:PartyIdentification>
                <cbc:ID schemeID="ICE">${data.clientIce}</cbc:ID>
            </cac:PartyIdentification>
            <cac:PostalAddress>
                <cbc:StreetName>${data.clientAdresse}</cbc:StreetName>
            </cac:PostalAddress>
            <cac:Contact>
                <cbc:Telephone>${data.clientTelephone}</cbc:Telephone>
                <cbc:ElectronicMail>${data.clientEmail}</cbc:ElectronicMail>
            </cac:Contact>
        </cac:Party>
    </cac:AccountingCustomerParty>

    <!-- Line Items -->
    <cac:InvoiceLine>
        <cbc:ID>1</cbc:ID>
        <cbc:LineExtensionAmount currencyID="MAD">${data.amountHt}</cbc:LineExtensionAmount>
        <cac:Item>
            <cbc:Name>${data.description}</cbc:Name>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="MAD">${data.amountHt}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>

    <!-- Totals -->
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="MAD">${data.amountHt}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="MAD">${data.amountHt}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="MAD">${totalTTC}</cbc:TaxInclusiveAmount>
        <cbc:PayableAmount currencyID="MAD">${totalTTC}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>

    <!-- Tax Total -->
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="MAD">${tvaAmount}</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="MAD">${data.amountHt}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="MAD">${tvaAmount}</cbc:TaxAmount>
            <cac:TaxCategory>
                <cbc:ID>${data.tvaRate === '20' ? 'S' : 'R'}</cbc:ID>
                <cbc:Percent>${data.tvaRate}</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>
</Invoice>`;

    return xml;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.clientName.trim()) {
      setError('Le nom du client est requis');
      return false;
    }
    if (formData.clientIce.length !== 15) {
      setError('L\'ICE doit contenir exactement 15 chiffres');
      return false;
    }
    if (!formData.clientEmail.includes('@')) {
      setError('Email invalide');
      return false;
    }
    if (formData.clientTelephone.length < 10) {
      setError('Téléphone invalide (minimum 10 chiffres)');
      return false;
    }
    if (!formData.clientAdresse.trim()) {
      setError('L\'adresse est requise');
      return false;
    }
    if (!formData.amountHt || parseFloat(formData.amountHt) <= 0) {
      setError('Le montant HT doit être positif');
      return false;
    }
    return true;
  };

  const handleValidation = (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsValidating(true);
    setValidationMessage('');

    // Simulate validation
    setTimeout(() => {
      const invoiceNumber = generateInvoiceNumber();
      const validationId = "MA-DGI-" + Math.random().toString(36).toUpperCase().substring(2, 10);
      const xml = generateUBLXml(formData, validationId, invoiceNumber);

      setLastInvoice({ ...formData, validationId, invoiceNumber });
      setXmlData(xml);
      setValidationMessage('✅ Facture validée avec succès par la DGI');
      setIsValidating(false);
    }, 2500);
  };

  const sendToApi = async () => {
    if (!lastInvoice) {
      setError('Veuillez d\'abord valider la facture');
      return;
    }

    setIsSending(true);
    setError('');

    try {
      // Prepare data for API
      const apiPayload = {
        invoiceNumber: lastInvoice.invoiceNumber,
        validationId: lastInvoice.validationId,
        clientName: formData.clientName,
        clientIce: formData.clientIce,
        clientEmail: formData.clientEmail,
        clientTelephone: formData.clientTelephone,
        clientAdresse: formData.clientAdresse,
        amountHt: formData.amountHt,
        tvaRate: formData.tvaRate,
        timestamp: new Date().toISOString(),
        xmlData: xmlData
      };

      // Mock API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would send to your backend:
      // const response = await fetch('https://your-api.com/factures', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(apiPayload)
      // });

      setValidationMessage('✅ Facture envoyée avec succès à l\'API DGI');
      setIsSending(false);

      // Log to console (for testing)
      console.log('API Payload:', apiPayload);

    } catch (err) {
      setError('Erreur lors de l\'envoi à l\'API: ' + err.message);
      setIsSending(false);
    }
  };

  const downloadPdf = () => {
    if (!lastInvoice) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;
    const lineHeight = 10;

    // Title
    doc.setFontSize(24);
    doc.setTextColor(102, 126, 234);
    doc.text('GECKO 🦎', 20, yPosition);

    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;
    doc.text('FACTURE', 20, yPosition);

    yPosition += 15;
    doc.setFontSize(10);

    // Invoice Info
    doc.setTextColor(100, 100, 100);
    doc.text(`Numéro: ${lastInvoice.invoiceNumber}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Validation DGI: ${lastInvoice.validationId}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, yPosition);

    yPosition += 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    // Supplier Section
    yPosition += 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Fournisseur:', 20, yPosition);
    yPosition += lineHeight;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(user.companyName, 20, yPosition);
    yPosition += lineHeight;
    doc.text('123456789012345', 20, yPosition);

    // Customer Section
    yPosition += 15;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Client:', pageWidth / 2, yPosition);
    yPosition += lineHeight;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(formData.clientName, pageWidth / 2, yPosition);
    yPosition += lineHeight;
    doc.text(`ICE: ${formData.clientIce}`, pageWidth / 2, yPosition);
    yPosition += lineHeight;
    doc.text(`Email: ${formData.clientEmail}`, pageWidth / 2, yPosition);
    yPosition += lineHeight;
    doc.text(`Téléphone: ${formData.clientTelephone}`, pageWidth / 2, yPosition);
    yPosition += lineHeight;
    doc.text(`Adresse: ${formData.clientAdresse}`, pageWidth / 2, yPosition);

    // Details Section
    yPosition += 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Description', 20, yPosition);
    doc.text('Montant', 100, yPosition);
    doc.text('TVA', 130, yPosition);
    doc.text('Total', 160, yPosition);

    yPosition += lineHeight;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const tvaAmount = (parseFloat(formData.amountHt) * parseFloat(formData.tvaRate)) / 100;
    const totalTTC = parseFloat(formData.amountHt) + tvaAmount;

    doc.text(formData.description, 20, yPosition);
    doc.text(`${formData.amountHt} MAD`, 100, yPosition);
    doc.text(`${tvaAmount.toFixed(2)} MAD`, 130, yPosition);
    doc.text(`${totalTTC.toFixed(2)} MAD`, 160, yPosition);

    // Summary
    yPosition += 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, pageWidth - 20, yPosition);

    yPosition += 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Montant HT: ${formData.amountHt} MAD`, 100, yPosition);
    yPosition += lineHeight;
    doc.text(`TVA (${formData.tvaRate}%): ${tvaAmount.toFixed(2)} MAD`, 100, yPosition);
    yPosition += lineHeight;
    doc.setFontSize(12);
    doc.setTextColor(102, 126, 234);
    doc.text(`Total TTC: ${totalTTC.toFixed(2)} MAD`, 100, yPosition);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Conforme aux normes DGI 2026 - UBL 2.1', 20, doc.internal.pageSize.getHeight() - 20);

    doc.save(`facture-${lastInvoice.invoiceNumber}.pdf`);
  };

  const downloadXml = () => {
    if (!xmlData) return;
    const element = document.createElement('a');
    const file = new Blob([xmlData], { type: 'text/xml' });
    element.href = URL.createObjectURL(file);
    element.download = `facture-${lastInvoice.invoiceNumber}.xml`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      color: 'white',
    },
    backButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '1px solid white',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    mainContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '30px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '20px',
      paddingBottom: '10px',
      borderBottom: '2px solid #667eea',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#333',
      fontWeight: 'bold',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
    },
    buttonSecondary: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#999',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
    },
    xmlBox: {
      backgroundColor: '#1a252f',
      padding: '15px',
      borderRadius: '4px',
      overflowX: 'auto',
      fontSize: '11px',
      color: '#3498db',
      maxHeight: '300px',
      overflowY: 'auto',
      marginTop: '15px',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '15px',
      fontSize: '14px',
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '15px',
      fontSize: '14px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px',
      marginBottom: '20px',
    },
    statItem: {
      backgroundColor: '#f0f0f0',
      padding: '15px',
      borderRadius: '4px',
      textAlign: 'center',
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#667eea',
    },
    statLabel: {
      fontSize: '12px',
      color: '#999',
      marginTop: '5px',
    },
    responsiveContainer: {
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h1 style={{ margin: 0, color: 'white' }}>📄 Créer une Facture</h1>
        <button 
          style={styles.backButton}
          onClick={onBack}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        >
          ← Retour
        </button>
      </div>

      <div style={styles.mainContainer}>
        {/* Left Column - Form */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Nouvelle Vente (TPE)</h2>

          {error && <div style={styles.errorMessage}>{error}</div>}
          {validationMessage && <div style={styles.successMessage}>{validationMessage}</div>}

          <form onSubmit={handleValidation}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nom du Client</label>
              <input 
                style={styles.input}
                type="text"
                name="clientName"
                placeholder="Nom de l'entreprise client"
                value={formData.clientName}
                onChange={handleInputChange}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>ICE Client (15 chiffres)</label>
              <input 
                style={styles.input}
                type="text"
                name="clientIce"
                placeholder="Ex: 123456789012345"
                value={formData.clientIce}
                onChange={handleInputChange}
                maxLength="15"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Client</label>
              <input 
                style={styles.input}
                type="email"
                name="clientEmail"
                placeholder="client@email.com"
                value={formData.clientEmail}
                onChange={handleInputChange}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Téléphone Client</label>
              <input 
                style={styles.input}
                type="tel"
                name="clientTelephone"
                placeholder="Ex: +212612345678"
                value={formData.clientTelephone}
                onChange={handleInputChange}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Adresse Client</label>
              <input 
                style={styles.input}
                type="text"
                name="clientAdresse"
                placeholder="Adresse complète"
                value={formData.clientAdresse}
                onChange={handleInputChange}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Montant HT (MAD)</label>
              <input 
                style={styles.input}
                type="number"
                name="amountHt"
                placeholder="Ex: 1000"
                value={formData.amountHt}
                onChange={handleInputChange}
                step="0.01"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>TVA 2026</label>
              <select 
                style={styles.input}
                name="tvaRate"
                value={formData.tvaRate}
                onChange={handleInputChange}
              >
                <option value="20">20% (Standard)</option>
                <option value="10">10% (Réduit)</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <input 
                style={styles.input}
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <button 
              type="submit" 
              style={styles.button}
              disabled={isValidating}
              onMouseOver={(e) => !isValidating && (e.target.style.backgroundColor = '#5568d3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#667eea')}
            >
              {isValidating ? '⏳ Validation DGI...' : '✓ Générer XML & Valider'}
            </button>
          </form>
        </div>

        {/* Right Column - Preview & Actions */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Aperçu & Téléchargement</h2>

          {lastInvoice ? (
            <div>
              <div style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>Montant HT</div>
                  <div style={styles.statValue}>{formData.amountHt} MAD</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>TVA ({formData.tvaRate}%)</div>
                  <div style={styles.statValue}>
                    {((parseFloat(formData.amountHt) * parseFloat(formData.tvaRate)) / 100).toFixed(2)} MAD
                  </div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>Total TTC</div>
                  <div style={styles.statValue} style={{color: '#28a745'}}>
                    {(parseFloat(formData.amountHt) * (1 + parseFloat(formData.tvaRate) / 100)).toFixed(2)} MAD
                  </div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statLabel}>Validation</div>
                  <div style={styles.statValue} style={{color: '#28a745'}}>✓ DGI</div>
                </div>
              </div>

              <div style={{marginBottom: '15px'}}>
                <h4 style={{color: '#333', marginBottom: '10px'}}>Numéro de Facture:</h4>
                <div style={{
                  backgroundColor: '#f0f0f0',
                  padding: '10px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#667eea'
                }}>
                  {lastInvoice.invoiceNumber}
                </div>
              </div>

              <div style={{marginBottom: '15px'}}>
                <h4 style={{color: '#333', marginBottom: '10px'}}>ID de Validation DGI:</h4>
                <div style={{
                  backgroundColor: '#f0f0f0',
                  padding: '10px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#28a745'
                }}>
                  {lastInvoice.validationId}
                </div>
              </div>

              <div>
                <h4 style={{color: '#333', marginBottom: '10px'}}>XML (UBL 2.1):</h4>
                <div style={styles.xmlBox}>
                  <pre style={{margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                    {xmlData}
                  </pre>
                </div>
              </div>

              <button 
                onClick={downloadXml}
                style={{...styles.button, backgroundColor: '#17a2b8'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
              >
                📥 Télécharger XML
              </button>

              <button 
                onClick={downloadPdf}
                style={{...styles.button, backgroundColor: '#28a745'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                📄 Télécharger PDF
              </button>

              <button 
                onClick={sendToApi}
                style={{...styles.button, backgroundColor: '#ffc107', color: '#333'}}
                disabled={isSending}
                onMouseOver={(e) => !isSending && (e.target.style.backgroundColor = '#ffb300')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#ffc107')}
              >
                {isSending ? '📤 Envoi en cours...' : '📤 Envoyer à l\'API DGI'}
              </button>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#999'
            }}>
              <p style={{fontSize: '16px', margin: 0}}>👈 Remplissez le formulaire et cliquez sur</p>
              <p style={{fontSize: '14px', margin: '10px 0 0 0'}}>« Générer XML & Valider »</p>
              <p style={{fontSize: '12px', margin: '20px 0 0 0', opacity: 0.7}}>
                pour générer votre facture conforme aux normes DGI 2026.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FactureCreation;
