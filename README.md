# MetalCore AI - Modern React Edition

A premium metallurgy database application for knife enthusiasts, built with React and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js installed

### Installation

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the development server**:
    ```bash
    npm run dev
    ```

3.  **Open in browser**:
    Typically runs at `http://localhost:5173`

## 📁 Project Architecture

Now a standard Vite application:

```
SteelLedger/
├── index.html          # Vite entry point
├── src/
│   ├── main.jsx        # React root
│   ├── App.jsx         # Main application component & routing
│   ├── index.css       # Tailwind directives & global styles
│   ├── data/           # Static data modules
│   └── components/     # React functional components
├── public/             # Static assets
└── package.json        # Dependencies & scripts
```

## ✨ Features

-   **Grade Library**: Browse and search 20+ premium steel grades.
-   **Performance Matrix**: Interactive scatter plot visualizing Toughness vs Edge Retention.
-   **Compare Analysis**:
    -   Compare up to 4 steels side-by-side.
    -   **Radar Chart**: Overall performance balance.
    -   **Composition Chart**: Elemental breakdown (C, Cr, V, etc.).
    -   **Heat Treatment Curves**: Interactive line charts showing Hardness vs. Tempering Temperature.
-   **AI Analyst**: Integrated Google Gemini AI for expert metallurgical advice.
-   **Knife Library**: Explore iconic knives and their steel variants.

## 🤖 AI Setup

To use the AI Analyst features:

1.  Click the **Gear Icon** in the sidebar.
2.  Enter your **Google Gemini API Key**.
3.  Select your preferred model (e.g., `gemini-2.0-flash`).

## �️ Stack

-   **Core**: React 18, Vite
-   **Styling**: Tailwind CSS
-   **Charts**: Recharts
-   **Icons**: Lucide React
-   **AI**: Google Generative AI SDK
-   **Data Handling**: XLSX (for Excel imports)

## � Credits

Built for the knife community.
-   Data curated from industry standards.
-   Design inspired by premium utilitarian aesthetics.
