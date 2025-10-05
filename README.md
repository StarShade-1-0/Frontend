# TerraFinder Frontend 🌍🔭

A modern, interactive web application for exoplanet prediction and discovery using machine learning models. Built with Next.js 14, TypeScript, and shadcn/ui components.

## 🚀 Deployed Application

**Live Demo:** https://frontend-omega-azure-20.vercel.app/

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🔮 Prediction Capabilities
- **Single Prediction**: Submit individual exoplanet parameters for instant classification
- **Batch Prediction**: Upload CSV files for bulk predictions with detailed results
- **Multiple Models**: Support for K2, Kepler, and Merged dataset models

### 📊 Dashboard & Analytics
- Real-time prediction statistics and history
- Visual analytics with animated charts
- Success rate tracking and trends

### 📁 Dataset Management
- Browse and download exoplanet datasets
- Access K2, Kepler, and merged datasets
- Detailed dataset statistics and descriptions

### 👤 User Features
- Secure authentication with Supabase
- User profile management
- Prediction history tracking
- Export results to CSV

### 🎨 Modern UI/UX
- Responsive design for all devices
- Animated backgrounds and smooth transitions
- Dark mode support
- Accessible components with shadcn/ui

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Lucide Icons** - Beautiful icon set

### Backend & Database
- **Supabase** - Authentication and database
- **FastAPI** - Backend API (see starshade-backend)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project
- Backend API running (see `starshade-backend/`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd StarShade/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the Frontend directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
Frontend/
├── app/                      # Next.js App Router pages
│   ├── catalog/             # Dataset download page
│   ├── dashboard/           # User dashboard
│   ├── history/             # Prediction history
│   ├── predict/             # Prediction interface (single & batch)
│   ├── profile/             # User profile
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── navigation.tsx       # Navigation bar
├── lib/                     # Utilities and configurations
│   ├── api-service.ts       # API integration layer
│   ├── auth-context.tsx     # Authentication context
│   ├── supabase.ts          # Supabase client
│   └── utils.ts             # Utility functions
├── hooks/                   # Custom React hooks
│   └── use-toast.ts         # Toast notifications
├── types/                   # TypeScript type definitions
├── public/                  # Static assets
└── supabase/               # Database migrations
    └── migrations/
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server on localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

---

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` or production URL |

---

## 🔌 API Integration

### Prediction Endpoints

The frontend integrates with three machine learning models:

#### Single Predictions
- `POST /k2/stacking_rf/predict` - K2 Stacking Random Forest
- `POST /kepler/voting_soft/predict` - Kepler Voting Soft
- `POST /merged/stacking_logreg/predict` - Merged Stacking Logistic Regression

#### Batch Predictions
- `POST /k2/stacking_rf/predict_batch` - K2 batch predictions
- `POST /kepler/voting_soft/predict_batch` - Kepler batch predictions
- `POST /merged/stacking_logreg/predict_batch` - Merged batch predictions

### API Service Layer

All API calls are centralized in `/lib/api-service.ts`:

```typescript
import { predictK2StackingRF, predictK2StackingRFBatch } from '@/lib/api-service';

// Single prediction
const result = await predictK2StackingRF(inputData);

// Batch prediction
const formData = new FormData();
formData.append('file', csvFile);
const batchResults = await predictK2StackingRFBatch(formData);
```

---

## 🔒 Authentication

### Supabase Auth

The app uses Supabase for authentication with the following features:

- **Email/Password Sign Up & Login**
- **Session Management**
- **Protected Routes**
- **User Profiles**

### Auth Context

```typescript
import { useAuth } from '@/lib/auth-context';

function Component() {
  const { user, profile, loading, signIn, signUp, signOut } = useAuth();
  
  // Access user data and auth methods
}
```

---

## 📖 Usage Guide

### Making a Single Prediction

1. Navigate to **New Prediction** page
2. Select **Single Prediction** tab
3. Choose your model (K2, Kepler, or Merged)
4. Enter exoplanet parameters
5. Click **Predict** to get results

### Batch Predictions

1. Navigate to **New Prediction** page
2. Select **Batch Prediction** tab
3. Choose your model
4. Upload a CSV file with exoplanet data
5. View results with success/error indicators
6. Export results to CSV

### CSV Format for Batch Predictions

Your CSV should include the required columns for the selected model. Missing columns will trigger warnings, and the system will handle them automatically.

Example columns (vary by model):
- `koi_period`
- `koi_impact`
- `koi_duration`
- `koi_depth`
- `koi_prad`
- `koi_teq`
- And more...

---

## 🎨 UI Components

### Component Library

All UI components are from [shadcn/ui](https://ui.shadcn.com/):

- **Forms**: Input, Select, Textarea, Checkbox, Radio
- **Feedback**: Alert, Toast, Dialog, Progress
- **Navigation**: Tabs, Dropdown Menu, Breadcrumb
- **Data Display**: Table, Card, Badge, Avatar
- **Layout**: Separator, Scroll Area, Resizable

### Styling

- **Tailwind CSS** for utility-first styling
- **Custom animations** for smooth transitions
- **Responsive design** with mobile-first approach
- **Animated backgrounds** with gradient orbs

---

## 🔧 Development

### Adding New Components

```bash
# Add a shadcn/ui component
npx shadcn-ui@latest add [component-name]
```

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm run start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


---

## 🙏 Acknowledgments

- NASA Exoplanet Archive for datasets
- Kepler and K2 missions for exoplanet data
- shadcn/ui for the component library
- Supabase for authentication and database
- The open-source community

---

## 📞 Support

For support, email [your-email] or open an issue in the repository.

---

## 🗺️ Roadmap

- [ ] Add real-time collaboration features
- [ ] Implement advanced data visualization
- [ ] Add export to multiple formats (JSON, Excel)
- [ ] Integrate more ML models
- [ ] Add dark/light theme toggle
- [ ] Implement Progressive Web App (PWA)
- [ ] Add multi-language support

---


