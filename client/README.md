# Real-Time Poll Rooms - Frontend

A modern, responsive real-time polling application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✨ **Real-time Voting**: Live updates using Socket.IO
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 📱 **Mobile-First**: Optimized for all device sizes
- 🔒 **Type-Safe**: Full TypeScript implementation
- 🎯 **Form Validation**: Zod schema validation with React Hook Form
- 📊 **Live Results**: Real-time percentage updates and vote counts
- 🔗 **Share Functionality**: Native Web Share API with clipboard fallback

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Query + Local Storage
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.IO Client
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React

## Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm**, **yarn**, **pnpm**, or **bun** package manager

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. **Open Browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The app will auto-reload as you make changes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── create/            # Poll creation page
│   ├── poll/[pollId]/     # Poll voting/results page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── features/          # Feature-specific components
│   ├── shared/            # Shared utility components
│   └── ui/                # UI component library
├── lib/                   # Utility libraries
│   ├── api.ts            # API client functions
│   ├── socket.ts         # Socket.IO client setup
│   ├── validation.ts     # Zod validation schemas
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript type definitions
    ├── api.ts            # API response types
    └── components.ts     # Component prop types
```

## Key Components

### PollForm

- Dynamic option management (2-10 options)
- Real-time validation
- Form submission with loading states

### PollRoom

- Real-time voting interface
- Live percentage updates
- Conditional rendering for voting/results states
- Share functionality with Web Share API

### ShareLinkCard

- Link sharing with copy-to-clipboard
- Native share dialog support
- Toast notifications

## Environment Setup

1. **Create Environment File**

   ```bash
   cp .env.example .env.local
   ```

2. **Configure Variables**
   Edit `.env.local` with your settings:

   ```env
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   **Variable Explanation:**
   - `NEXT_PUBLIC_API_URL`: Base URL for the backend server (used for Socket.IO connections and API calls)

3. **Production Environment**
   For production deployment, update this variable with your production URL:

   ```env
   NEXT_PUBLIC_API_URL=https://your-production-domain.com
   ```

## Environment Variables

The frontend requires one environment variable for API connectivity:

```env
# Backend API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note:** The API client automatically appends `/api` to this URL for REST endpoints, while Socket.IO connects directly to the base URL.

## Development

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js
- **Prettier**: Code formatting (via ESLint)

### Component Patterns

- Functional components with hooks
- TypeScript interfaces for props
- Tailwind CSS for styling
- Responsive design principles

### State Management

- React Query for server state
- Local storage for user preferences
- Socket.IO for real-time updates

## Building for Production

```bash
npm run build
npm run start
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Platforms

- **Netlify**: Static deployment
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
