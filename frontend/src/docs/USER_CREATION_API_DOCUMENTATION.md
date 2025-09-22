# 📝 User Creation with Roles & Permissions API Documentation

## 📋 Overview
API untuk membuat user baru dengan assignment roles dan permissions dalam satu proses yang simple dan atomic.

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

## 🎯 API Endpoints

### 1. **GET /api/users/create/form-data**
**Mendapatkan data yang diperlukan untuk form create user**

#### Request:
```http
GET /api/users/create/form-data
Authorization: Bearer {token}
Accept: application/json
```

#### Response Success (200):
```json
{
  "message": "Form data retrieved successfully",
  "data": {
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "guard_name": "web"
      },
      {
        "id": 7,
        "name": "guru",
        "guard_name": "web"
      },
      {
        "id": 5,
        "name": "kepala-administrasi",
        "guard_name": "web"
      },
      {
        "id": 2,
        "name": "kepala-sekolah",
        "guard_name": "web"
      },
      {
        "id": 4,
        "name": "kepala-urusan",
        "guard_name": "web"
      },
      {
        "id": 9,
        "name": "siswa",
        "guard_name": "web"
      },
      {
        "id": 6,
        "name": "staff",
        "guard_name": "web"
      },
      {
        "id": 3,
        "name": "wakil-kepala-sekolah",
        "guard_name": "web"
      },
      {
        "id": 8,
        "name": "wali-kelas",
        "guard_name": "web"
      }
    ],
    "permissions": [
      {
        "id": 18,
        "name": "approve panjar-items",
        "guard_name": "web"
      },
      {
        "id": 10,
        "name": "approve panjar-requests",
        "guard_name": "web"
      },
      {
        "id": 1,
        "name": "create",
        "guard_name": "web"
      },
      {
        "id": 13,
        "name": "create panjar-items",
        "guard_name": "web"
      },
      {
        "id": 5,
        "name": "create panjar-requests",
        "guard_name": "web"
      },
      {
        "id": 2,
        "name": "delete",
        "guard_name": "web"
      },
      {
        "id": 15,
        "name": "delete panjar-items",
        "guard_name": "web"
      },
      {
        "id": 7,
        "name": "delete panjar-requests",
        "guard_name": "web"
      },
      {
        "id": 3,
        "name": "edit",
        "guard_name": "web"
      },
      {
        "id": 14,
        "name": "edit panjar-items",
        "guard_name": "web"
      },
      {
        "id": 6,
        "name": "edit panjar-requests",
        "guard_name": "web"
      },
      {
        "id": 11,
        "name": "reject panjar-requests",
        "guard_name": "web"
      },
      {
        "id": 19,
        "name": "request revision panjar-items",
        "guard_name": "web"
      },
      {
        "id": 20,
        "name": "update status panjar-items",
        "guard_name": "web"
      },
      {
        "id": 9,
        "name": "verify panjar-requests",
        "guard_name": "web"
      },
      {
        "id": 4,
        "name": "view",
        "guard_name": "web"
      },
      {
        "id": 12,
        "name": "view panjar-items",
        "guard_name": "web"
      },
      {
        "id": 8,
        "name": "view panjar-requests",
        "guard_name": "web"
      },
      {
        "id": 16,
        "name": "view realization-items",
        "guard_name": "web"
      },
      {
        "id": 17,
        "name": "create realization-items",
        "guard_name": "web"
      }
    ]
  }
}
```

#### Response Error (500):
```json
{
  "message": "Failed to load form data",
  "error": "Error details"
}
```

---

### 2. **POST /api/users**
**Membuat user baru dengan roles dan permissions sekaligus**

#### Request:
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "password123",
  "roles": ["guru", "wali-kelas"],
  "permissions": ["create panjar-requests", "view panjar-requests"]
}
```

#### Request Body:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Nama lengkap user |
| email | string | Yes | Email user (harus unique) |
| password | string | Yes | Password user (minimal 8 karakter) |
| roles | array | No | Array nama roles yang akan di-assign |
| permissions | array | No | Array nama permissions tambahan yang akan di-assign |

#### Response Success (201):
```json
{
  "message": "User created successfully",
  "data": {
    "id": 47,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "email_verified_at": null,
    "created_at": "2025-09-10T12:30:00.000000Z",
    "updated_at": "2025-09-10T12:30:00.000000Z",
    "roles": [
      {
        "id": 7,
        "name": "guru",
        "guard_name": "web"
      },
      {
        "id": 8,
        "name": "wali-kelas",
        "guard_name": "web"
      }
    ],
    "permissions": {
      "all_permissions": [
        {
          "id": 5,
          "name": "create panjar-requests",
          "guard_name": "web",
          "source": "direct"
        },
        {
          "id": 8,
          "name": "view panjar-requests",
          "guard_name": "web",
          "source": "direct"
        }
      ],
      "permission_names": [
        "create panjar-requests",
        "view panjar-requests"
      ],
      "permissions_via_roles": [],
      "direct_permissions": [
        {
          "id": 5,
          "name": "create panjar-requests",
          "guard_name": "web"
        },
        {
          "id": 8,
          "name": "view panjar-requests",
          "guard_name": "web"
        }
      ]
    },
    "employee": null,
    "student": null,
    "approval_hierarchy": {
      "verifiers": [],
      "approvers": []
    },
    "finance_verification_hierarchy": {
      "finance_verifiers": []
    },
    "finance_approval_hierarchy": {
      "finance_approvers": []
    }
  }
}
```

#### Response Error (422):
```json
{
  "message": "Failed to create user",
  "error": "The email has already been taken."
}
```

#### Validation Errors (422):
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["Nama wajib diisi"],
    "email": ["Email sudah digunakan"],
    "password": ["Password minimal 8 karakter"],
    "roles.0": ["Role yang dipilih tidak valid"],
    "permissions.0": ["Permission yang dipilih tidak valid"]
  }
}
```

---

## 🔧 Validation Rules

### **Basic User Data:**
```php
[
    'name' => 'required|string|max:255',
    'email' => 'required|string|email|max:255|unique:users,email',
    'password' => 'required|string|min:8',
]
```

### **Roles & Permissions:**
```php
[
    'roles' => 'nullable|array',
    'roles.*' => 'string|exists:roles,name',
    'permissions' => 'nullable|array',
    'permissions.*' => 'string|exists:permissions,name',
]
```

---

## 📊 Available Data in System

### **Available Roles (9):**
| Name | Description |
|------|-------------|
| admin | Administrator dengan akses penuh |
| guru | Guru/Pengajar |
| kepala-administrasi | Kepala Administrasi |
| kepala-sekolah | Kepala Sekolah |
| kepala-urusan | Kepala Urusan per Unit |
| siswa | Siswa |
| staff | Staff administrasi |
| wakil-kepala-sekolah | Wakil Kepala Sekolah |
| wali-kelas | Wali Kelas |

### **Available Permissions (20):**
| Name | Description |
|------|-------------|
| approve panjar-items | Approve panjar items |
| approve panjar-requests | Approve panjar requests |
| create | Create general |
| create panjar-items | Create panjar items |
| create panjar-requests | Create panjar requests |
| delete | Delete general |
| delete panjar-items | Delete panjar items |
| delete panjar-requests | Delete panjar requests |
| edit | Edit general |
| edit panjar-items | Edit panjar items |
| edit panjar-requests | Edit panjar requests |
| reject panjar-items | Reject panjar items |
| reject panjar-requests | Reject panjar requests |
| revise panjar-items | Revise panjar items |
| revise panjar-requests | Revise panjar requests |
| verify panjar-items | Verify panjar items |
| verify panjar-requests | Verify panjar requests |
| view | View general |
| view panjar-items | View panjar items |
| view panjar-requests | View panjar requests |

---

---

## ❌ Error Responses

### **401 Unauthorized**
```json
{
  "message": "Unauthenticated."
}
```

### **422 Validation Error**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["Nama wajib diisi"],
    "email": ["Email sudah digunakan"],
    "password": ["Password minimal 8 karakter"],
    "roles.0": ["Role yang dipilih tidak valid"],
    "permissions.0": ["Permission yang dipilih tidak valid"]
  }
}
```

### **500 Server Error**
```json
{
  "message": "Failed to create user",
  "error": "Database connection error"
}
```

---

## ✨ Key Features

### **🔒 Atomic Transaction**
- Semua operasi (create user, assign roles, assign permissions) dalam satu transaction
- Jika ada error, semua perubahan di-rollback

### **🎯 Simple API**
- Hanya 2 endpoint: load form data + create user
- Satu request untuk create dengan semua data

### **📝 Comprehensive Validation**
- Validasi user data (name, email, password)
- Validasi roles exist di database
- Validasi permissions exist di database

### **🚀 Frontend Ready**
- Response format siap untuk consumption
- Error handling yang jelas
- Loading states support

---

## ✅ Summary

**User Creation API menyediakan:**

1. ✅ **Simple Workflow** - Load form data → Create user dengan semua data
2. ✅ **Atomic Operations** - Transaction DB untuk konsistensi
3. ✅ **Comprehensive Validation** - Validasi lengkap untuk semua fields
4. ✅ **Frontend Friendly** - Response format yang mudah dikonsumsi
5. ✅ **Error Handling** - Error response yang informatif

**Ready for Frontend Integration! 🎉**
