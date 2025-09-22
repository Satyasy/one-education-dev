# 📝 Extended User Creation API - Employee & Student Data

## 🎯 Overview
Extension dari User Creation API yang memungkinkan pembuatan user sekaligus dengan data Employee atau Student dalam satu transaction.

## 🔄 Enhanced Workflow
```
Add User → Fill user data → Fill roles → Fill permissions → Choose user type → Fill employee/student data → Submit
```

---

## 📊 Enhanced Form Data Endpoint

### **GET /api/users/create/form-data**

#### Response Success (200):
```json
{
  "message": "Form data retrieved successfully",
  "data": {
    "roles": [
      {"id": 1, "name": "admin", "guard_name": "web"},
      {"id": 7, "name": "guru", "guard_name": "web"},
      {"id": 9, "name": "siswa", "guard_name": "web"}
    ],
    "permissions": [
      {"id": 5, "name": "create panjar-requests", "guard_name": "web"},
      {"id": 8, "name": "view panjar-requests", "guard_name": "web"}
    ],
    "units": [
      {"id": 1, "name": "Administrasi"},
      {"id": 2, "name": "Hubungan Industri"},
      {"id": 3, "name": "Kesiswaan"}
    ],
    "positions": [
      {"id": 1, "name": "Guru Bahasa Indonesia"},
      {"id": 2, "name": "Guru Matematika"},
      {"id": 3, "name": "Guru RPL"}
    ],
    "study_programs": [
      {"id": 1, "name": "Multimedia"},
      {"id": 2, "name": "Rekayasa Perangkat Lunak"},
      {"id": 3, "name": "Teknik Komputer dan Jaringan"}
    ],
    "cohorts": [
      {"id": 1, "year": "2024"},
      {"id": 2, "year": "2023"},
      {"id": 3, "year": "2022"}
    ]
  }
}
```

---

## 📝 Enhanced User Creation Endpoint

### **POST /api/users**

#### Request Body untuk Employee:
```json
{
  "name": "Teacher Name",
  "email": "teacher@example.com",
  "password": "password123",
  "user_type": "employee",
  "roles": ["guru", "wali-kelas"],
  "permissions": ["create panjar-requests", "view panjar-requests"],
  "employee": {
    "unit_id": 1,
    "position_id": 3,
    "nip": "123456789"
  }
}
```

#### Request Body untuk Student:
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "password123",
  "user_type": "student",
  "roles": ["siswa"],
  "permissions": ["view panjar-requests"],
  "student": {
    "study_program_id": 2,
    "cohort_id": 1,
    "parent_number": "081234567890",
    "parent_name": "Parent Name",
    "gender": "male"
  }
}
```

#### Request Body untuk Basic User (tanpa employee/student):
```json
{
  "name": "Basic User",
  "email": "basic@example.com",
  "password": "password123",
  "roles": ["staff"],
  "permissions": ["view"]
}
```

---

## 📋 Request Field Details

### **Basic User Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Nama lengkap user |
| email | string | Yes | Email user (harus unique) |
| password | string | Yes | Password user (minimal 8 karakter) |
| roles | array | No | Array nama roles |
| permissions | array | No | Array nama permissions |

### **User Type:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_type | string | No | "employee" atau "student" |

### **Employee Fields (required if user_type = "employee"):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| employee.unit_id | integer | Yes | ID unit tempat bekerja |
| employee.position_id | integer | Yes | ID posisi/jabatan |
| employee.nip | string | Yes | Nomor Induk Pegawai (unique) |

### **Student Fields (required if user_type = "student"):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| student.study_program_id | integer | Yes | ID program studi |
| student.cohort_id | integer | Yes | ID angkatan |
| student.parent_number | string | No | Nomor telepon orang tua |
| student.parent_name | string | No | Nama orang tua |
| student.gender | string | Yes | "male" atau "female" |

---

## ✅ Validation Rules

### **Enhanced Validation:**
```php
[
    // Basic user validation
    'name' => 'required|string|max:255',
    'email' => 'required|string|email|max:255|unique:users,email',
    'password' => 'required|string|min:8',
    'roles' => 'nullable|array',
    'roles.*' => 'string|exists:roles,name',
    'permissions' => 'nullable|array',
    'permissions.*' => 'string|exists:permissions,name',
    
    // User type validation
    'user_type' => 'nullable|string|in:employee,student',
    
    // Employee validation (conditional)
    'employee' => 'nullable|array',
    'employee.unit_id' => 'required_if:user_type,employee|integer|exists:units,id',
    'employee.position_id' => 'required_if:user_type,employee|integer|exists:positions,id',
    'employee.nip' => 'required_if:user_type,employee|string|max:50|unique:employees,nip',
    
    // Student validation (conditional)
    'student' => 'nullable|array',
    'student.study_program_id' => 'required_if:user_type,student|integer|exists:study_programs,id',
    'student.cohort_id' => 'required_if:user_type,student|integer|exists:cohorts,id',
    'student.parent_number' => 'nullable|string|max:20',
    'student.parent_name' => 'nullable|string|max:255',
    'student.gender' => 'required_if:user_type,student|string|in:male,female',
]
```
---

## ✨ Key Features

### **🔗 Atomic Transactions**
- User creation, role assignment, permission assignment, dan employee/student data dalam satu transaction
- Rollback otomatis jika ada error

### **🎯 Flexible User Types**
- **Basic User**: Hanya data user + roles/permissions
- **Employee**: User + roles/permissions + employee data
- **Student**: User + roles/permissions + student data

### **📝 Comprehensive Validation**
- Conditional validation berdasarkan user_type
- Employee data wajib jika user_type = "employee"
- Student data wajib jika user_type = "student"

### **🚀 Frontend Ready**
- Single endpoint untuk semua tipe user
- Rich form data untuk dropdown options
- Error handling yang detail

---

## ✅ Summary

**Enhanced User Creation API menyediakan:**

1. ✅ **Flexible User Types** - Basic, Employee, Student dalam satu endpoint
2. ✅ **Rich Form Data** - Units, positions, study programs, cohorts tersedia
3. ✅ **Atomic Operations** - Semua data dalam satu transaction
4. ✅ **Conditional Validation** - Validation rules berdasarkan user_type
5. ✅ **Frontend Friendly** - Single form, single request untuk semua scenarios

**Ready for Complete User Management! 🎉**
