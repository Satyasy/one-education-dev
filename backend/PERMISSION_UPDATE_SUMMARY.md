# Permission Update Summary

## Overview
Updated the permission system to use simplified permission names that match the existing permissions table structure.

## Changes Made

### 1. Permission Names Updated
**Before:**
- `view panjar-requests`
- `create panjar-requests`
- `update panjar-requests`
- `delete panjar-requests`

**After:**
- `view`
- `create`
- `edit`
- `delete`

### 2. Files Modified

#### PanjarRequestModelPermissionSeeder.php
- Updated permission names to use simplified format
- Changed `update` to `edit` to match table data
- Role permission mappings updated accordingly

#### routes/api.php
- Updated middleware permissions for panjar-requests routes:
  - `can:view panjar-requests` → `can:view`
  - `can:create panjar-requests` → `can:create`
  - `can:update panjar-requests` → `can:edit`
  - `can:delete panjar-requests` → `can:delete`

### 3. Role Permissions Mapping
- **kepala-sekolah**: `view` only
- **wakil-kepala-sekolah**: `view` only  
- **kepala-administrasi**: `view` only
- **kepala-urusan**: `view`, `create`, `edit`, `delete`

### 4. Database Structure
Uses the existing permissions table with IDs:
- ID 1: `create`
- ID 2: `edit`
- ID 3: `delete`
- ID 4: `view`

## Implementation Notes
- The seeder now references existing permission names from the database
- All panjar-requests API routes are protected with the updated permission middleware
- Role-based access control maintained with granular permissions
- Unit-based authorization still applies at the service layer

## Verification
Run the seeder to apply changes:
```bash
php artisan db:seed --class=PanjarRequestModelPermissionSeeder
```

Check routes:
```bash
php artisan route:list | findstr "panjar-requests"
```
