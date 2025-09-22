# Employee API Documentation

## 📋 **Overview**

API untuk mengelola data Employee yang terintegrasi dengan User, Unit, dan Position. Employee merepresentasikan staff atau karyawan dalam sistem dengan informasi lengkap seperti NIP, unit kerja, dan posisi jabatan.

## 🏗️ **Architecture**

### **Layer Structure:**
- **Controller**: `EmployeeController.php` - HTTP request handling
- **Service**: `EmployeeService.php` - Business logic layer
- **Repository**: `EmployeeRepository.php` - Data access layer
- **Request**: `EmployeeRequest.php` - Request validation
- **Resource**: `EmployeeResource.php` - Response formatting
- **Model**: `Employee.php` - Eloquent model

## 📊 **Employee Model Relations**

### **Relationships:**
```php
Employee belongsTo User
Employee belongsTo Unit  
Employee belongsTo Position
```

### **Model Fields:**
- `id` (Primary Key)
- `user_id` (Foreign Key to users table)
- `unit_id` (Foreign Key to units table)
- `position_id` (Foreign Key to positions table)
- `nip` (Nomor Induk Pegawai - Unique)
- `created_at` & `updated_at` (Timestamps)

## 🛠️ **API Endpoints**

### **Base URL:** `/api/employees`

---

## 📖 **1. GET /api/employees**
**Get All Employees**

### **Query Parameters:**
- `per_page` (integer, optional) - Items per page for pagination
- `unit_id` (integer, optional) - Filter by unit ID
- `position_id` (integer, optional) - Filter by position ID
- `nip` (string, optional) - Search by NIP (partial match)
- `search` (string, optional) - Search by NIP, name, or email

### **Example Request:**
```bash
GET /api/employees?per_page=10&unit_id=1&search=john
```

### **Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "unit_id": 1,
      "position_id": 2,
      "nip": "198501012023011001",
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z",
      "user": {
        "id": 5,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "email_verified_at": "2024-01-15T10:30:00.000000Z",
        "created_at": "2024-01-15T10:30:00.000000Z",
        "updated_at": "2024-01-15T10:30:00.000000Z"
      },
      "unit": {
        "id": 1,
        "name": "Bagian Keuangan",
        "description": "Unit yang mengelola keuangan sekolah",
        "code": "KEUANGAN"
      },
      "position": {
        "id": 2,
        "name": "Bendahara",
        "description": "Jabatan bendahara unit",
        "level": 3
      }
    }
  ],
  "links": {...},
  "meta": {...}
}
```

---

## 📝 **2. POST /api/employees**
**Create New Employee**

### **Request Body:**
```json
{
  "user_id": 5,
  "unit_id": 1,
  "position_id": 2,
  "nip": "198501012023011001"
}
```

### **Validation Rules:**
- `user_id`: required, integer, exists in users table, unique in employees table
- `unit_id`: required, integer, exists in units table
- `position_id`: required, integer, exists in positions table
- `nip`: required, string, max 50 chars, unique in employees table

### **Example Response (201):**
```json
{
  "message": "Employee created successfully",
  "data": {
    "id": 1,
    "user_id": 5,
    "unit_id": 1,
    "position_id": 2,
    "nip": "198501012023011001",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

### **Error Response (409 - Conflict):**
```json
{
  "message": "NIP already exists"
}
```

---

## 🔍 **3. GET /api/employees/{id}**
**Get Employee by ID**

### **Path Parameters:**
- `id` (integer, required) - Employee ID

### **Example Response (200):**
```json
{
  "message": "Employee retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 5,
    "unit_id": 1,
    "position_id": 2,
    "nip": "198501012023011001",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z",
    "user": {...},
    "unit": {...},
    "position": {...}
  }
}
```

### **Error Response (404):**
```json
{
  "message": "Employee not found"
}
```

---

## ✏️ **4. PUT /api/employees/{id}**
**Update Employee**

### **Path Parameters:**
- `id` (integer, required) - Employee ID

### **Request Body:**
```json
{
  "user_id": 5,
  "unit_id": 2,
  "position_id": 3,
  "nip": "198501012023011002"
}
```

### **Example Response (200):**
```json
{
  "message": "Employee updated successfully",
  "data": {
    "id": 1,
    "user_id": 5,
    "unit_id": 2,
    "position_id": 3,
    "nip": "198501012023011002",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T15:45:00.000000Z"
  }
}
```

---

## 🗑️ **5. DELETE /api/employees/{id}**
**Delete Employee**

### **Path Parameters:**
- `id` (integer, required) - Employee ID

### **Example Response (200):**
```json
{
  "message": "Employee deleted successfully"
}
```

---

## 🔗 **Additional Endpoints**

### **6. GET /api/employees/user/{userId}**
**Get Employee by User ID**

### **Example Response:**
```json
{
  "message": "Employee retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 5,
    "unit_id": 1,
    "position_id": 2,
    "nip": "198501012023011001",
    "user": {...},
    "unit": {...},
    "position": {...}
  }
}
```

---

### **7. GET /api/employees/nip/{nip}**
**Get Employee by NIP**

### **Example Response:**
```json
{
  "message": "Employee retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 5,
    "unit_id": 1,
    "position_id": 2,
    "nip": "198501012023011001",
    "user": {...},
    "unit": {...},
    "position": {...}
  }
}
```

---

### **8. GET /api/employees/unit/{unitId}**
**Get Employees by Unit ID**

### **Example Response:**
```json
{
  "message": "Employees retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "unit_id": 1,
      "position_id": 2,
      "nip": "198501012023011001",
      "user": {...},
      "unit": {...},
      "position": {...}
    }
  ]
}
```

---

### **9. GET /api/employees/position/{positionId}**
**Get Employees by Position ID**

### **Example Response:**
```json
{
  "message": "Employees retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "unit_id": 1,
      "position_id": 2,
      "nip": "198501012023011001",
      "user": {...},
      "unit": {...},
      "position": {...}
    }
  ]
}
```

---

### **10. GET /api/employees/statistics**
**Get Employee Statistics**

### **Example Response:**
```json
{
  "message": "Employee statistics retrieved successfully",
  "data": {
    "total_employees": 150,
    "employees_by_unit": [
      {
        "unit_id": 1,
        "unit_name": "Bagian Keuangan",
        "total": 25
      },
      {
        "unit_id": 2,
        "unit_name": "Bagian Akademik",
        "total": 45
      }
    ],
    "employees_by_position": [
      {
        "position_id": 1,
        "position_name": "Kepala Unit",
        "total": 8
      },
      {
        "position_id": 2,
        "position_name": "Bendahara",
        "total": 10
      }
    ]
  }
}
```

---

## 🚀 **Employee Resource Features**

### **Advanced Relations (with ?include_relations=true):**
```json
{
  "id": 1,
  "user_id": 5,
  "unit_id": 1,
  "position_id": 2,
  "nip": "198501012023011001",
  "direct_superior": {
    "id": 2,
    "nip": "198001012020011001",
    "user": {
      "id": 3,
      "name": "Jane Smith",
      "email": "jane.smith@example.com"
    },
    "position": {
      "id": 1,
      "name": "Kepala Unit"
    }
  },
  "subordinates": [
    {
      "id": 3,
      "nip": "199001012024011001",
      "user": {
        "id": 7,
        "name": "Bob Wilson",
        "email": "bob.wilson@example.com"
      },
      "position": {
        "id": 3,
        "name": "Staff"
      }
    }
  ]
}
```

---

## 📋 **Validation Rules Summary**

### **Create & Update Employee:**
- **user_id**: Required, must exist in users table, unique per employee
- **unit_id**: Required, must exist in units table
- **position_id**: Required, must exist in positions table
- **nip**: Required, string (max 50), unique per employee

### **Unique Constraints:**
- One user can only have one employee record
- NIP must be unique across all employees
- System validates uniqueness during create/update operations

---

## 🔍 **Search & Filter Capabilities**

### **Available Filters:**
1. **Unit Filter**: `unit_id=1`
2. **Position Filter**: `position_id=2`
3. **NIP Search**: `nip=198501` (partial match)
4. **General Search**: `search=john` (searches NIP, name, email)

### **Pagination Support:**
- Use `per_page` parameter for pagination
- Returns Laravel paginated response with meta information

---

## ⚡ **Performance Optimizations**

### **Eager Loading:**
- All queries automatically include user, unit, and position relationships
- Optimized N+1 query prevention

### **Efficient Filtering:**
- Database-level filtering for better performance
- Indexed searches on foreign keys and NIP

---

## 🛡️ **Security & Validation**

### **Input Validation:**
- Comprehensive validation rules for all fields
- Custom error messages for better UX
- Foreign key existence validation

### **Business Logic:**
- Prevents duplicate NIP assignments
- Ensures one user per employee record
- Maintains referential integrity

---

## 🧪 **Testing Examples**

### **Create Employee Test:**
```bash
curl -X POST /api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "user_id": 5,
    "unit_id": 1,
    "position_id": 2,
    "nip": "198501012023011001"
  }'
```

### **Search Employees Test:**
```bash
curl -X GET "/api/employees?search=john&unit_id=1&per_page=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Get Employee Statistics Test:**
```bash
curl -X GET /api/employees/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Status: ✅ Employee API fully implemented and ready to use!**
