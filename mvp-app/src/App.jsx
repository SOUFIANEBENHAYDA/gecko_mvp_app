import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const App = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    supplierIce: '123456789012345', 
    clientIce: '',
    amountHt: '',
    tvaRate: '20',
  });

  const [isValidating, setIsValidating] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);

  const generateUBLXml = (data, validationId) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
    <cbc:ID>GECKO-${Date.now()}</cbc:ID>
    <cbc:UUID>${validationId}</cbc:UUID>
    <cac:AccountingSupplierParty>
        <cbc:CompanyID schemeID="ICE">${data.supplierIce}</cbc:CompanyID>
    </cac:AccountingSupplierParty>
    <cac:AccountingCustomerParty>
        <cbc:CompanyID schemeID="ICE">${data.clientIce}</cbc:CompanyID>
    </cac:AccountingCustomerParty>
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="MAD">${(data.amountHt * data.tvaRate) / 100}</cbc:TaxAmount>
    </cac:TaxTotal>
</Invoice>`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.clientIce.length !== 15) {
      alert("Erreur: L'ICE doit contenir 15 chiffres.");
      return;
    }
    setIsValidating(true);
    setTimeout(() => {
      const validationId = "MA-DGI-" + Math.random().toString(36).toUpperCase().substring(2, 10);
      setLastInvoice({ ...formData, validationId });
      setIsValidating(false);
    }, 2000);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("GECKO - Facture 2026", 20, 20);
    doc.text(`Validation DGI: ${lastInvoice.validationId}`, 20, 40);
    doc.text(`ICE Client: ${lastInvoice.clientIce}`, 20, 50);
    doc.text(`Total TTC: ${parseFloat(lastInvoice.amountHt) * (1 + lastInvoice.tvaRate/100)} MAD`, 20, 70);
    doc.save("facture-gecko.pdf");
  };

  // Plain CSS Styles
  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' },
    header: { color: '#2ecc71', borderBottom: '2px solid #eee', paddingBottom: '10px' },
    flex: { display: 'flex', gap: '20px', marginTop: '20px' },
    card: { flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' },
    darkCard: { flex: 1, backgroundColor: '#2c3e50', color: 'white', padding: '20px', borderRadius: '8px' },
    input: { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' },
    button: { width: '100%', padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    xmlBox: { backgroundColor: '#1a252f', padding: '10px', borderRadius: '4px', overflowX: 'auto', fontSize: '12px', color: '#3498db' }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>GECKO 🦎 <span style={{fontSize: '14px', color: '#7f8c8d'}}>Conformité DGI 2026</span></h1>
      
      <div style={styles.flex}>
        <div style={styles.card}>
          <h3>Nouvelle Vente (TPE)</h3>
          <form onSubmit={handleSubmit}>
            <label>ICE Client (15 chiffres)</label>
            <input style={styles.input} type="text" placeholder="Ex: 123456789012345" onChange={e => setFormData({...formData, clientIce: e.target.value})} required />
            
            <label>Montant HT (MAD)</label>
            <input style={styles.input} type="number" onChange={e => setFormData({...formData, amountHt: e.target.value})} required />
            
            <label>TVA 2026</label>
            <select style={styles.input} onChange={e => setFormData({...formData, tvaRate: e.target.value})}>
              <option value="20">20% (Standard)</option>
              <option value="10">10% (Réduit)</option>
            </select>

            <button type="submit" style={styles.button} disabled={isValidating}>
              {isValidating ? 'Validation DGI...' : 'Générer XML & Valider'}
            </button>
          </form>
        </div>

        <div style={styles.darkCard}>
          <h3>Aperçu Legal (UBL 2.1)</h3>
          {lastInvoice ? (
            <div>
              <div style={styles.xmlBox}>
                <pre>{generateUBLXml(lastInvoice, lastInvoice.validationId)}</pre>
              </div>
              <p style={{color: '#2ecc71'}}>✅ Validé par la DGI</p>
              <button onClick={downloadPdf} style={{...styles.button, backgroundColor: '#ecf0f1', color: '#2c3e50', marginTop: '10px'}}>Télécharger PDF</button>
            </div>
          ) : <p>Remplissez le formulaire pour générer le flux XML obligatoire.</p>}
        </div>
      </div>
    </div>
  );
};

export default App;