# PanjarRequest Model Permission Seeder Documentation

## 📋 **Overview**

Seeder untuk mengatur permission model `PanjarRequest` berdasarkan role dengan menggunakan Spatie Permission package. Seeder ini mengisi tabel `model_has_permissions` dengan aturan akses yang spesifik untuk setiap role.

## 🔐 **Permission Structure**

### **Permissions yang Dibuat:**
- `view panjar-requests` - Hak untuk melihat data panjar request
- `create panjar-requests` - Hak untuk membuat panjar request baru
- `update panjar-requests` - Hak untuk mengupdate panjar request
- `delete panjar-requests` - Hak untuk menghapus panjar request

## 👥 **Role-Based Permissions**

### **🔍 Read-Only Roles (Hanya Bisa View):**

#### **1. kepala-sekolah**
- ✅ **view panjar-requests** - Dapat melihat semua panjar request
- ❌ **create panjar-requests** - Tidak dapat membuat
- ❌ **update panjar-requests** - Tidak dapat mengupdate
- ❌ **delete panjar-requests** - Tidak dapat menghapus

#### **2. wakil-kepala-sekolah**
- ✅ **view panjar-requests** - Dapat melihat panjar request
- ❌ **create panjar-requests** - Tidak dapat membuat
- ❌ **update panjar-requests** - Tidak dapat mengupdate
- ❌ **delete panjar-requests** - Tidak dapat menghapus

#### **3. kepala-administrasi**
- ✅ **view panjar-requests** - Dapat melihat panjar request
- ❌ **create panjar-requests** - Tidak dapat membuat
- ❌ **update panjar-requests** - Tidak dapat mengupdate
- ❌ **delete panjar-requests** - Tidak dapat menghapus

### **🛠️ Full Access Role (CRUD Complete):**

#### **4. kepala-urusan**
- ✅ **view panjar-requests** - Dapat melihat panjar request
- ✅ **create panjar-requests** - Dapat membuat panjar request baru
- ✅ **update panjar-requests** - Dapat mengupdate panjar request
- ✅ **delete panjar-requests** - Dapat menghapus panjar request

## 🏗️ **Technical Implementation**

### **Seeder Process:**

#### **Step 1: Create Permissions**
```php
$permissions = [
    'view panjar-requests',
    'create panjar-requests', 
    'update panjar-requests',
    'delete panjar-requests',
];

foreach ($permissions as $permission) {
    Permission::firstOrCreate(['name' => $permission]);
}
```

#### **Step 2: Define Role Permissions**
```php
$rolePermissions = [
    'kepala-sekolah' => ['view panjar-requests'],
    'wakil-kepala-sekolah' => ['view panjar-requests'],
    'kepala-administrasi' => ['view panjar-requests'],
    'kepala-urusan' => [
        'view panjar-requests',
        'create panjar-requests',
        'update panjar-requests', 
        'delete panjar-requests'
    ],
];
```

#### **Step 3: Sync Role Permissions**
```php
foreach ($rolePermissions as $roleName => $rolePerms) {
    $role = Role::firstOrCreate(['name' => $roleName]);
    $permissions = Permission::whereIn('name', $rolePerms)->get();
    $role->syncPermissions($permissions);
}
```

#### **Step 4: Insert Model Permissions**
```php
$modelType = PanjarRequest::class;

foreach ($rolePermissions as $roleName => $rolePerms) {
    $role = Role::where('name', $roleName)->first();
    
    foreach ($rolePerms as $permissionName) {
        $permission = Permission::where('name', $permissionName)->first();
        
        // Insert into model_has_permissions table
        DB::table('model_has_permissions')->insert([
            'permission_id' => $permission->id,
            'model_type' => $modelType,
            'model_id' => $role->id,
        ]);
    }
}
```

## 🗃️ **Database Structure**

### **Table: model_has_permissions**
```sql
CREATE TABLE model_has_permissions (
    permission_id BIGINT UNSIGNED NOT NULL,
    model_type VARCHAR(255) NOT NULL,
    model_id BIGINT UNSIGNED NOT NULL,
    INDEX model_has_permissions_model_id_model_type_index (model_id, model_type),
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (permission_id, model_id, model_type)
);
```

### **Sample Data After Seeding:**
```sql
-- kepala-sekolah role permissions
INSERT INTO model_has_permissions VALUES (1, 'App\\Models\\PanjarRequest', 1);

-- wakil-kepala-sekolah role permissions  
INSERT INTO model_has_permissions VALUES (1, 'App\\Models\\PanjarRequest', 2);

-- kepala-administrasi role permissions
INSERT INTO model_has_permissions VALUES (1, 'App\\Models\\PanjarRequest', 3);

-- kepala-urusan role permissions (Full CRUD)
INSERT INTO model_has_permissions VALUES (1, 'App\\Models\\PanjarRequest', 4);
INSERT INTO model_has_permissions VALUES (2, 'App\\Models\\PanjarRequest', 4);
INSERT INTO model_has_permissions VALUES (3, 'App\\Models\\PanjarRequest', 4);
INSERT INTO model_has_permissions VALUES (4, 'App\\Models\\PanjarRequest', 4);
```

## 🚀 **Usage Instructions**

### **1. Run Individual Seeder:**
```bash
php artisan db:seed --class=PanjarRequestModelPermissionSeeder
```

### **2. Run All Seeders (Including This One):**
```bash
php artisan db:seed
```

### **3. Reset & Reseed:**
```bash
php artisan migrate:fresh --seed
```

## 🔍 **Permission Checking in Code**

### **Using Spatie Permission Methods:**

#### **Check Role Permission:**
```php
// Check if user has permission for PanjarRequest
$user = auth()->user();

// Direct permission check
if ($user->can('view panjar-requests')) {
    // User can view panjar requests
}

if ($user->can('create panjar-requests')) {
    // User can create panjar requests
}

// Role-based check
if ($user->hasRole('kepala-urusan')) {
    // This role has full CRUD access
}
```

#### **In Controller/Middleware:**
```php
// Using middleware
Route::middleware('can:view panjar-requests')->group(function () {
    Route::get('/panjar-requests', [PanjarRequestController::class, 'index']);
});

// In controller method
public function store(Request $request)
{
    $this->authorize('create panjar-requests');
    // Create logic here
}
```

#### **In Blade Templates:**
```php
@can('create panjar-requests')
    <button>Create New Request</button>
@endcan

@can('update panjar-requests')
    <button>Edit Request</button>
@endcan

@can('delete panjar-requests')
    <button>Delete Request</button>
@endcan
```

## 📊 **Permission Matrix**

| Role | View | Create | Update | Delete |
|------|------|--------|--------|--------|
| **kepala-sekolah** | ✅ | ❌ | ❌ | ❌ |
| **wakil-kepala-sekolah** | ✅ | ❌ | ❌ | ❌ |
| **kepala-administrasi** | ✅ | ❌ | ❌ | ❌ |
| **kepala-urusan** | ✅ | ✅ | ✅ | ✅ |

## 🛠️ **Customization**

### **Adding New Roles:**
```php
// In rolePermissions array, add new role
'new-role-name' => ['view panjar-requests'],
```

### **Adding New Permissions:**
```php
// Add to permissions array
$permissions = [
    'view panjar-requests',
    'create panjar-requests', 
    'update panjar-requests',
    'delete panjar-requests',
    'approve panjar-requests', // New permission
];
```

### **Changing Role Permissions:**
```php
// Update specific role permissions
'kepala-sekolah' => [
    'view panjar-requests',
    'approve panjar-requests' // Add approval permission
],
```

## ⚠️ **Important Notes**

### **Prerequisites:**
1. Spatie Permission package must be installed and configured
2. Roles must exist in the database (created by UserRoleSeeder)
3. PanjarRequest model must exist

### **Safety Features:**
- Uses `firstOrCreate()` to prevent duplicate permissions
- Checks for existing entries before inserting into `model_has_permissions`
- Uses `syncPermissions()` to replace old permissions cleanly

### **Debugging:**
- Seeder provides console output for each operation
- Shows which permissions are added vs already exist
- Displays role-permission assignments clearly

## 🧪 **Testing the Permissions**

### **Test Permission Assignment:**
```php
// Test if permissions were created
$permission = Permission::where('name', 'view panjar-requests')->first();
assertNotNull($permission);

// Test role has correct permissions
$role = Role::where('name', 'kepala-urusan')->first();
assertTrue($role->hasPermissionTo('create panjar-requests'));
assertTrue($role->hasPermissionTo('view panjar-requests'));

// Test read-only roles
$readOnlyRole = Role::where('name', 'kepala-sekolah')->first();
assertTrue($readOnlyRole->hasPermissionTo('view panjar-requests'));
assertFalse($readOnlyRole->hasPermissionTo('create panjar-requests'));
```

### **Test User Permissions:**
```php
// Assign role to user and test
$user = User::factory()->create();
$user->assignRole('kepala-urusan');

assertTrue($user->can('create panjar-requests'));
assertTrue($user->can('view panjar-requests'));
assertTrue($user->can('update panjar-requests'));
assertTrue($user->can('delete panjar-requests'));
```

---

**Status: ✅ PanjarRequest Model Permission Seeder ready to use!**

**File Location:** `database/seeders/PanjarRequestModelPermissionSeeder.php`

**Added to:** `DatabaseSeeder.php` for automatic execution
