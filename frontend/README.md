# MMS Frontend

React + TypeScript + Vite + TanStack Router + Material UI

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Getting Started

### 1. Install Node.js

If you don't have Node.js installed, download and install it from [nodejs.org](https://nodejs.org/).

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

The backend API proxy is configured to forward `/api/*` requests to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── routes/          # TanStack Router route files
│   │   ├── __root.tsx   # Root layout
│   │   ├── index.tsx    # Home page
│   │   ├── platform/    # Platform admin routes
│   │   └── tenant/      # Tenant routes
│   ├── services/        # API services
│   ├── theme/           # Material UI theme configuration
│   ├── types/           # TypeScript type definitions
│   ├── main.tsx         # Application entry point
│   └── vite-env.d.ts    # Vite type definitions
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Features

### TanStack Router

File-based routing with type safety. Routes are defined in the `src/routes` directory.

- `/` - Home page
- `/platform/login` - Platform admin login
- `/platform/dashboard` - Platform dashboard
- `/tenant/login` - Tenant login

### Material UI

Pre-configured theme with customization in `src/theme/index.ts`

### API Integration

API service is configured in `src/services/api.ts` with proxy to backend at `http://localhost:8080`

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Integration with Spring Boot

The Vite dev server is configured to proxy API requests to the Spring Boot backend running on port 8080.

For production, you can:

1. Build the frontend: `npm run build`
2. Copy the `dist` folder contents to `src/main/resources/static` in your Spring Boot project
3. Spring Boot will serve the frontend automatically

## Next Steps

1. Install Node.js if not already installed
2. Run `npm install` to install dependencies
3. Update the API service to match your backend endpoints
4. Implement authentication state management
5. Add protected routes
6. Create additional pages and components as needed