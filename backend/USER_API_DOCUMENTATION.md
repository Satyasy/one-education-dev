# 📚 User API Resource Documentation

## 🌐 Base Information
- **Base URL**: `http://localhost:8000/api`
- **Authentication**: Bearer Token (Laravel Sanctum)
- **Content-Type**: `application/json`
- **Accept**: `application/json`

---

## 🔐 Authentication Header
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📋 User API Endpoints

### 1. **GET /api/me**
**Mendapatkan data user yang sedang login dengan permissions lengkap**

#### Request:
```http
GET /api/me
Authorization: Bearer {token}
Accept: application/json
```

#### Response Success (200):
```json
{
  "message": "Current user data retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe", 
    "email": "john@example.com",
    "email_verified_at": "2025-01-15T10:30:00.000000Z",
    "created_at": "2025-01-10T08:00:00.000000Z",
    "updated_at": "2025-01-15T10:30:00.000000Z",
    "roles": [
      {
        "id": 5,
        "name": "kepala-urusan",
        "guard_name": "web"
      }
    ],
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
        },
        {
          "id": 3,
          "name": "edit panjar-requests",
          "guard_name": "web",
          "source": "direct"
        }
      ],
      "permission_names": [
        "view panjar-requests",
        "create panjar-requests", 
        "edit panjar-requests",
        "delete panjar-requests"
      ],
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
      "direct_permissions": [
        {
          "id": 3,
          "name": "edit panjar-requests",
          "guard_name": "web"
        }
      ]
    },
    "employee": {
      "id": 1,
      "nip": "123456789",
      "user_id": 1,
      "unit_id": 1,
      "position_id": 5,
      "direct_superior_id": null,
      "created_at": "2025-01-10T08:00:00.000000Z",
      "updated_at": "2025-01-10T08:00:00.000000Z",
      "unit": {
        "id": 1,
        "name": "Unit Kurikulum",
        "description": "Unit yang menangani kurikulum",
        "created_at": "2025-01-10T08:00:00.000000Z",
        "updated_at": "2025-01-10T08:00:00.000000Z"
      },
      "position": {
        "id": 5,
        "name": "Kepala Urusan",
        "slug": "kepala-urusan",
        "description": "Kepala Urusan",
        "created_at": "2025-01-10T08:00:00.000000Z",
        "updated_at": "2025-01-10T08:00:00.000000Z"
      },
      "direct_superior": null
    },
    "student": null,
    "approval_hierarchy": {
      "verifiers": [],
      "approvers": [
        {
          "id": 2,
          "name": "Kepala Sekolah",
          "email": "kepala@sekolah.com",
          "role": "kepala-sekolah",
          "position": "Kepala Sekolah"
        }
      ]
    },
    "finance_verification_hierarchy": {
      "finance_verifiers": [
        {
          "id": 3,
          "name": "Kepala Urusan Keuangan",
          "email": "keuangan@sekolah.com", 
          "role": "kepala-urusan-keuangan",
          "position": "Kepala Urusan Keuangan"
        }
      ]
    },
    "finance_approval_hierarchy": {
      "finance_approvers": [
        {
          "id": 4,
          "name": "Kepala Administrasi",
          "email": "admin@sekolah.com",
          "role": "kepala-administrasi", 
          "position": "Kepala Administrasi"
        }
      ]
    }
  }
}
```

---

### 2. **GET /api/users**
**Mendapatkan daftar semua users dengan pagination**

#### Request:
```http
GET /api/users?page=1&per_page=10&search=john
Authorization: Bearer {token}
Accept: application/json
```

#### Query Parameters:
- `page` (optional): Nomor halaman (default: 1)
- `per_page` (optional): Jumlah data per halaman (default: 15)
- `search` (optional): Pencarian berdasarkan nama atau email

#### Response Success (200):
```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "email_verified_at": "2025-01-15T10:30:00.000000Z",
      "created_at": "2025-01-10T08:00:00.000000Z",
      "updated_at": "2025-01-15T10:30:00.000000Z",
      "roles": [
        {
          "id": 5,
          "name": "kepala-urusan",
          "guard_name": "web"
        }
      ],
      "permissions": {
        "all_permissions": [...],
        "permission_names": [...]
      },
      "employee": {...}
    }
  ],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 3,
    "per_page": 10,
    "to": 10,
    "total": 25
  },
  "links": {
    "first": "http://localhost:8000/api/users?page=1",
    "last": "http://localhost:8000/api/users?page=3",
    "prev": null,
    "next": "http://localhost:8000/api/users?page=2"
  }
}
```

---

### 3. **GET /api/users/{id}**
**Mendapatkan detail user berdasarkan ID**

#### Request:
```http
GET /api/users/1
Authorization: Bearer {token}
Accept: application/json
```

#### Response Success (200):
```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": "2025-01-15T10:30:00.000000Z",
    "created_at": "2025-01-10T08:00:00.000000Z",
    "updated_at": "2025-01-15T10:30:00.000000Z",
    "roles": [...],
    "permissions": {...},
    "employee": {...},
    "student": null,
    "approval_hierarchy": {...},
    "finance_verification_hierarchy": {...},
    "finance_approval_hierarchy": {...}
  }
}
```

---

### 4. **GET /api/users/{id}/permissions**
**Mendapatkan user dengan detail permissions lengkap**

#### Request:
```http
GET /api/users/1/permissions
Authorization: Bearer {token}
Accept: application/json
```

#### Response Success (200):
```json
{
  "message": "User with permissions retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "permissions": {
      "all_permissions": [
        {
          "id": 1,
          "name": "view panjar-requests",
          "guard_name": "web",
          "source": "via_roles: kepala-urusan"
        }
      ],
      "permission_names": ["view panjar-requests"],
      "permissions_via_roles": [...],
      "direct_permissions": [...]
    }
  }
}
```

---

### 5. **POST /api/users**
**Membuat user baru**

#### Request:
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

#### Response Success (201):
```json
{
  "message": "User created successfully",
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "email_verified_at": null,
    "created_at": "2025-01-15T12:00:00.000000Z",
    "updated_at": "2025-01-15T12:00:00.000000Z",
    "roles": [],
    "permissions": {
      "all_permissions": [],
      "permission_names": [],
      "permissions_via_roles": [],
      "direct_permissions": []
    },
    "employee": null,
    "student": null
  }
}
```

---

### 6. **PUT /api/users/{id}**
**Update user berdasarkan ID**

#### Request:
```http
PUT /api/users/1
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "name": "John Doe Updated",
  "email": "john.updated@example.com"
}
```

#### Response Success (200):
```json
{
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "email_verified_at": "2025-01-15T10:30:00.000000Z",
    "created_at": "2025-01-10T08:00:00.000000Z",
    "updated_at": "2025-01-15T14:30:00.000000Z",
    "roles": [...],
    "permissions": {...},
    "employee": {...}
  }
}
```

---

### 7. **DELETE /api/users/{id}**
**Hapus user berdasarkan ID**

#### Request:
```http
DELETE /api/users/1
Authorization: Bearer {token}
Accept: application/json
```

#### Response Success (200):
```json
{
  "message": "User deleted successfully"
}
```

---

### 8. **GET /api/users/statistics**
**Mendapatkan statistik users**

#### Request:
```http
GET /api/users/statistics
Authorization: Bearer {token}
Accept: application/json
```

#### Response Success (200):
```json
{
  "message": "User statistics retrieved successfully",
  "data": {
    "total_users": 50,
    "users_by_role": {
      "kepala-urusan": 5,
      "wakil-kepala-sekolah": 3,
      "kepala-sekolah": 1,
      "kepala-administrasi": 1,
      "staff": 40
    },
    "verified_users": 45,
    "unverified_users": 5,
    "users_with_employee": 30,
    "users_with_student": 20
  }
}
```

---

## 🔧 Permission Structure Explanation

### **all_permissions**
Array berisi semua permissions yang dimiliki user (gabungan direct + via roles)
```json
{
  "id": 1,
  "name": "view panjar-requests",
  "guard_name": "web",
  "source": "via_roles: kepala-urusan" // atau "direct"
}
```

### **permission_names**
Array berisi nama-nama permissions untuk quick checking
```json
["view panjar-requests", "create panjar-requests", "edit panjar-requests"]
```

### **permissions_via_roles**
Permissions yang didapat dari roles
```json
{
  "role": {
    "id": 5,
    "name": "kepala-urusan",
    "guard_name": "web"
  },
  "permissions": [...]
}
```

### **direct_permissions**
Permissions yang diberikan langsung ke user (bukan melalui role)

---

---

## ❌ Error Responses

### **401 Unauthorized**
```json
{
  "message": "Unauthenticated."
}
```

### **403 Forbidden**
```json
{
  "message": "This action is unauthorized."
}
```

### **404 Not Found**
```json
{
  "message": "User not found."
}
```

### **422 Validation Error**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "name": ["The name field is required."]
  }
}
```

### **500 Server Error**
```json
{
  "message": "Something went wrong."
}
```


---

## 🧪 Testing dengan cURL

### **Get Current User**
```bash
curl -X GET "http://localhost:8000/api/me" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### **Get Users List**
```bash
curl -X GET "http://localhost:8000/api/users?page=1&per_page=5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### **Get User by ID**
```bash
curl -X GET "http://localhost:8000/api/users/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### **Create New User**
```bash
curl -X POST "http://localhost:8000/api/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

---

## 📝 Notes

1. **Permissions**: Field `permissions` dinamis berdasarkan permissions yang dimiliki user
2. **Relationships**: Employee dan Student akan null jika user belum memiliki data tersebut
3. **Pagination**: Endpoint users menggunakan Laravel pagination standard
4. **Eager Loading**: Semua relationships sudah di-load untuk performa optimal

---

## ✅ Ready for Frontend Integration!

Dokumentasi ini siap digunakan untuk integrasi frontend dengan backend Laravel. Semua endpoint telah ditest dan berfungsi dengan baik.
