# MetalCore AI - Next.js Edition

A premium metallurgy database application for knife enthusiasts, built with Next.js and React.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   The app will be available at `http://localhost:3000`

## 📁 Project Architecture

Next.js App Router structure:

```
MetalCore-AI/
├── app/
│   ├── layout.jsx      # Root layout with fonts and metadata
│   ├── page.jsx        # Main application page (client component)
│   └── globals.css     # Global styles and Tailwind directives
├── src/
│   ├── components/     # React functional components
│   │   ├── Sidebar.jsx
│   │   ├── SearchView.jsx
│   │   ├── PerformanceMatrix.jsx
│   │   ├── KnifeLibrary.jsx
│   │   ├── CompareView.jsx
│   │   ├── HomeView.jsx
│   │   ├── AIAnalystPanel.jsx
│   │   └── ...
│   └── data/           # Static data modules
│       ├── steels.js
│       └── knives.js
├── Image/              # Static image assets
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
└── package.json        # Dependencies & scripts
```

## ✨ Features

- **Grade Library**: Browse and search 20+ premium steel grades.
- **Performance Matrix**: Interactive scatter plot visualizing Toughness vs Edge Retention.
- **Compare Analysis**:
  - Compare up to 4 steels side-by-side.
  - **Radar Chart**: Overall performance balance.
  - **Composition Chart**: Elemental breakdown (C, Cr, V, etc.).
  - **Heat Treatment Curves**: Interactive line charts showing Hardness vs. Tempering Temperature.
- **AI Analyst**: Integrated Google Gemini AI for expert metallurgical advice.
- **Knife Library**: Explore iconic knives and their steel variants.
- **Excel Import**: Import custom steel data from Excel files.

## 🤖 AI Setup

To use the AI Analyst features:

1. Click the **Gear Icon** in the sidebar.
2. Enter your **Google Gemini API Key**.
3. Select your preferred model (e.g., `gemini-2.5-flash`).

Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## 🛠️ Stack

- **Framework**: Next.js 14 (App Router)
- **Core**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI**: Google Generative AI SDK
- **Data Handling**: XLSX (for Excel imports)

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Build Output
- Production build: `.next/` directory
- Static export (if configured): `out/` directory

## 💡 Credits

Built for the knife community.
- Data curated from industry standards.
- Design inspired by premium utilitarian aesthetics.
