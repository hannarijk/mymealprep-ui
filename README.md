# MyMealPrep UI

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

MyMealPrep UI is a frontend **React + TypeScript + Vite** app used by MyMealPrep full-featured meal planning platform **MyMealPrep**. The UI powers both the public landing experience and interactive dashboard for **MyMealPrep** platform users.

The UI contains:

- Landing Page
- Internal Dashboard with 4 tabs: Planner, Recipes, History, Grocery
- Smart Fill & Shuffle features for menus and recipes
- Recipe library with filters
- Grocery list generation
- Week history & sharing

## Features

- **Menu Planning**: Breakfast and lunch+dinner meal planning with drag and drop
- **Smart Menu Fill**: Cooking History and AI powered recipe recommendations
- **Grocery Lists**: Automatically generated and organized by aisle
- **Recipe Library**: Save and manage your favorite recipes
- **Social Sharing**: Publish menus and collect hearts/comments
- **Responsive Design**: Works seamlessly on mobile and desktop

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | 19.1.1 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.8.3 | Type safety |
| [Vite](https://vitejs.dev/) | 7.1.7 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1.13 | Styling |
| [Framer Motion](https://www.framer.com/motion/) | 12.23.21 | Animations |
| [Radix UI](https://www.radix-ui.com/) | Latest | Accessible components |

### Key Libraries

- **UI Components**: Custom implementation of shadcn/ui patterns
- **Styling**: Class Variance Authority (CVA) for component variants
- **Icons**: Lucide React for icon system
- **State Management**: React Hooks + Context (with plans for React Query)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 20.19.0 or >= 22.12.0 (required by Vite 7)
- **npm**: >= 8.0.0 or **yarn**: >= 1.22.0 or **pnpm**: >= 8.0.0

### Check Your Versions
```bash
node --version   # Should show v20.19.0 or higher
npm --version    # Should show 8.0.0 or higher
```
## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mymealprep-ui.git
cd mymealprep-ui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file with the following variables:

| Variable | Description | Required |
|-----------|--------------|-----------|
| `VITE_API_BASE_URL` | Base URL for API requests | ✅ |
| `VITE_APP_ENV` | App environment: `development`, `staging`, `production` | Optional |

`src/config/env.ts` validates these values at runtime and throws if missing.

### 4. Start Development Server
```bash
npm run dev
```

## Project Structure

```
mymealprep-ui/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   │   ├── AuthModal.tsx
│   │   │   └── AuthForms.tsx
│   │   ├── layout/          # Layout primitives
│   │   │   ├── Container.tsx
│   │   │   └── Section.tsx
│   │   └── ui/              # Reusable UI components
│   │       ├── AppButton.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── index.ts
│   ├── config/              # Configuration
│   │   └── env.ts           # Environment config & validation
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # Common utilities (cn, etc.)
│   ├── pages/               # Page components
│   │   └── LandingPage.tsx  # Public landing page
│   ├── services/            # API services
│   │   └── authService.ts   # Authentication API client
│   ├── types/               # TypeScript types
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles & Tailwind imports
├── .env.example             # Environment template
├── .gitignore
├── components.json          # shadcn/ui configuration
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML entry point
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md               # This file
```

### Key Directories

* `components/auth/`: Authentication-related components (login, signup, modals)
* `components/layout/`: Layout primitives (Container, Section) for consistent spacing
* `components/ui/`: Reusable UI components following shadcn/ui patterns
* `config/`: Application configuration and environment validation
* `hooks/`: Custom React hooks for shared logic
* `services/`: API client services
* `pages/`: Full-page components (currently just landing page)

## Development


| Command | Description                                       |
|------------|---------------------------------------------------|
| npm run dev | Start development server at http://localhost:5173 |
| npm run build | Build for production (outputs to dist/)           | 
| npm run preview | Preview production build locally at http://localhost:4173 |
| npm run lint | Run ESLint for code quality checks                | 

## Contributing

### 1. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make your changes

* Follow existing code style
* Use TypeScript for type safety
* Add JSDoc comments for complex logic

Adding New Components:
```
# Using shadcn/ui CLI (recommended for UI components)
npx shadcn@latest add [component-name]

# Manual component creation
src/components/
├── [feature]/
│   ├── ComponentName.tsx
│   └── index.ts  # Barrel export
```

### 3. Test your changes

```bash
npm run dev      # Test in browser
npm run lint     # Check for linting errors
npm run build    # Ensure production build works
```

### 4. Commit & Push your changes

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 5. Open a Pull Request

* Go to the repository on GitHub
* Click "New Pull Request"
* Describe your changes
* Link any related issues

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

* [shadcn/ui](https://ui.shadcn.com/) - Component design patterns
* [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
* [Lucide Icons](https://lucide.dev/) - Beautiful icon set
* [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Support

For questions, issues, or contributions, please:

1. Check existing [Issues](https://github.com/hannarijk/mymealprep-ui/issues)
2. Open a new issue with detailed description
3. Join discussions in [Discussions](https://github.com/hannarijk/meal-prep-ui/discussions)

**Built with ❤️ for developers who love React and great food!**