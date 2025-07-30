
# Motor Insurance Quotation Application

This is a web application for obtaining motor insurance quotations, built with React, TypeScript, and Tailwind CSS. It provides a complete, professional workflow for users to get a quote, review coverage, pay, and receive instant confirmation.

## Overview

This project implements a full motor insurance quotation and purchase flow, including:

- Multi-step quote form with validation
- Live price preview and VAT breakdown
- Professional PDF quote generation
- Payment integration (Mobile Money, Credit Cards)
- Automated receipt generation
- Instant policy activation
- Responsive, accessible design

## User Journey

1. Enter vehicle information (make, model, year, value)
2. Provide personal details and select usage type
3. Choose a coverage plan (Basic, Standard, Premium)
4. View a live quote with VAT and pricing details
5. Download a professional PDF quote
6. Complete payment securely
7. Receive instant confirmation and policy activation

## Getting Started


### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

```bash
git clone https://github.com/dvbwitso/motor-insurance-quote-challenge.git
cd motor-insurance-quote
npm install
npm start
```

The application will be available at http://localhost:3000


## Technology Stack

- Frontend: React 18, TypeScript
- Styling: Tailwind CSS, custom components
- Animations: Framer Motion
- Icons: Lucide React
- PDF Generation: jsPDF
- Form Handling: React Hook Form
- Routing: React Router
- UUID: Unique ID generation for receipts and policies


## Project Structure

```
src/
  components/      # Reusable UI components
  pages/           # Main application pages
  services/        # API and business logic
  types/           # TypeScript type definitions
  utils/           # Utility functions
```


## Implementation Details

### Pricing Engine
- Calculates insurance rates based on Zambian market (1.5% - 4.5% of vehicle value)
- Adjusts for vehicle age and usage type (personal, business, commercial)
- Applies 16% VAT

### PDF Quote Generation
- Generates a single-page, print-friendly PDF
- Includes company branding, VAT breakdown, and terms

### Payment Integration
- Supports Airtel Money, MTN Mobile Money, Zamtel Kwacha, and credit cards
- Secure checkout flow
- Generates receipts with unique tracking IDs


## Design Philosophy

- Professional, business-appropriate interface
- Intuitive, user-friendly flow
- Mobile-first, responsive design
- Optimized for performance
- Accessibility compliant (WCAG)


## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode at http://localhost:3000. The page reloads on edits and displays lint errors in the console.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. The build is minified and filenames include hashes.

### `npm run eject`
Removes the single build dependency and copies configuration files and dependencies into your project. This is a one-way operation.


## Learn More

For more details, see the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) and the [React documentation](https://reactjs.org/).
