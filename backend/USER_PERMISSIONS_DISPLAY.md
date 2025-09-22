# User Permissions Display Documentation

## 📋 **Overview**

Dokumentasi ini menjelaskan cara menampilkan permissions pada user di sistem. Sistem telah diupdate untuk menampilkan permissions yang dimiliki user baik secara langsung (direct) maupun melalui roles.

## 🔧 **Implementasi yang Telah Ditambahkan**

### **1. UserResource Enhancement**
File: `app/Http/Resources/UserResource.php`

**Fitur baru yang ditambahkan:**
- Field `permissions` yang menampilkan semua permissions user
- Method `getUserPermissions()` untuk mengumpulkan permissions
- Method `getPermissionSource()` untuk mengetahui sumber permission
- Method `getPermissionsViaRoles()` untuk permissions dari roles
- Method `getDirectPermissions()` untuk permissions langsung

### **2. UserRepository Update**
File: `app/Repositories/UserRepository.php`

**Perubahan:**
- Eager loading `permissions` dan `roles.permissions`
- Load relationships: `['roles', 'permissions', 'roles.permissions']`

### **3. UserController New Endpoints**
File: `app/Http/Controllers/UserController.php`

**Endpoint baru:**
- `GET /api/users/{id}/permissions` - Get user dengan detail permissions
- `GET /api/me` - Get current user dengan permissions

---

## 🌐 **API Endpoints**

### **1. GET /api/me**
**Get Current Authenticated User with Permissions**

#### **Request:**
```bash
GET /api/me
Authorization: Bearer {token}
```

#### **Response:**
```json
{
  "message": "Current user data retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["kepala-urusan"],
    "permissions": {
      "all_permissions": [
        {
          "id": 1,
          "name": "view panjar-requests",
          "guard_name": "web",
          "source": "via_roles: kepala-urusan"
        },
        {
          "id": 2,
          "name": "create panjar-requests",
          "guard_name": "web",
          "source": "via_roles: kepala-urusan"
        }
      ],
      "permission_names": [
        "view panjar-requests",
        "create panjar-requests",
        "edit panjar-requests",
        "delete panjar-requests"
      ],
      "can": {
        "view_panjar_requests": true,
        "create_panjar_requests": true,
        "edit_panjar_requests": true,
        "delete_panjar_requests": true
      },
      "permissions_via_roles": [
        {
          "role": {
            "id": 5,
            "name": "kepala-urusan",
            "guard_name": "web"
          },
          "permissions": [
            {
              "id": 1,
              "name": "view panjar-requests",
              "guard_name": "web"
            },
            {
              "id": 2,
              "name": "create panjar-requests",
              "guard_name": "web"
            }
          ]
        }
      ],
      "direct_permissions": []
    },
    "employee": {
      "id": 1,
      "nip": "123456789",
      "unit": {
        "id": 1,
        "name": "Unit Kurikulum"
      },
      "position": {
        "id": 5,
        "name": "Kepala Urusan"
      },
      "direct_superior": null
    }
  }
}
```

---

### **2. GET /api/users/{id}/permissions**
**Get Specific User with Permissions**

#### **Request:**
```bash
GET /api/users/1/permissions
Authorization: Bearer {token}
```

#### **Response:**
```json
{
  "message": "User with permissions retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "permissions": {
      "all_permissions": [...],
      "permission_names": [...],
      "can": {...},
      "permissions_via_roles": [...],
      "direct_permissions": [...]
    }
  }
}
```

---

### **3. GET /api/users**
**Get All Users (dengan permissions)**

#### **Request:**
```bash
GET /api/users?per_page=10
Authorization: Bearer {token}
```

#### **Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["kepala-urusan"],
      "permissions": {
        "all_permissions": [...],
        "permission_names": [...],
        "can": {...}
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 15
  }
}
```

---

## 📊 **Permission Structure Explained**

### **1. all_permissions**
**Semua permissions yang dimiliki user (gabungan direct + via roles)**
```json
"all_permissions": [
  {
    "id": 1,
    "name": "view panjar-requests",
    "guard_name": "web",
    "source": "via_roles: kepala-urusan"
  },
  {
    "id": 5,
    "name": "manage users",
    "guard_name": "web", 
    "source": "direct"
  }
]
```

### **2. permission_names**
**Array nama permissions untuk checking cepat**
```json
"permission_names": [
  "view panjar-requests",
  "create panjar-requests",
  "edit panjar-requests",
  "delete panjar-requests"
]
```

### **3. can**
**Boolean check untuk permissions spesifik**
```json
"can": {
  "view_panjar_requests": true,
  "create_panjar_requests": true,
  "edit_panjar_requests": true,
  "delete_panjar_requests": true
}
```

### **4. permissions_via_roles**
**Permissions yang didapat dari roles**
```json
"permissions_via_roles": [
  {
    "role": {
      "id": 5,
      "name": "kepala-urusan",
      "guard_name": "web"
    },
    "permissions": [
      {
        "id": 1,
        "name": "view panjar-requests",
        "guard_name": "web"
      }
    ]
  }
]
```

### **5. direct_permissions**
**Permissions yang diberikan langsung ke user**
```json
"direct_permissions": [
  {
    "id": 10,
    "name": "special access",
    "guard_name": "web"
  }
]
```

---

## 🎯 **Use Cases & Examples**

### **Frontend Permission Checking**

#### **1. Check if user can perform action:**
```javascript
// JavaScript example
const userData = response.data;

// Method 1: Using can object
if (userData.permissions.can.view_panjar_requests) {
    // Show panjar requests menu
}

// Method 2: Using permission_names array
if (userData.permissions.permission_names.includes('view panjar-requests')) {
    // Show view button
}

// Method 3: Check specific permission with source
const viewPermission = userData.permissions.all_permissions.find(
    p => p.name === 'view panjar-requests'
);
if (viewPermission) {
    console.log('Permission source:', viewPermission.source);
}
```

#### **2. Display user's roles and permissions:**
```javascript
// Display roles
userData.roles.forEach(role => {
    console.log('Role:', role);
});

// Display permissions by role
userData.permissions.permissions_via_roles.forEach(rolePermission => {
    console.log(`Role: ${rolePermission.role.name}`);
    rolePermission.permissions.forEach(permission => {
        console.log(`  - ${permission.name}`);
    });
});

// Display direct permissions
userData.permissions.direct_permissions.forEach(permission => {
    console.log(`Direct: ${permission.name}`);
});
```

#### **3. Permission-based UI rendering:**
```javascript
// React/Vue example
const canCreatePanjar = userData.permissions.can.create_panjar_requests;
const canEditPanjar = userData.permissions.can.edit_panjar_requests;
const canDeletePanjar = userData.permissions.can.delete_panjar_requests;

return (
    <div>
        {canCreatePanjar && <button>Create Panjar</button>}
        {canEditPanjar && <button>Edit</button>}
        {canDeletePanjar && <button>Delete</button>}
    </div>
);
```

---

## 🔍 **Backend Permission Usage**

### **1. In Controllers:**
```php
// Check permission in controller
public function index(Request $request)
{
    $user = $request->user();
    
    if (!$user->can('view panjar-requests')) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    
    // Continue with logic...
}
```

### **2. In Middleware:**
```php
// In routes
Route::get('panjar-requests', [PanjarRequestController::class, 'index'])
    ->middleware('can:view panjar-requests');
```

### **3. In Blade Templates:**
```blade
@can('view panjar-requests')
    <a href="/panjar-requests">View Panjar Requests</a>
@endcan

@hasrole('kepala-urusan')
    <button>Kepala Urusan Actions</button>
@endhasrole
```

---

## ⚡ **Performance Considerations**

### **1. Eager Loading**
Relationships di-load otomatis:
- `roles`
- `permissions` 
- `roles.permissions`
- `employee.unit`
- `employee.position`

### **2. Caching Recommendations**
```php
// Dalam production, bisa cache permissions
$permissions = Cache::remember("user.{$userId}.permissions", 3600, function() use ($userId) {
    return User::with(['roles.permissions', 'permissions'])->find($userId);
});
```

### **3. Selective Loading**
Untuk performance, load hanya yang diperlukan:
```php
// Hanya load permissions tanpa employee data
$user = User::with(['roles.permissions', 'permissions'])->find($id);
```

---

## 🧪 **Testing**

### **1. Test Current User Endpoint:**
```bash
curl -X GET "http://localhost:8000/api/me" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### **2. Test User with Permissions:**
```bash
curl -X GET "http://localhost:8000/api/users/1/permissions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### **3. Test Users List:**
```bash
curl -X GET "http://localhost:8000/api/users?per_page=5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

---

## ✅ **Summary**

**Sekarang sistem dapat menampilkan:**

1. ✅ **All permissions** - Gabungan direct + via roles
2. ✅ **Permission source** - Tahu dari mana permission didapat
3. ✅ **Permission names** - Array untuk quick checking
4. ✅ **Can object** - Boolean checks untuk UI
5. ✅ **Permissions via roles** - Detail per role
6. ✅ **Direct permissions** - Permissions langsung ke user
7. ✅ **Current user endpoint** - `/api/me` untuk logged user
8. ✅ **User permissions endpoint** - `/api/users/{id}/permissions`

**Routes tersedia:**
- `GET /api/me` - Current user dengan permissions
- `GET /api/users/{id}/permissions` - User specific dengan permissions  
- `GET /api/users` - All users dengan permissions

**Ready to use untuk frontend development!** 🚀
