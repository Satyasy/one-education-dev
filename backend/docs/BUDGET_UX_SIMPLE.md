# Budget Form UX Flow - Simplified

## 🎯 **Mengapa Ada 2 API Endpoint?**

### **API 1: Check Existing** 📍
- **URL:** `POST /api/budgets/check-existing`  
- **Fungsi:** Hanya CEK apakah budget sudah ada
- **Kapan:** Otomatis saat user mengisi Unit + Year + Quarter
- **Response:** `{ exists: true/false, data: {...} }`

### **API 2: Create/Update** 💾
- **URL:** `POST /api/budgets`  
- **Fungsi:** SIMPAN data budget (create atau update)
- **Kapan:** Saat user klik tombol Submit
- **Response:** `{ message: "created/updated", data: {...} }`

---

## 📋 **User Journey Flow**

### **🔸 Step 1: User Mengisi Form Dasar**
```
Form State: INITIAL
┌─────────────────────────────┐
│ Unit:     [Dropdown ▼]     │
│ Year:     [Dropdown ▼]     │  
│ Quarter:  [Dropdown ▼]     │
│                             │
│ Budget Items: [Hidden]      │
│ Submit Button: [Hidden]     │
└─────────────────────────────┘
```

### **🔸 Step 2: Auto Check (Background)**
```
Trigger: Ketika ketiga field terisi
API Call: POST /api/budgets/check-existing

Loading State:
┌─────────────────────────────┐
│ Unit:     SMK Telkom        │
│ Year:     2025 (Aktif)      │  
│ Quarter:  Q1                │
│                             │
│ 🔄 Mengecek budget...       │
└─────────────────────────────┘
```

### **🔸 Step 3A: Budget BELUM ADA**
```
API Response: { exists: false }
Form State: NEW_BUDGET

┌─────────────────────────────┐
│ Unit:     SMK Telkom        │
│ Year:     2025 (Aktif)      │  
│ Quarter:  Q1                │
│                             │
│ ✅ Budget Q1 2025 belum     │
│    dibuat. Silakan isi!     │
│                             │
│ Budget Items:               │
│ ┌─────────────────────────┐ │
│ │ Item 1: [Form Fields]   │ │
│ │ Item 2: [Form Fields]   │ │
│ └─────────────────────────┘ │
│ [+ Tambah Item]             │
│                             │
│ [💾 SIMPAN BUDGET]          │
└─────────────────────────────┘
```

### **🔸 Step 3B: Budget SUDAH ADA**
```
API Response: { exists: true, data: {...} }
Form State: EXISTING_BUDGET

┌─────────────────────────────┐
│ Unit:     SMK Telkom        │
│ Year:     2025 (Aktif)      │  
│ Quarter:  Q1                │
│                             │
│ ⚠️  Budget Q1 2025 sudah    │
│     ada untuk unit ini!     │
│                             │
│ Data existing:              │
│ • IT Infrastructure - 500M  │
│ • Office Supplies - 50M     │
│                             │
│ Apakah ingin update?        │
│ [🔄 Ya, Update] [❌ Batal]  │
└─────────────────────────────┘
```

### **🔸 Step 4: User Pilih Update**
```
User Action: Klik "Ya, Update"
Form State: UPDATE_MODE

┌─────────────────────────────┐
│ Unit:     SMK Telkom        │
│ Year:     2025 (Aktif)      │  
│ Quarter:  Q1                │
│                             │
│ 🔄 Mode Update              │
│ Data lama akan diganti!     │
│                             │
│ Budget Items Baru:          │
│ ┌─────────────────────────┐ │
│ │ Item 1: [Form Fields]   │ │
│ │ Item 2: [Form Fields]   │ │
│ └─────────────────────────┘ │
│ [+ Tambah Item]             │
│                             │
│ [🔄 UPDATE BUDGET]          │
└─────────────────────────────┘
```

### **🔸 Step 5: Submit Final**
```
User Action: Klik Submit Button
API Call: POST /api/budgets

For NEW_BUDGET:
┌─────────────────────────────┐
│ ✅ Budget berhasil dibuat!  │
│                             │
│ Response:                   │
│ {                           │
│   message: "Budget created  │
│            successfully",   │
│   data: {...}              │
│ }                           │
└─────────────────────────────┘

For UPDATE_MODE:
┌─────────────────────────────┐
│ ✅ Budget berhasil diupdate!│
│                             │
│ Response:                   │
│ {                           │
│   message: "Budget updated  │
│            successfully",   │
│   data: {...}              │
│ }                           │
└─────────────────────────────┘
```

---

## 🎮 **Interactive Example**

### **Scenario A: Budget Baru**
```
1. User pilih: Unit=1, Year=2, Quarter=1
2. 🤖 Auto check: POST /api/budgets/check-existing
3. 📝 Response: { exists: false }
4. 📋 Show: Form budget items + "SIMPAN BUDGET"
5. 💾 User submit: POST /api/budgets
6. ✅ Success: "Budget created successfully"
```

### **Scenario B: Budget Update**
```
1. User pilih: Unit=1, Year=2, Quarter=1  
2. 🤖 Auto check: POST /api/budgets/check-existing
3. 📝 Response: { exists: true, data: {...} }
4. ⚠️  Show: Warning + existing data + confirm dialog
5. 🔄 User confirm: "Ya, Update"
6. 📋 Show: Form budget items + "UPDATE BUDGET"
7. 💾 User submit: POST /api/budgets
8. ✅ Success: "Budget updated successfully"
```

---

## 🧠 **Code Logic Simplified**

### **Frontend State Machine**
```javascript
const formStates = {
  INITIAL: 'initial',        // Form kosong
  CHECKING: 'checking',      // Sedang cek existing
  NEW_BUDGET: 'new',         // Budget belum ada
  EXISTING_BUDGET: 'exists', // Budget sudah ada
  UPDATE_MODE: 'update',     // Mode update
  SUBMITTING: 'submitting'   // Sedang submit
};

class BudgetForm {
  state = formStates.INITIAL;
  
  onFieldsComplete() {
    this.state = formStates.CHECKING;
    this.checkExisting();
  }
  
  async checkExisting() {
    const result = await api.checkExisting();
    
    if (result.exists) {
      this.state = formStates.EXISTING_BUDGET;
      this.showWarning();
    } else {
      this.state = formStates.NEW_BUDGET;
      this.showForm();
    }
  }
  
  onConfirmUpdate() {
    this.state = formStates.UPDATE_MODE;
    this.showForm();
  }
  
  async onSubmit() {
    this.state = formStates.SUBMITTING;
    const result = await api.submitBudget();
    this.showSuccess();
  }
}
```

### **Backend Logic**
```php
// BudgetRepository::create()
public function create($data) {
    $existing = $this->findExisting($data);
    
    if ($existing) {
        // UPDATE: Delete old items, create new ones
        $existing->budgetItems()->delete();
        foreach ($data['budget_items'] as $item) {
            $existing->budgetItems()->create($item);
        }
        return $existing;
    } else {
        // CREATE: New budget + items
        $budget = Budget::create($data);
        foreach ($data['budget_items'] as $item) {
            $budget->budgetItems()->create($item);
        }
        return $budget;
    }
}
```

---

## 🎯 **Key Benefits**

### **✅ For Users:**
- **No Surprises:** Tahu sejak awal kalau budget sudah ada
- **Clear Actions:** Tombol berbeda untuk create vs update  
- **Data Preview:** Lihat data existing sebelum update
- **Confirmation:** Konfirmasi sebelum overwrite data

### **✅ For Developers:**
- **Clean Separation:** Check vs Submit logic terpisah
- **Predictable:** State management yang jelas
- **Flexible:** Bisa extend untuk fitur lain
- **Maintainable:** Code yang mudah dipahami

---

## 🚀 **Ready to Implement!**

Sekarang sudah jelas kan? 

1. **Check API** = Untuk UI feedback  
2. **Submit API** = Untuk save data
3. **1 Form** dengan **multiple states**
4. **Smooth UX** tanpa trial-error
