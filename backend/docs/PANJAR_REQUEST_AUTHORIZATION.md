# Panjar Request Authorization System

## 🛡️ **Overview Sistem Autorisasi**

Sistem autorisasi untuk PanjarRequest berdasarkan **unit kerja** dengan pengecualian untuk role tertentu yang memiliki akses global.

## 🔐 **Role-Based Access Control**

### **🌟 Global Access (Unrestricted)**
Role yang dapat mengakses **semua data** tanpa batasan unit:
- `admin` - Administrator sistem
- `kepala-sekolah` - Kepala sekolah
- `kepala-administrasi` - Kepala bagian administrasi

### **🏢 Unit-Restricted Access**
Role yang **hanya dapat mengakses data dari unit mereka sendiri**:
- `wakil-kepala-sekolah` - Wakil kepala sekolah
- `staff` - Staff unit kerja
- `bendahara` - Bendahara unit
- Dan role lainnya yang tidak termasuk dalam global access

## 📋 **Implementasi Authorization**

### **1. Service Layer (PanjarRequestService.php)**

#### **Helper Methods:**
```php
// Cek apakah user memiliki akses ke unit tertentu
private function hasUnitAccess(int $unitId): bool

// Dapatkan unit ID user atau null jika unrestricted
private function getUserUnitId(): ?int
```

#### **Authorization per Method:**

**getAll():**
- Global access: Lihat semua data
- Unit-restricted: Hanya data dari unit mereka

**createWithItems():**
- Cek apakah user dapat membuat panjar request untuk unit yang ditentukan
- Throw exception 403 jika tidak memiliki akses

**getById():**
- Cek apakah user memiliki akses ke unit dari panjar request
- Throw exception 403 jika tidak memiliki akses

**update() & updateWithItems():**
- Cek akses ke unit existing panjar request
- Jika mengubah unit_id, cek akses ke unit baru
- Throw exception 403 jika tidak memiliki akses

**delete():**
- Cek akses ke unit dari panjar request yang akan dihapus
- Throw exception 403 jika tidak memiliki akses

### **2. Repository Layer (PanjarRequestRepository.php)**

#### **getAll() Method:**
```php
// Auto-apply unit filter untuk non-privileged users
if ($user && $user->hasRole(['admin', 'kepala-sekolah','kepala-administrasi'])) {
    // No filter - show all data
} else {
    // Restrict to user's unit
    if ($user && $user->employee && $user->employee->unit) {
        $query->where('unit_id', $user->employee->unit->id);
    }
}
```

#### **getAllPanjarRequestStatistics() Method:**
```php
// Statistik dapat dibatasi per unit
public function getAllPanjarRequestStatistics(?int $unitId = null)
```

### **3. Controller Layer (PanjarRequestController.php)**

#### **Exception Handling:**
Semua method controller dibungkus dengan try-catch untuk menangani authorization exception:

```php
try {
    // Service method call
} catch (\Exception $e) {
    if ($e->getCode() === 403) {
        return response()->json(['message' => $e->getMessage()], 403);
    }
    throw $e;
}
```

## 🎯 **Authorization Rules per Role**

### **👑 Admin / Kepala Sekolah / Kepala Administrasi**
- ✅ **Create**: Dapat membuat panjar request untuk unit mana saja
- ✅ **Read**: Dapat melihat semua panjar request dari semua unit
- ✅ **Update**: Dapat mengupdate panjar request dari unit mana saja
- ✅ **Delete**: Dapat menghapus panjar request dari unit mana saja
- ✅ **Statistics**: Statistik global semua unit

### **🏢 Wakil Kepala Sekolah / Staff / Bendahara**
- ✅ **Create**: Hanya untuk unit mereka sendiri
- ✅ **Read**: Hanya panjar request dari unit mereka
- ✅ **Update**: Hanya panjar request dari unit mereka
- ✅ **Delete**: Hanya panjar request dari unit mereka
- ✅ **Statistics**: Statistik unit mereka saja

## 🔍 **Flow Authorization**

### **Skenario 1: User dengan Global Access**
```
1. User login sebagai "kepala-sekolah"
2. Memanggil GET /api/panjar-requests
3. Service: getUserUnitId() → return null (unrestricted)
4. Repository: No unit filter applied
5. Response: Semua panjar request dari semua unit
```

### **Skenario 2: User dengan Unit-Restricted Access**
```
1. User login sebagai "wakil-kepala-sekolah" dari Unit A
2. Memanggil GET /api/panjar-requests
3. Service: getUserUnitId() → return Unit A ID
4. Repository: Apply filter where unit_id = Unit A ID
5. Response: Hanya panjar request dari Unit A
```

### **Skenario 3: Unauthorized Access Attempt**
```
1. User dari Unit A mencoba akses panjar request dari Unit B
2. Service: hasUnitAccess(Unit B ID) → return false
3. Service: Throw exception dengan code 403
4. Controller: Catch exception, return 403 response
5. Response: { "message": "You do not have permission...", status: 403 }
```

## ⚠️ **Error Messages**

### **Forbidden Access (403)**
- `"You do not have permission to create panjar request for this unit"`
- `"You do not have permission to access this panjar request"`
- `"You do not have permission to update this panjar request"`
- `"You do not have permission to move panjar request to this unit"`
- `"You do not have permission to delete this panjar request"`

## 🧪 **Testing Authorization**

### **Test Cases:**

#### **Test 1: Global Access User**
```php
// Login sebagai kepala-sekolah
$user = User::factory()->create();
$user->assignRole('kepala-sekolah');

// Harus bisa akses semua unit
$response = $this->actingAs($user)->get('/api/panjar-requests');
$this->assertEquals(200, $response->status());
```

#### **Test 2: Unit-Restricted User - Own Unit**
```php
// Login sebagai wakil-kepala-sekolah dari Unit A
$user = User::factory()->create();
$user->assignRole('wakil-kepala-sekolah');
$user->employee->unit_id = 1;

// Buat panjar request di Unit A
$response = $this->actingAs($user)->post('/api/panjar-requests', [
    'unit_id' => 1,
    // ... data lainnya
]);
$this->assertEquals(201, $response->status());
```

#### **Test 3: Unit-Restricted User - Other Unit (Should Fail)**
```php
// Login sebagai wakil-kepala-sekolah dari Unit A
$user = User::factory()->create();
$user->assignRole('wakil-kepala-sekolah');
$user->employee->unit_id = 1;

// Coba buat panjar request di Unit B
$response = $this->actingAs($user)->post('/api/panjar-requests', [
    'unit_id' => 2,
    // ... data lainnya
]);
$this->assertEquals(403, $response->status());
```

## 🔧 **Configuration**

### **Prerequisite:**
1. User harus memiliki relasi ke Employee
2. Employee harus memiliki relasi ke Unit
3. Role harus sudah ter-assign dengan benar

### **Model Relations Required:**
```php
// User Model
public function employee() {
    return $this->hasOne(Employee::class);
}

// Employee Model  
public function unit() {
    return $this->belongsTo(Unit::class);
}
```

## ✅ **Benefits**

1. **🛡️ Security**: Data terisolasi per unit kerja
2. **🎯 Precision**: Role-based access yang granular
3. **🔄 Flexibility**: Mudah menambah role dengan access level berbeda
4. **📊 Analytics**: Statistik dapat dibatasi per unit
5. **🚫 Prevention**: Mencegah cross-unit data access
6. **🔍 Audit**: Clear authorization trail dalam logs

**Status: ✅ Authorization system implemented and ready to use!**
