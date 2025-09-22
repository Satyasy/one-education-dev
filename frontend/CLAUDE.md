# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- **Development server**: `npm run dev` (opens at http://localhost:3000)
- **Build**: `npm run build` (runs TypeScript check + Vite build)
- **Linting**: `npm run lint`
- **Preview production build**: `npm run preview`

### TypeScript
- The project uses strict TypeScript with these configs:
  - `tsconfig.app.json` for application code
  - `tsconfig.node.json` for Node.js tooling
- Build command includes TypeScript checking: `tsc -b && vite build`

## Architecture Overview

### Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit + RTK Query for API state
- **Routing**: React Router v7 with advanced protection patterns
- **Authentication**: Role-based + Permission-based access control
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Custom components built with Tailwind + Lucide icons

### Project Structure

**Core Application Structure:**
```
src/
├── app/store.ts              # Redux store with RTK Query APIs
├── api/                      # RTK Query API definitions
├── components/               # Reusable UI components organized by domain
├── hooks/                    # Custom React hooks (useAuth, useRole, etc.)
├── layout/                   # Application layout components
├── pages/                    # Route-level page components
├── providers/                # React context providers
├── routes/                   # Route protection and configuration
├── slice/                    # Redux slices for local state
├── types/                    # TypeScript type definitions
└── utils/                    # Utility functions
```

### Authentication & Authorization Architecture

**Multi-layered Protection System:**
1. **AuthProvider** (`src/providers/AuthProvider.tsx`) - Handles authentication state
2. **ProtectedRoute** - Basic authentication check
3. **EnhancedProtectedRoute** - Advanced protection with:
   - Role-based access (`roles: ['admin', 'kepala-urusan']`)
   - Permission-based access (`permissions: ['user.create', 'panjar.view']`)
   - Custom access functions (`accessCheck: () => boolean`)
   - Predefined patterns (`requireAdmin`, `requireAuthenticated`)

**Convenience Route Components:**
- `AdminRoute` - Admin-only access
- `PanjarRoute` - Panjar module access
- `BudgetRoute` - Budget module access

### State Management Architecture

**Redux Store Structure:**
- **RTK Query APIs**: All server state (userApi, panjarApi, budgetApi, etc.)
- **Local Slices**: UI state (userTableSlice, panjarTableSlice, etc.)

**API Layer:**
- Base query with axios + CSRF protection (`axiosBaseQuery.ts`)
- Automatic request/response handling with FormData support
- Consistent error handling across all APIs

### Key Business Domains

**User Management:**
- User CRUD operations with role/permission assignment
- Employee hierarchy and approval workflows

**Budget Management:**
- Budget years, items, and hierarchical budget structure
- Integration with Panjar (petty cash) requests

**Panjar (Petty Cash) System:**
- Request creation and approval workflows
- Realization items with file uploads
- Multi-step approval process with role-based routing

## Code Conventions

### React Patterns (from .cursor/rules)
- Use functional components with TypeScript interfaces
- Prefer `const` over `function` for component definitions
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`)
- Event handlers should have "handle" prefix (`handleClick`, `handleSubmit`)
- Early returns for error conditions and edge cases
- Use `function` keyword for pure utility functions

### Styling
- **Tailwind CSS v4** - Use utility classes exclusively
- Responsive design with mobile-first approach
- Use `class:` syntax instead of ternary operators when possible
- Component-based styling patterns

### File Organization
- Named exports for components
- File structure: Exported component → subcomponents → helpers → static content → types
- Use lowercase with dashes for directories (`auth-wizard`)

## Environment Configuration

**Required Environment Variables:**
- `VITE_SERVER_URL` - Backend API URL (default: http://localhost:8000/api)

## Important Implementation Notes

### API Integration
- All API calls use RTK Query with automatic caching and invalidation
- FormData uploads are handled specially in `axiosBaseQuery.ts`
- CSRF protection is enabled for all requests

### Route Protection
When adding new routes:
1. Determine required access level (authentication, roles, permissions)
2. Use appropriate protection component
3. Consider using convenience components (AdminRoute, PanjarRoute, etc.)

### Component Development
- Use existing components from `src/components/` as patterns
- Follow the domain-based organization (auth, common, ui, etc.)
- Implement accessibility features (tabindex, aria-labels, keyboard navigation)

### Form Handling
- Use React Hook Form with Zod for validation
- Follow existing patterns in user creation and budget forms
- Handle file uploads through FormData with proper API setup

### Permission System
The app implements a sophisticated permission system:
- Check `src/hooks/useAuth.ts` for available permission checking functions
- Use `hasAnyPermission()` and `hasAnyRole()` for access control
- Reference existing route protections for implementation patterns