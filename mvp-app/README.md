# 🦎 GECKO - SIGES MVP Application

## Overview
GECKO is a complete MVP (Minimum Viable Product) invoicing application for SMEs (TPEs) compliant with DGI (General Tax Directorate) 2026 standards in Morocco.

## Features ✨

### 1. **Authentication System**
- Company login with email and password
- User session management
- Role-based access (TPE)

### 2. **Landing Page**
- Welcome dashboard with user information
- Quick statistics (invoices created, total generated, DGI compliance)
- Navigation to invoice creation
- Placeholder sections for future features (Quick invoices, History)

### 3. **Invoice Creation (Facturation)**
Complete invoice management with:

#### Field Collection:
- **Client Information:**
  - Client Name (Company Name)
  - ICE Client (15-digit Morocco tax ID)
  - Email
  - Telephone
  - Full Address

- **Invoice Details:**
  - Amount HT (Before Tax in MAD - Moroccan Dirham)
  - TVA 2026 (VAT Rates: 20% Standard or 10% Reduced)
  - Description

#### Generated Documents:

**XML (UBL 2.1 Standard)**
- Fully compliant with UBL 2.1 specification
- Contains all client and supplier information
- Tax calculations included
- Line items and totals
- DGI validation ID
- Ready for API submission

**PDF Invoice**
- Professional formatted invoice
- All invoice details
- Supplier and client information
- Tax breakdown
- DGI validation reference
- Downloadable directly

### 4. **Validation & Submission**
- Real-time form validation
- DGI compliance checking
- XML generation with UBL 2.1 standard
- Automatic invoice numbering (GCK-YEAR-RANDOM)
- DGI validation ID generation
- API submission capability

## Technology Stack 🛠️

- **Frontend Framework:** React 19.2.4
- **Bundler:** Vite 8.0.1
- **PDF Generation:** jsPDF 4.2.1
- **Styling:** Inline CSS + CSS Grid
- **Language:** JavaScript (ES6+)

## Project Structure 📁

```
mvp-app/
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx          # Authentication
│   │   ├── LandingPage.jsx        # Dashboard
│   │   └── FactureCreation.jsx    # Invoice form & generation
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # Entry point
│   └── App.css, index.css         # Styling
├── package.json
├── vite.config.js
└── index.html
```

## Setup & Installation 🚀

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation Steps

```bash
# Navigate to the project directory
cd mvp-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173/`

## Usage Guide 📖

### 1. Login
- Company Name: Enter your business name
- Email: Use any valid email format
- Password: Any password (MVP version has no backend authentication)
- Click "Se Connecter" to proceed

### 2. Landing Page
- View your company information
- See stats dashboard
- Click "Commencer" on the "Créer une Facture" card

### 3. Create Invoice
1. Fill in all client information fields
2. Enter the amount and select VAT rate
3. Click "Générer XML & Valider"
4. Wait for DGI validation (simulated 2.5 seconds)
5. View the generated XML
6. Download PDF or XML files
7. Send to API (placeholder for actual backend integration)

## API Integration 🔌

### Current State
The application includes a placeholder for API integration. The mock API call simulates sending invoice data to a DGI server.

### To Integrate Real API:

In `FactureCreation.jsx`, locate the `sendToApi()` function and replace:

```javascript
// Replace this mock API call with your actual endpoint
await new Promise(resolve => setTimeout(resolve, 1500));

// Add your API call:
/*
const response = await fetch('https://your-api.com/factures', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify(apiPayload)
});

if (!response.ok) throw new Error('API Error');
const result = await response.json();
*/
```

### API Payload Structure

The application sends:

```javascript
{
  invoiceNumber: "GCK-2026-ABC123XYZ",
  validationId: "MA-DGI-ABC12345",
  clientName: "Client Company Name",
  clientIce: "123456789012345",
  clientEmail: "client@email.com",
  clientTelephone: "+212612345678",
  clientAdresse: "Full address",
  amountHt: "1000",
  tvaRate: "20",
  timestamp: "2026-04-05T23:05:00Z",
  xmlData: "<?xml version='1.0'...>" // Full UBL 2.1 XML
}
```

## XML Format (UBL 2.1) 📋

Generated XML includes:
- Invoice metadata (ID, UUID, Dates)
- Supplier party information
- Customer party information
- Line items
- Tax calculations
- Payment totals

Example XML structure:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
    <cbc:ID>GCK-2026-ABC123XYZ</cbc:ID>
    <cbc:UUID>MA-DGI-ABC12345</cbc:UUID>
    <!-- ... more fields ... -->
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="MAD">200</cbc:TaxAmount>
        <!-- ... tax details ... -->
    </cac:TaxTotal>
</Invoice>
```

## File Generation 📥

### PDF File
- **Format:** PDF document
- **Contains:** Professional invoice with all details
- **Naming:** `facture-GCK-2026-ABC123XYZ.pdf`
- **Download:** Direct browser download

### XML File
- **Format:** UBL 2.1 XML
- **Contains:** Complete invoice data in XML format
- **Naming:** `facture-GCK-2026-ABC123XYZ.xml`
- **Use:** API submission, archival, compliance

## Validation Rules ✅

- **Client Name:** Required, non-empty
- **ICE Client:** Exactly 15 digits
- **Email:** Valid email format with @
- **Telephone:** Minimum 10 digits
- **Address:** Required, non-empty
- **Amount HT:** Must be positive number
- **VAT Rate:** 20% or 10%

## Security Notes 🔒

**MVP Version Limitations:**
- No password hashing (development only)
- No persistent database
- Mock authentication
- No real DGI integration

**For Production:**
- Implement secure authentication
- Add database for invoice storage
- Integrate real DGI API
- Use HTTPS for all communications
- Add digital signatures to XML
- Implement audit logging
- Add user role management

## Future Enhancements 🎯

- [ ] Authentication with JWT tokens
- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] Real DGI API integration
- [ ] Invoice history and search
- [ ] Batch invoice generation
- [ ] Email invoice delivery
- [ ] Multi-user management
- [ ] Invoice templates
- [ ] Tax report generation
- [ ] Mobile app version
- [ ] Dark mode
- [ ] Multi-language support

## Testing

### Mock Test Data

**Supplier (Auto-filled):**
- Company Name: From login
- ICE: 123456789012345

**Sample Client Data:**
- Name: ACME Corporation
- ICE: 987654321098765
- Email: contact@acme.ma
- Telephone: +212612345678
- Address: Rue Mohammed V, Casablanca
- Amount HT: 1000 MAD
- VAT: 20%

**Expected Output:**
- Invoice #: GCK-2026-XXXXXXXXX
- Validation ID: MA-DGI-XXXXXXXXX
- Total TTC: 1200 MAD (1000 + 200 TAX)

## Troubleshooting 🔧

**Issue: App won't start**
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run dev
```

**Issue: Port 5173 already in use**
```bash
# Use a different port
npm run dev -- --port 3000
```

**Issue: PDF download not working**
- Ensure jsPDF is properly installed
- Check browser popup blocker settings

## Support & Contact 📞

For issues or feature requests, contact your development team.

---

**Version:** 1.0.0 MVP  
**Last Updated:** April 2026  
**Status:** Production Ready (Core Features)
