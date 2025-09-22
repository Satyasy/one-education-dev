# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `composer dev` - Start development servers (PHP server, queue worker, Vite)
- `php artisan serve` - Start PHP development server only
- `php artisan queue:listen --tries=1` - Start queue worker
- `npm run dev` - Start Vite development server for frontend assets

### Testing
- `composer test` - Run PHPUnit tests (clears config first)
- `php artisan test` - Run tests directly
- `php artisan test --filter=TestName` - Run specific test

### Code Quality
- `./vendor/bin/pint` - Format code using Laravel Pint
- `php artisan config:clear` - Clear configuration cache
- `php artisan route:clear` - Clear route cache

### Database
- `php artisan migrate` - Run database migrations
- `php artisan db:seed` - Run database seeders
- `php artisan db:seed --class=ClassName` - Run specific seeder

## Architecture Overview

This is a Laravel 12 application implementing a school administration and budget management system with role-based access control.

### Core Business Domains

**Budget Management System:**
- Budget Years (`BudgetYear`) - Annual budget periods with active status tracking
- Budgets (`Budget`) - Unit-specific budgets within a budget year
- Budget Items (`BudgetItem`) - Individual line items in budgets

**Panjar (Advance Payment) System:**
- Panjar Requests (`PanjarRequest`) - Advance payment requests with approval workflow
- Panjar Items (`PanjarItem`) - Individual items within requests with status tracking
- Panjar Realization Items (`PanjarRealizationItem`) - Actual spending records with file attachments

**User & Organization Management:**
- Users (`User`) - System users with role-based permissions
- Units (`Unit`) - Organizational departments/divisions
- Employees (`Employee`) - Staff linked to users with positions and units
- Positions (`Position`) - Job roles/titles

**Academic System:**
- Students (`Student`) - Student records with cohort assignments
- Study Programs (`StudyProgram`) - Academic programs
- Classes (`Classes`) - Class definitions
- Academic Years (`AcademicYear`) - Academic year periods
- Semesters (`Semester`) - Academic semesters
- Cohorts (`Cohort`) - Student enrollment groups

### Architecture Pattern

The application follows a **Repository-Service-Controller** pattern:

1. **Controllers** (`app/Http/Controllers/`) - Handle HTTP requests and responses
2. **Services** (`app/Services/`) - Contain business logic and orchestrate operations
3. **Repositories** (`app/Repositories/`) - Handle data access and database operations
4. **Requests** (`app/Http/Requests/`) - Validate incoming HTTP requests
5. **Resources** (`app/Http/Resources/`) - Transform models for API responses

### Authentication & Authorization

- **Laravel Sanctum** for API token authentication
- **Spatie Laravel Permission** for role-based access control
- Permissions are granular (view, create, update, delete) per resource
- Key roles: `kepala-sekolah`, `wakil-kepala-sekolah`, `kepala-administrasi`, `kepala-urusan`

### Database Structure

- Uses MySQL as primary database
- SQLite for testing (configured in phpunit.xml)
- Database queue driver for job processing
- Database session storage

### API Design

- RESTful API endpoints under `/api` prefix
- All authenticated routes require Sanctum middleware
- Permission middleware on sensitive operations
- Consistent JSON response format via Resources
- Pagination support on list endpoints

### Key Integrations

- **Laravel Pail** for real-time log viewing
- **Laravel Tinker** for interactive REPL
- **Laravel Blueprint** for rapid scaffolding (dev)
- **Laravel Boost** for performance optimizations (dev)

### File Management

- File uploads handled for Panjar Realization Items
- Auto-deletion of files when items are deleted
- Local filesystem storage (configurable)

## Development Notes

### Permission System
The application uses a comprehensive permission system. When adding new features:
1. Create appropriate permissions using `PermissionController` endpoints
2. Assign permissions to roles via the API
3. Use `can:permission-name` middleware on routes
4. Check permissions in services/repositories when needed

### Service Layer Pattern
Business logic should be implemented in Service classes:
- Services coordinate between repositories
- Handle complex business rules and validations
- Manage transactions for multi-model operations
- Services are injected into controllers

### Testing Strategy
- Feature tests for API endpoints
- Unit tests for business logic in services
- Database transactions are rolled back between tests
- SQLite in-memory database for speed

### Code Style
- Laravel Pint is configured for code formatting
- Follow PSR-12 coding standards
- Use type hints and return types
- Implement proper error handling in controllers