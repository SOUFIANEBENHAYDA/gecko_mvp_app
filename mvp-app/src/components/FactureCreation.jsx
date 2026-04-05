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

  const generateInvoiceNumber = () =>
    `GCK-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const generateUBLXml = (data, validationId, invoiceNumber) => {
    const tvaAmount = (parseFloat(data.amountHt) * parseFloat(data.tvaRate)) / 100;
    const totalTTC = parseFloat(data.amountHt) + tvaAmount;
    return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2">
    <cbc:ID>${invoiceNumber}</cbc:ID>
    <cbc:UUID>${validationId}</cbc:UUID>
    <cbc:IssueDate>${new Date().toISOString().split('T')[0]}</cbc:IssueDate>
    <cbc:IssueTime>${new Date().toISOString().split('T')[1]}</cbc:IssueTime>
    <cbc:DocumentCurrencyCode>MAD</cbc:DocumentCurrencyCode>
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyName><cbc:Name>${user.companyName}</cbc:Name></cac:PartyName>
            <cac:PartyIdentification><cbc:ID schemeID="ICE">123456789012345</cbc:ID></cac:PartyIdentification>
            <cac:PartyTaxScheme><cbc:CompanyID>123456789012345</cbc:CompanyID></cac:PartyTaxScheme>
            <cac:Contact>
                <cbc:Telephone>${user.companyName}</cbc:Telephone>
                <cbc:ElectronicMail>contact@company.com</cbc:ElectronicMail>
            </cac:Contact>
        </cac:Party>
    </cac:AccountingSupplierParty>
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyName><cbc:Name>${data.clientName}</cbc:Name></cac:PartyName>
            <cac:PartyIdentification><cbc:ID schemeID="ICE">${data.clientIce}</cbc:ID></cac:PartyIdentification>
            <cac:PostalAddress><cbc:StreetName>${data.clientAdresse}</cbc:StreetName></cac:PostalAddress>
            <cac:Contact>
                <cbc:Telephone>${data.clientTelephone}</cbc:Telephone>
                <cbc:ElectronicMail>${data.clientEmail}</cbc:ElectronicMail>
            </cac:Contact>
        </cac:Party>
    </cac:AccountingCustomerParty>
    <cac:InvoiceLine>
        <cbc:ID>1</cbc:ID>
        <cbc:LineExtensionAmount currencyID="MAD">${data.amountHt}</cbc:LineExtensionAmount>
        <cac:Item><cbc:Name>${data.description}</cbc:Name></cac:Item>
        <cac:Price><cbc:PriceAmount currencyID="MAD">${data.amountHt}</cbc:PriceAmount></cac:Price>
    </cac:InvoiceLine>
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="MAD">${data.amountHt}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="MAD">${data.amountHt}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="MAD">${totalTTC}</cbc:TaxInclusiveAmount>
        <cbc:PayableAmount currencyID="MAD">${totalTTC}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="MAD">${tvaAmount}</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="MAD">${data.amountHt}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="MAD">${tvaAmount}</cbc:TaxAmount>
            <cac:TaxCategory>
                <cbc:ID>${data.tvaRate === '20' ? 'S' : 'R'}</cbc:ID>
                <cbc:Percent>${data.tvaRate}</cbc:Percent>
                <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>
</Invoice>`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.clientName.trim()) { setError('Le nom du client est requis'); return false; }
    if (formData.clientIce.length !== 15) { setError("L'ICE doit contenir exactement 15 chiffres"); return false; }
    if (!formData.clientEmail.includes('@')) { setError('Email invalide'); return false; }
    if (formData.clientTelephone.length < 10) { setError('Téléphone invalide (minimum 10 chiffres)'); return false; }
    if (!formData.clientAdresse.trim()) { setError("L'adresse est requise"); return false; }
    if (!formData.amountHt || parseFloat(formData.amountHt) <= 0) { setError('Le montant HT doit être positif'); return false; }
    return true;
  };

  const handleValidation = (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setIsValidating(true);
    setValidationMessage('');
    setTimeout(() => {
      const invoiceNumber = generateInvoiceNumber();
      const validationId = 'MA-DGI-' + Math.random().toString(36).toUpperCase().substring(2, 10);
      const xml = generateUBLXml(formData, validationId, invoiceNumber);
      setLastInvoice({ ...formData, validationId, invoiceNumber });
      setXmlData(xml);
      setValidationMessage('Facture validée avec succès par la DGI');
      setIsValidating(false);
    }, 2500);
  };

  const sendToApi = async () => {
    if (!lastInvoice) { setError("Veuillez d'abord valider la facture"); return; }
    setIsSending(true);
    setError('');
    try {
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
        xmlData,
      };
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setValidationMessage("Facture envoyée avec succès à l'API DGI");
      setIsSending(false);
      console.log('API Payload:', apiPayload);
    } catch (err) {
      setError("Erreur lors de l'envoi à l'API: " + err.message);
      setIsSending(false);
    }
  };

  const downloadPdf = () => {
    if (!lastInvoice) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;
    const lh = 10;
    doc.setFontSize(24); doc.setTextColor(30, 58, 138);
    doc.text('GECKO', 20, y);
    doc.setFontSize(16); doc.setTextColor(0, 0, 0); y += 15;
    doc.text('FACTURE', 20, y); y += 15;
    doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    doc.text(`Numéro: ${lastInvoice.invoiceNumber}`, 20, y); y += lh;
    doc.text(`Validation DGI: ${lastInvoice.validationId}`, 20, y); y += lh;
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, y); y += 15;
    doc.setDrawColor(200, 200, 200); doc.line(20, y, pageWidth - 20, y); y += 10;
    doc.setFontSize(11); doc.setTextColor(0, 0, 0);
    doc.text('Fournisseur:', 20, y); y += lh;
    doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    doc.text(user.companyName, 20, y); y += lh;
    doc.text('123456789012345', 20, y); y += 15;
    doc.setFontSize(11); doc.setTextColor(0, 0, 0);
    doc.text('Client:', pageWidth / 2, y); y += lh;
    doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    doc.text(formData.clientName, pageWidth / 2, y); y += lh;
    doc.text(`ICE: ${formData.clientIce}`, pageWidth / 2, y); y += lh;
    doc.text(`Email: ${formData.clientEmail}`, pageWidth / 2, y); y += lh;
    doc.text(`Tél: ${formData.clientTelephone}`, pageWidth / 2, y); y += lh;
    doc.text(`Adresse: ${formData.clientAdresse}`, pageWidth / 2, y); y += 20;
    doc.setDrawColor(200, 200, 200); doc.line(20, y, pageWidth - 20, y); y += 10;
    doc.setFontSize(11); doc.setTextColor(0, 0, 0);
    doc.text('Description', 20, y); doc.text('Montant', 100, y); doc.text('TVA', 130, y); doc.text('Total', 160, y); y += lh;
    doc.setDrawColor(200, 200, 200); doc.line(20, y, pageWidth - 20, y); y += 10;
    doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    const tvaAmt = (parseFloat(formData.amountHt) * parseFloat(formData.tvaRate)) / 100;
    const ttc = parseFloat(formData.amountHt) + tvaAmt;
    doc.text(formData.description, 20, y);
    doc.text(`${formData.amountHt} MAD`, 100, y);
    doc.text(`${tvaAmt.toFixed(2)} MAD`, 130, y);
    doc.text(`${ttc.toFixed(2)} MAD`, 160, y); y += 20;
    doc.setDrawColor(200, 200, 200); doc.line(20, y, pageWidth - 20, y); y += 10;
    doc.setFontSize(11); doc.setTextColor(0, 0, 0);
    doc.text(`Montant HT: ${formData.amountHt} MAD`, 100, y); y += lh;
    doc.text(`TVA (${formData.tvaRate}%): ${tvaAmt.toFixed(2)} MAD`, 100, y); y += lh;
    doc.setFontSize(12); doc.setTextColor(30, 58, 138);
    doc.text(`Total TTC: ${ttc.toFixed(2)} MAD`, 100, y);
    doc.setFontSize(9); doc.setTextColor(150, 150, 150);
    doc.text('Conforme aux normes DGI 2026 - UBL 2.1', 20, doc.internal.pageSize.getHeight() - 20);
    doc.save(`facture-${lastInvoice.invoiceNumber}.pdf`);
  };

  const downloadXml = () => {
    if (!xmlData) return;
    const el = document.createElement('a');
    const file = new Blob([xmlData], { type: 'text/xml' });
    el.href = URL.createObjectURL(file);
    el.download = `facture-${lastInvoice.invoiceNumber}.xml`;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const tvaComputed = formData.amountHt
    ? ((parseFloat(formData.amountHt) * parseFloat(formData.tvaRate)) / 100).toFixed(2)
    : '0.00';
  const ttcComputed = formData.amountHt
    ? (parseFloat(formData.amountHt) * (1 + parseFloat(formData.tvaRate) / 100)).toFixed(2)
    : '0.00';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .fc-body { font-family: 'DM Sans', sans-serif; }
        .fc-body h1, .fc-body h2, .fc-body h3 { font-family: 'Sora', sans-serif; }

        .grid-bg-fc {
          background-color: #0f2559;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .nav-glass-fc {
          background: rgba(11,30,74,0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky; top: 0; z-index: 50;
        }

        /* White cards */
        .fc-card {
          background: #fff;
          border: 1px solid rgba(30,58,138,0.09);
          border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 4px 24px rgba(30,58,138,0.07);
        }
        .fc-card-title {
          font-family: 'Sora', sans-serif;
          font-size: 18px; font-weight: 700;
          color: #0f2559; margin: 0 0 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(30,58,138,0.08);
          display: flex; align-items: center; gap: 10px;
        }

        /* Form elements */
        .fc-label {
          display: block; margin-bottom: 7px;
          color: #334155; font-size: 13.5px; font-weight: 500;
        }
        .fc-input {
          width: 100%; padding: 11px 14px;
          background: #f8fafc;
          border: 1px solid rgba(30,58,138,0.14);
          border-radius: 10px;
          font-size: 14px; font-family: 'DM Sans', sans-serif; color: #1e293b;
          transition: border-color 0.2s, background 0.2s;
          outline: none;
        }
        .fc-input:focus {
          border-color: rgba(45,88,200,0.55);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(45,88,200,0.08);
        }
        .fc-input::placeholder { color: #94a3b8; }
        .fc-form-group { margin-bottom: 16px; }

        /* Buttons */
        .btn-validate {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #2d58c8 0%, #1e3a8a 100%);
          color: #fff; font-family: 'Sora', sans-serif; font-weight: 600; font-size: 15px;
          border: none; border-radius: 12px; cursor: pointer;
          box-shadow: 0 6px 24px rgba(30,58,138,0.3);
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-validate:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(30,58,138,0.4);
          background: linear-gradient(135deg, #3262d8 0%, #243ea0 100%);
        }
        .btn-validate:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-action {
          width: 100%; padding: 12px; border: none; border-radius: 12px;
          font-family: 'Sora', sans-serif; font-weight: 600; font-size: 14px;
          cursor: pointer; margin-top: 10px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }
        .btn-xml { background: linear-gradient(135deg,#0ea5e9,#0284c7); color:#fff; box-shadow:0 4px 16px rgba(14,165,233,0.3); }
        .btn-xml:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(14,165,233,0.4); }
        .btn-pdf { background: linear-gradient(135deg,#22c55e,#16a34a); color:#fff; box-shadow:0 4px 16px rgba(34,197,94,0.3); }
        .btn-pdf:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(34,197,94,0.4); }
        .btn-api { background: linear-gradient(135deg,#c9973a,#e0b55a); color:#fff; box-shadow:0 4px 16px rgba(201,151,58,0.3); }
        .btn-api:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(201,151,58,0.4); }
        .btn-api:disabled { opacity:0.6; cursor:not-allowed; }

        /* Alerts */
        .alert-success {
          background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25);
          color: #166534; padding: 12px 16px; border-radius: 12px;
          margin-bottom: 16px; font-size: 13.5px; display:flex; align-items:center; gap:8px;
        }
        .alert-error {
          background: rgba(220,38,38,0.07); border: 1px solid rgba(220,38,38,0.22);
          color: #991b1b; padding: 12px 16px; border-radius: 12px;
          margin-bottom: 16px; font-size: 13.5px; display:flex; align-items:center; gap:8px;
        }

        /* Stat boxes */
        .stat-grid-fc { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:20px; }
        .stat-box-fc {
          background: rgba(30,58,138,0.04); border: 1px solid rgba(30,58,138,0.08);
          border-radius: 12px; padding: 14px; text-align:center;
        }
        .stat-val-fc { font-family:'Sora',sans-serif; font-size:17px; font-weight:700; color:#1e3a8a; }
        .stat-lbl-fc { font-size:11.5px; color:#94a3b8; margin-top:4px; }

        /* XML box */
        .xml-box-fc {
          background: #0f1c36; border-radius: 12px; padding: 16px;
          overflow: auto; max-height: 260px;
          font-size: 11px; color: #7eb8f7; font-family: monospace;
          margin-top: 12px; border: 1px solid rgba(255,255,255,0.06);
        }

        /* Code tag */
        .id-tag {
          background: rgba(30,58,138,0.07); border: 1px solid rgba(30,58,138,0.13);
          padding: 10px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #1e3a8a; word-break:break-all;
        }
        .id-tag-green {
          background: rgba(34,197,94,0.07); border: 1px solid rgba(34,197,94,0.2);
          padding: 10px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #166534; word-break:break-all;
        }

        /* Back button */
        .btn-back {
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.85); font-family:'DM Sans',sans-serif; font-weight:500;
          padding: 9px 18px; border-radius:10px; cursor:pointer; font-size:14px;
          transition: all 0.2s; display:flex; align-items:center; gap:6px;
        }
        .btn-back:hover { background:rgba(255,255,255,0.18); color:#fff; }

        @media (max-width: 768px) {
          .fc-cols { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <div className="fc-body" style={{ minHeight: '100vh', background: '#f8fafc' }}>

        {/* ── Navbar ── */}
        <nav className="nav-glass-fc">
          <div style={{
            maxWidth: 1280, margin: '0 auto', padding: '0 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
          }}>
            {/* Logo + Page title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
              <div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>GECKO</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>Nouvelle Facture</div>
              </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(201,151,58,0.12)', border: '1px solid rgba(201,151,58,0.28)',
                color: '#e0b55a', fontFamily: "'Sora',sans-serif",
                fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
                padding: '4px 12px', borderRadius: 999,
              }}>
                {user.companyName}
              </span>
              <button className="btn-back" onClick={onBack}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
                Retour
              </button>
            </div>
          </div>
        </nav>

        {/* ── Page Header ── */}
        <div className="grid-bg-fc" style={{ padding: '48px 24px 60px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', filter: 'blur(80px)', background: 'rgba(45,88,200,0.2)', top: -100, right: -80, pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(201,151,58,0.12)', border: '1px solid rgba(201,151,58,0.28)',
              color: '#e0b55a', fontFamily: "'Sora',sans-serif",
              fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
              padding: '5px 12px', borderRadius: 999, marginBottom: 16,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e0b55a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Facturation UBL 2.1
            </div>
            <h1 style={{
              fontFamily: "'Sora',sans-serif", fontSize: 'clamp(26px,4vw,38px)',
              fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: 0,
            }}>
              Créer une Facture
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginTop: 10, fontWeight: 300 }}>
              Remplissez le formulaire pour générer une facture conforme à la réforme DGI 2026.
            </p>
          </div>
          {/* wave */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: 48, display: 'block' }}>
              <path d="M0 48L1440 48L1440 16C1200 48 960 0 720 0C480 0 240 48 0 16L0 48Z" fill="#f8fafc"/>
            </svg>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div style={{ padding: '40px 24px 80px' }}>
          <div className="fc-cols" style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

            {/* ─ LEFT: Form ─ */}
            <div className="fc-card">
              <h2 className="fc-card-title">
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg,rgba(45,88,200,0.12),rgba(30,58,138,0.07))',
                  border: '1px solid rgba(30,58,138,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>📋</div>
                Nouvelle Vente (TPE)
              </h2>

              {error && (
                <div className="alert-error">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}
              {validationMessage && (
                <div className="alert-success">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {validationMessage}
                </div>
              )}

              <form onSubmit={handleValidation}>
                {[
                  { label: "Nom du Client", name: "clientName", type: "text", placeholder: "Nom de l'entreprise client" },
                  { label: "ICE Client (15 chiffres)", name: "clientIce", type: "text", placeholder: "Ex: 123456789012345", maxLength: 15 },
                  { label: "Email Client", name: "clientEmail", type: "email", placeholder: "client@email.com" },
                  { label: "Téléphone Client", name: "clientTelephone", type: "tel", placeholder: "Ex: +212612345678" },
                  { label: "Adresse Client", name: "clientAdresse", type: "text", placeholder: "Adresse complète" },
                  { label: "Montant HT (MAD)", name: "amountHt", type: "number", placeholder: "Ex: 1000", step: "0.01" },
                ].map((f) => (
                  <div key={f.name} className="fc-form-group">
                    <label className="fc-label">{f.label}</label>
                    <input
                      className="fc-input"
                      type={f.type}
                      name={f.name}
                      placeholder={f.placeholder}
                      value={formData[f.name]}
                      onChange={handleInputChange}
                      maxLength={f.maxLength}
                      step={f.step}
                    />
                  </div>
                ))}

                <div className="fc-form-group">
                  <label className="fc-label">TVA 2026</label>
                  <select className="fc-input" name="tvaRate" value={formData.tvaRate} onChange={handleInputChange}>
                    <option value="20">20% (Standard)</option>
                    <option value="10">10% (Réduit)</option>
                  </select>
                </div>

                <div className="fc-form-group">
                  <label className="fc-label">Description</label>
                  <input
                    className="fc-input"
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Live preview strip */}
                {formData.amountHt && (
                  <div style={{
                    background: 'linear-gradient(135deg,rgba(30,58,138,0.04),rgba(45,88,200,0.03))',
                    border: '1px solid rgba(30,58,138,0.1)',
                    borderRadius: 12, padding: '14px 16px', marginBottom: 16,
                    display: 'flex', gap: 16, flexWrap: 'wrap',
                  }}>
                    {[
                      { label: 'HT', val: `${parseFloat(formData.amountHt).toFixed(2)} MAD` },
                      { label: `TVA ${formData.tvaRate}%`, val: `${tvaComputed} MAD` },
                      { label: 'TTC', val: `${ttcComputed} MAD`, highlight: true },
                    ].map((item) => (
                      <div key={item.label} style={{ flex: 1, minWidth: 80, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>{item.label}</div>
                        <div style={{
                          fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700,
                          color: item.highlight ? '#1e3a8a' : '#475569',
                        }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                )}

                <button className="btn-validate" type="submit" disabled={isValidating}>
                  {isValidating ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                        <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                      </svg>
                      Validation DGI en cours…
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Générer XML & Valider
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* ─ RIGHT: Preview & Actions ─ */}
            <div className="fc-card">
              <h2 className="fc-card-title">
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg,rgba(45,88,200,0.12),rgba(30,58,138,0.07))',
                  border: '1px solid rgba(30,58,138,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>🔍</div>
                Aperçu & Téléchargement
              </h2>

              {lastInvoice ? (
                <>
                  {/* Stats */}
                  <div className="stat-grid-fc">
                    <div className="stat-box-fc">
                      <div className="stat-val-fc">{formData.amountHt} MAD</div>
                      <div className="stat-lbl-fc">Montant HT</div>
                    </div>
                    <div className="stat-box-fc">
                      <div className="stat-val-fc">{tvaComputed} MAD</div>
                      <div className="stat-lbl-fc">TVA ({formData.tvaRate}%)</div>
                    </div>
                    <div className="stat-box-fc">
                      <div className="stat-val-fc" style={{ color: '#166534' }}>{ttcComputed} MAD</div>
                      <div className="stat-lbl-fc">Total TTC</div>
                    </div>
                    <div className="stat-box-fc">
                      <div className="stat-val-fc" style={{ color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        DGI
                      </div>
                      <div className="stat-lbl-fc">Validation</div>
                    </div>
                  </div>

                  {/* Invoice number */}
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Numéro de Facture</p>
                    <div className="id-tag">{lastInvoice.invoiceNumber}</div>
                  </div>

                  {/* DGI ID */}
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>ID de Validation DGI</p>
                    <div className="id-tag-green">{lastInvoice.validationId}</div>
                  </div>

                  {/* XML */}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>XML (UBL 2.1)</p>
                    <div className="xml-box-fc">
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{xmlData}</pre>
                    </div>
                  </div>

                  {/* Actions */}
                  <button className="btn-action btn-xml" onClick={downloadXml}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Télécharger XML
                  </button>
                  <button className="btn-action btn-pdf" onClick={downloadPdf}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Télécharger PDF
                  </button>
                  <button className="btn-action btn-api" onClick={sendToApi} disabled={isSending}>
                    {isSending ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                          <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
                          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                          <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
                        </svg>
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        Envoyer à l'API DGI
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 18,
                    background: 'linear-gradient(135deg,rgba(45,88,200,0.08),rgba(30,58,138,0.04))',
                    border: '1px solid rgba(30,58,138,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                  }}>📄</div>
                  <p style={{ fontSize: 15, color: '#64748b', fontWeight: 500, margin: 0 }}>
                    Remplissez le formulaire
                  </p>
                  <p style={{ fontSize: 13.5, color: '#94a3b8', margin: 0 }}>
                    puis cliquez sur <strong style={{ color: '#1e3a8a' }}>Générer XML & Valider</strong>
                  </p>
                  <p style={{ fontSize: 12.5, color: '#cbd5e1', margin: 0 }}>
                    pour générer votre facture conforme DGI 2026.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default FactureCreation;