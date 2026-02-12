# MetalCore

A premium metallurgy database and analysis platform for knife enthusiasts, built with Next.js, React, and PostgreSQL.

## 🌐 Live Application

**Access the application at: [https://metalcre.vercel.app/](https://metalcre.vercel.app/)**

No installation required - start exploring steel grades, comparing performance metrics, and analyzing knife materials instantly.

## 🎯 Application Structure

The platform is organized into several key sections accessible from the sidebar:

- **🏠 Home**: Hero landing page with quick search
- **🔍 Search**: Browse and filter the complete steel database
- **📊 Performance Matrix**: Interactive visualization of steel properties
- **⚖️ Compare**: Side-by-side comparison of up to 4 steel grades
- **🔪 Knife Library**: Explore iconic knives and their steel variants
- **📚 Education**: Comprehensive glossary and FAQ
- **🧪 Pro Lab**: Advanced AI-powered analysis tools (Beta)
- **👤 Profile**: User preferences and saved data
- **⚙️ Settings**: Configure AI features and preferences

## ✨ Features

### Core Features
- **Steel Grade Library**: Browse and search 20+ premium steel grades with detailed specifications
- **Performance Matrix**: Interactive scatter plot visualizing Toughness vs Edge Retention
- **Compare Analysis**:
  - Compare up to 4 steels side-by-side
  - **Radar Chart**: Overall performance balance
  - **Composition Chart**: Elemental breakdown (C, Cr, V, etc.)
  - **Heat Treatment Curves**: Interactive line charts showing Hardness vs. Tempering Temperature
- **Knife Library**: Explore iconic knives and their steel variants
- **Education Hub**: Comprehensive glossary and FAQ system
- **Producer Map**: Interactive world map showing steel producer locations

### Advanced Features
- **AI Analyst**: Integrated Google Gemini AI for expert metallurgical advice
- **Pro Lab** (Beta):
  - Steel Recommender: AI-powered steel selection based on use case
  - Edge Retention Predictor: Predict performance metrics
- **Command Palette**: Quick navigation and search (⌘K / Ctrl+K)
- **Excel Import**: Import custom steel data from Excel files
- **Feature Flags**: Toggle experimental features in settings
- **Mobile Optimized**: Responsive design with bottom navigation and swipe gestures

### Admin Panel
- **Database Management**: Switch between local Docker and Railway databases
- **Data Editor**: CRUD operations for steels, knives, glossary, FAQ, and producers
- **Real-time Updates**: Changes reflect immediately across the application
- **Secure Authentication**: Protected admin routes

## 🗄️ Database

The platform contains comprehensive data on:
- **20+ Premium Steel Grades**: Detailed composition, performance metrics, and heat treatment data
- **Iconic Knife Models**: Curated collection of legendary knives and their steel variants
- **Metallurgy Glossary**: Expert definitions of technical terms
- **FAQ Database**: Answers to common questions about knife steels
- **Producer Information**: Global steel manufacturers with geographic data

All data is stored in a PostgreSQL database and updated regularly to ensure accuracy.

## 🤖 AI Setup

Our AI is currently being trained on metallurgy and knife steels. It is not yet ready for use. In the meantime, we are evaluating usage of the mainstream models. Stay ready as we are soon launching!


## 🛠️ For Developers

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS + Custom Design System
- **Charts**: Recharts
- **AI**: Google Generative AI SDK
- **Deployment**: Vercel


## 🎨 Design System

The application features a premium glass-morphism design with:
- **Emerald Gradient Theme**: Vibrant color palette
- **Glass Design Language**: Frosted glass effects with backdrop blur
- **Dark Mode**: Optimized for low-light environments
- **Smooth Animations**: Micro-interactions and transitions
- **Responsive Layout**: Mobile-first design with adaptive UI

## 🔐 Admin Panel

The platform includes a secure admin panel for data management:
- **Database Editor**: Add, edit, and remove steel grades, knives, and educational content
- **Real-time Updates**: Changes sync immediately across the application
- **Secure Access**: Protected authentication system

*Admin access is restricted to authorized users only.*

## 💡 Credits

Built for the knife community by passionate metallurgy enthusiasts.
- Data curated from industry standards and expert sources
- Design inspired by premium utilitarian aesthetics
- Open source contributions welcome
