# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Car Dealer Dashboard built with Next.js 14, TypeScript, featuring a hybrid UI architecture that combines Material-UI (MUI) v7 and Shadcn UI. It's a comprehensive management system for car dealerships with JWT authentication, master data management, sales monitoring with Google Maps, and SPK (Surat Pesanan Kendaraan) order management with PDF generation capabilities.

## Development Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:3000)

# Build and Production
npm run build        # Build for production (static export to /out)
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Node version requirement
# Requires Node.js >=18.17.0
```

## Deployment

The application uses a multi-stage Docker build:
1. **Builder stage**: Node 22 Alpine - builds Next.js static export
2. **Runner stage**: Nginx Alpine - serves static assets on port 3000

Key deployment configurations:
- `next.config.js`: `output: 'export'` for static site generation
- `nginx.conf`: Serves from `/out` directory with gzip compression
- Build warnings: ESLint and TypeScript errors are ignored during builds (configured in next.config.js)

## Architecture

### Tech Stack
- **Framework**: Next.js 14.2.5 (App Router) with static export
- **Language**: TypeScript 5.5+ with strict mode
- **UI Libraries**:
  - Material-UI (MUI) v7 for complex components (Data Grids, advanced forms)
  - Shadcn UI (Radix UI + Tailwind) for standard components
  - Tailwind CSS 3.4+ for utilities and layout (preflight disabled for MUI coexistence)
- **State Management**:
  - React Context (AuthContext) + localStorage for auth
  - TanStack Query (React Query) for server state management
- **PDF Generation**: @react-pdf/renderer for SPK document generation
- **Maps**: Google Maps API (@googlemaps/react-wrapper, @googlemaps/js-api-loader) for branch and sales tracking
- **Tables**:
  - TanStack Table v8 with CRUDTable wrapper for most data tables
  - MUI X DataGrid v8 for advanced data tables
- **Authentication**: JWT-based with localStorage persistence (using jsonwebtoken, bcryptjs)
- **Form Handling**: react-hook-form with zod/yup validation (also uses formik for some forms)
- **Backend**: Strapi v4 CMS integration via axios (structured for easy backend swap)
- **Toast Notifications**: sonner for user feedback

### Hybrid UI Architecture Pattern

This project uses a unique coexistence strategy between MUI and Shadcn UI:

1. **MUI Layer** (`src/app/theme/ThemeRegistry.tsx`):
   - Acts as the outer theming wrapper for the entire app
   - Provides base theme, CSS baseline, and AppRouter cache provider
   - Uses `@mui/material-nextjs/v14-appRouter` for Next.js 14 compatibility
   - Custom theme in `src/app/theme/theme.ts` matches existing HSL color palette
   - Emotion-based styling (@emotion/react, @emotion/styled)

2. **Shadcn UI Layer**:
   - Primary component library for business logic UI
   - Configured with "new-york" style variant and neutral base colors
   - Located in `src/components/ui/`
   - Uses Radix UI primitives with Lucide React icons

3. **Integration Pattern**:
   ```typescript
   // In layout.tsx
   <ThemeRegistry>           // MUI wrapper (outer)
     <QueryClientProvider>   // TanStack Query wrapper
       <AuthProvider>        // Context provider
         {children}          // Business logic using Shadcn/MUI components
       </AuthProvider>
     </QueryClientProvider>
   </ThemeRegistry>
   ```

### TanStack Query Configuration
The app uses TanStack Query with specific settings defined in `src/providers/QueryClientProvider.tsx`:
- **staleTime**: 1 minute (data considered fresh)
- **gcTime**: 5 minutes (cache retention)
- **retry**: 1 attempt for failed queries/mutations
- **refetchOnWindowFocus**: false
- **refetchOnMount**: false
- **refetchOnReconnect**: false
- DevTools enabled in development mode

Use TanStack Query hooks (`useQuery`, `useMutation`) for data fetching patterns. See `src/hooks/useSpkData.ts` for a reference implementation.

### Key Architectural Components

#### Authentication System
- JWT tokens stored in localStorage with automatic injection via axios interceptor
- AuthProvider wraps the entire app in layout.tsx
- Protected routes use ProtectedRoute component
- Auto-verification of stored tokens on app load via `authAPI.me()`
- **10-second timeout** on auth check using `Promise.race` to prevent infinite loading
- 401 responses clear tokens and redirect to login
- Comprehensive error handling with fallback endpoints
- Password hashing with bcryptjs (for user registration)
- Role-based access control (ADMIN role enforcement)

**Auth Timeout Pattern** (prevents loading freeze):
```typescript
const userData = await Promise.race([
  authAPI.me(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Auth check timeout')), 10000)
  ),
]) as any;
```

#### API Integration Pattern
- Strapi v4 backend integration with axios instance
- Generic CRUD factory (`createCRUDAPI`) for consistent data operations
- Response format: `{ data: [...], meta: {...} }`
- Request/response logging for debugging
- Auto JWT token injection for non-auth endpoints
- Google Maps externals configuration in webpack to avoid build issues

#### Component Architecture
Three-tier component system:
1. **Base UI Components** (`@/components/ui`): Shadcn UI components
2. **Business Logic Components**: CRUDTable, DashboardLayout, ProtectedRoute, MUIDataGrid
3. **Page Components**: Feature-specific implementations in `/app/dashboard/*`

#### Data Management Patterns
- **CRUDTable**: TanStack Table wrapper for standard data tables
- **MUIDataGrid**: MUI X DataGrid for advanced tables with built-in pagination, sorting, filtering
- All master data modules follow consistent CRUD pattern
- State managed via useState hooks in page components

### Project Structure
```
src/
├── app/                     # Next.js App Router pages
│   ├── auth/               # Authentication routes (login, register)
│   ├── dashboard/          # Protected dashboard routes
│   │   ├── master-data/    # CRUD modules for entities
│   │   ├── sales-monitoring/  # Live sales tracking with maps
│   │   └── spk-management/    # Order management with PDF generation
│   ├── theme/              # MUI theme configuration
│   │   ├── theme.ts        # MUI theme object
│   │   └── ThemeRegistry.tsx # MUI provider wrapper
│   ├── layout.tsx          # Root layout with ThemeRegistry, QueryClientProvider, AuthProvider
│   └── globals.css         # Global styles, Roboto font, Material Icons
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── CRUDTable.tsx       # TanStack Table wrapper
│   ├── MUIDataGrid.tsx     # MUI X DataGrid wrapper
│   ├── DashboardLayout.tsx # Main dashboard navigation
│   ├── ProtectedRoute.tsx  # Authentication wrapper
│   ├── SpkDocument.tsx     # PDF document template
│   └── PDFRenderer.tsx     # PDF generation utilities
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── providers/
│   └── QueryClientProvider.tsx # TanStack Query provider with custom config
├── services/
│   └── api.ts              # API service functions with axios interceptors
├── types/
│   └── strapi.ts           # TypeScript type definitions for Strapi entities
├── hooks/                  # Custom React hooks (e.g., useSpkData for TanStack Query patterns)
├── lib/                    # Utility functions
└── utils/                  # Additional utilities (GoogleMapsLoader)
```

### Path Aliases
The project uses path aliases configured in tsconfig.json and components.json:
- `@/*` maps to `./src/*`
- `@/components` maps to `./src/components`
- `@/lib` or `@/utils` maps to `./src/lib` or `./src/utils`
- `@/hooks` maps to `./src/hooks`
- `@/ui` maps to `./src/components/ui`

### Environment Variables
Required environment variables in `.env.local`:
```env
NEXT_PUBLIC_STRAPI_URL=your_strapi_api_url
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
STRAPI_API_TOKEN=your_strapi_api_token  # Optional
JWT_SECRET=your_jwt_secret_key          # For JWT token signing
```

### Important Build Configuration Notes
- **Static Export**: The app uses `output: 'export'` in next.config.js, which means it builds to `/out` as a static site
- **Image Optimization**: Images are unoptimized due to static export (`images.unoptimized: true`)
- **Build Errors Ignored**: TypeScript and ESLint errors are ignored during builds for faster deployment
- **Google Maps**: Webpack externals configuration prevents Google Maps from being bundled
- **Sharp**: Disabled via webpack alias (not needed for static export)

## Development Guidelines

### Component Selection Strategy
- **Use MUI for**: Data Grids (MUIDataGrid), complex forms, date/time pickers, advanced components
- **Use Shadcn UI for**: Standard UI elements (buttons, inputs, dialogs, dropdowns, alerts)
- **Use Tailwind for**: Layout, utilities, spacing, responsive design

### Form Patterns
- Use react-hook-form with zod or yup validation for most forms
- Some existing forms use Formik (e.g., in master data pages) - both patterns are acceptable
- Follow existing modal + form patterns in master data pages for consistency
- MUI components integrate with both react-hook-form and Formik

### API Integration
- Use generic CRUD APIs or create new ones with `createCRUDAPI`
- API service has comprehensive logging - check console for debugging
- Error handling via try/catch with toast notifications (using `sonner`)
- For new API endpoints, add to `src/services/api.ts` following existing patterns

**Strapi v4 Nested Relations Populate Pattern**:
```typescript
// For nested relations in Strapi v4, use bracket notation
apiParams['populate'] = 'salesProfile,detailInfo,unitInfo';
apiParams['populate[unitInfo]'] = 'vehicleType,color'; // nested populate

// Server-side pagination/sorting
apiParams['pagination[page]'] = page;
apiParams['pagination[pageSize]'] = pageSize;
apiParams[`sort[${field}]`] = order; // e.g., sort[createdAt]=desc
```

### Styling Approach
- MUI: Use theme object and sx prop for component-specific styling
- Shadcn UI: Use Tailwind classes and CSS custom properties
- Both systems work together without conflicts due to disabled Tailwind preflight
- Global styles and font imports are in `src/app/globals.css`

### Master Data Management
All master data modules (vehicle-types, vehicle-groups, colors, supervisors, branches) follow:
- Consistent CRUD pattern using CRUDTable or MUIDataGrid
- Shared modal patterns for create/edit forms
- Form validation with react-hook-form + zod/yup
- Branch management includes Google Maps integration for location pinning
- State managed via useState hooks in page components

### Authentication Development
- Check `localStorage.getItem('jwt_token')` for authentication state
- Use `authAPI.me()` to verify token validity
- ProtectedRoute wrapper ensures authentication before access
- 401 responses automatically clear tokens and redirect
- Role checks use `user.role === 'ADMIN'` pattern

### Toast Notifications
- Use `sonner` for toast notifications (already imported in most pages)
- Import: `import { toast } from 'sonner'`
- Methods: `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()`

### Google Maps Integration
- Use `@googlemaps/react-wrapper` for map components
- Use `@googlemaps/js-api-loader` for advanced loading scenarios
- API key from `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` env variable
- Webpack externals configured to prevent build issues

**Google Maps Initialization Pattern** (prevents race condition):
```typescript
// Use useLayoutEffect instead of useEffect for better DOM timing
useLayoutEffect(() => {
  loadGoogleMaps();
}, [loadGoogleMaps]);

// Retry mechanism for DOM availability
const tryInitMap = () => {
  const mapContainer = document.getElementById(MAP_CONTAINER_ID);
  if (mapContainer) {
    initMap();
  } else if (retries < maxRetries) {
    retries++;
    setTimeout(tryInitMap, 500);
  }
};
```

### PDF Generation
- Use `@react-pdf/renderer` for PDF document creation
- PDF document template is in `src/components/SpkDocument.tsx`
- PDF rendering utilities in `src/components/PDFRenderer.tsx`
- Uses `file-saver` for downloading generated PDFs

### TanStack Query Data Fetching Patterns
- Reference implementation in `src/hooks/useSpkData.ts`
- Custom hooks should return: data, loading state, error, refetch function, and parameter setters
- Use `queryClient.invalidateQueries()` after mutations to refresh data
- Build query keys as arrays: `['spks', params]` for proper cache invalidation
- For server-side operations: pass pagination, sorting, filtering params to API