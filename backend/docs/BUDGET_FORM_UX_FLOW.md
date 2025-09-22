# Budget Form UX Flow

## 🎯 **Penjelasan 2 API Endpoint**

### **1. Check Existing API** 
`POST /api/budgets/check-existing` 
**Tujuan:** Hanya untuk CEK apakah budget sudah ada atau belum

### **2. Create/Update API**
`POST /api/budgets`
**Tujuan:** Untuk SIMPAN data budget (otomatis create atau update)

---

## 📱 **Form UX Flow Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                     BUDGET FORM                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Unit: [Dropdown: SMK Telkom Sidoarjo ▼]                      │
│  Year: [Dropdown: 2025 (Aktif) ▼]                             │
│  Quarter: [Dropdown: Q1 ▼]                                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⚠️  OTOMATIS CEK SAAT USER LENGKAPI 3 FIELD DI ATAS    │   │
│  │     API: POST /api/budgets/check-existing               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                          ▼                                     │
│                                                                 │
│  ┌─ JIKA BUDGET BELUM ADA ─────────────────────────────────┐   │
│  │ ✅ "Silakan buat budget untuk Q1 2025"                  │   │
│  │                                                         │   │
│  │ Budget Items:                                           │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ Item 1: [Nama] [Deskripsi] [Jumlah]      [❌]      │ │   │
│  │ │ Item 2: [Nama] [Deskripsi] [Jumlah]      [❌]      │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │ [+ Tambah Item]                                         │   │
│  │                                                         │   │
│  │ [💾 SIMPAN BUDGET]  ← API: POST /api/budgets          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ JIKA BUDGET SUDAH ADA ─────────────────────────────────┐   │
│  │ ⚠️  "Budget Q1 2025 sudah ada untuk unit ini!"         │   │
│  │                                                         │   │
│  │ Data yang sudah ada:                                    │   │
│  │ • IT Infrastructure - Rp 500,000,000                   │   │
│  │ • Office Supplies - Rp 50,000,000                      │   │
│  │                                                         │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ Apakah Anda ingin mengupdate budget yang ada?      │ │   │
│  │ │ [🔄 Ya, Update] [❌ Batal]                         │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │                                                         │   │
│  │ Jika pilih "Ya, Update":                               │   │
│  │ Budget Items: (Form muncul dengan data kosong)         │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ Item 1: [Nama] [Deskripsi] [Jumlah]      [❌]      │ │   │
│  │ │ Item 2: [Nama] [Deskripsi] [Jumlah]      [❌]      │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │ [+ Tambah Item]                                         │   │
│  │                                                         │   │
│  │ [🔄 UPDATE BUDGET]  ← API: POST /api/budgets          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Step-by-Step User Experience**

### **Step 1: User Mengisi Form Dasar**
```javascript
// User memilih Unit, Year, Quarter
form = {
  unit_id: 1,           // SMK Telkom Sidoarjo
  budget_year_id: 2,    // 2025 (Aktif)
  quarterly: 1,         // Q1
  budget_items: []      // Masih kosong
}
```

### **Step 2: Otomatis Cek Existing (Background)**
```javascript
// Saat ketiga field terisi, otomatis panggil API check
const response = await fetch('/api/budgets/check-existing', {
  method: 'POST',
  body: JSON.stringify({
    unit_id: 1,
    budget_year_id: 2,
    quarterly: 1
  })
});

const result = await response.json();
```

### **Step 3A: Jika Budget BELUM ADA**
```javascript
if (!result.exists) {
  // Tampilkan form budget items kosong
  showMessage("✅ Silakan buat budget untuk Q1 2025");
  showBudgetItemsForm(); // Form kosong
  submitButtonText = "💾 SIMPAN BUDGET";
}
```

### **Step 3B: Jika Budget SUDAH ADA**
```javascript
if (result.exists) {
  // Tampilkan data existing + konfirmasi
  showMessage("⚠️ Budget Q1 2025 sudah ada!");
  showExistingData(result.data.budget_items);
  
  const confirmed = await showConfirmDialog(
    "Apakah Anda ingin mengupdate budget yang ada?"
  );
  
  if (confirmed) {
    showBudgetItemsForm(); // Form kosong untuk input baru
    submitButtonText = "🔄 UPDATE BUDGET";
  } else {
    hideForm(); // User batal
  }
}
```

### **Step 4: Submit Data**
```javascript
// Untuk CREATE maupun UPDATE, tetap pakai endpoint yang sama
const response = await fetch('/api/budgets', {
  method: 'POST',
  body: JSON.stringify({
    unit_id: 1,
    budget_year_id: 2,
    quarterly: 1,
    budget_items: [
      { name: "IT Infrastructure", amount_allocation: 500000000 },
      { name: "Office Supplies", amount_allocation: 50000000 }
    ]
  })
});

// Backend otomatis tahu apakah create atau update
const result = await response.json();
showSuccess(result.message); // "Budget created" atau "Budget updated"
```

---

## 🎨 **Visual Mock-up Form**

### **State 1: Form Awal**
```
┌─────────────────────────────────────────┐
│ 📋 Buat Budget Baru                    │
├─────────────────────────────────────────┤
│                                         │
│ Unit Kerja:                            │
│ [Pilih Unit ▼]                         │
│                                         │
│ Tahun Anggaran:                        │
│ [Pilih Tahun ▼]                        │
│                                         │
│ Kuartal:                               │
│ [Pilih Kuartal ▼]                      │
│                                         │
│ Budget Items:                          │
│ [Form ini akan muncul setelah          │
│  ketiga field di atas terisi]          │
│                                         │
└─────────────────────────────────────────┘
```

### **State 2: Budget Belum Ada (After Check)**
```
┌─────────────────────────────────────────┐
│ 📋 Buat Budget Baru                    │
├─────────────────────────────────────────┤
│                                         │
│ Unit Kerja: SMK Telkom Sidoarjo       │
│ Tahun Anggaran: 2025 (Aktif)          │
│ Kuartal: Q1                            │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✅ Budget Q1 2025 belum dibuat     │ │
│ │    Silakan isi budget items        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Budget Items:                          │
│ ┌─────────────────────────────────────┐ │
│ │ Nama: [IT Infrastructure]           │ │
│ │ Desc: [Server dan networking]       │ │
│ │ Jumlah: [500000000]        [Hapus]  │ │
│ └─────────────────────────────────────┘ │
│ [+ Tambah Item Lain]                   │
│                                         │
│ [💾 SIMPAN BUDGET]                     │
└─────────────────────────────────────────┘
```

### **State 3: Budget Sudah Ada (After Check)**
```
┌─────────────────────────────────────────┐
│ 📋 Buat Budget Baru                    │
├─────────────────────────────────────────┤
│                                         │
│ Unit Kerja: SMK Telkom Sidoarjo       │
│ Tahun Anggaran: 2025 (Aktif)          │
│ Kuartal: Q1                            │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ⚠️  Budget Q1 2025 sudah ada!      │ │
│ │                                     │ │
│ │ Data existing:                      │ │
│ │ • IT Infrastructure - 500,000,000  │ │
│ │ • Office Supplies - 50,000,000     │ │
│ │                                     │ │
│ │ [🔄 Update Budget] [❌ Batal]      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Form budget items akan muncul jika     │
│  user pilih "Update Budget"]           │
└─────────────────────────────────────────┘
```

### **State 4: Update Mode (After Confirm)**
```
┌─────────────────────────────────────────┐
│ 📋 Update Budget Q1 2025               │
├─────────────────────────────────────────┤
│                                         │
│ Unit Kerja: SMK Telkom Sidoarjo       │
│ Tahun Anggaran: 2025 (Aktif)          │
│ Kuartal: Q1                            │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🔄 Mode Update                      │ │
│ │ Data lama akan diganti sepenuhnya   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Budget Items Baru:                     │
│ ┌─────────────────────────────────────┐ │
│ │ Nama: [Data Center]                 │ │
│ │ Desc: [Server baru]                 │ │
│ │ Jumlah: [800000000]        [Hapus]  │ │
│ └─────────────────────────────────────┘ │
│ [+ Tambah Item Lain]                   │
│                                         │
│ [🔄 UPDATE BUDGET]                     │
└─────────────────────────────────────────┘
```

---

## 💡 **Kenapa 2 API Endpoint?**

### **1. Pisahkan Concern**
- **Check API**: Hanya untuk UI feedback (cek status)
- **Submit API**: Untuk aksi save/update data

### **2. Better UX**
- User tahu lebih awal kalau budget sudah ada
- Bisa konfirmasi sebelum submit
- Tidak perlu trial-error

### **3. Performance**
- Check API lebih ringan (tidak submit data besar)
- Submit API baru dipanggil kalau user yakin

---

## 🔧 **Implementation Tips**

### **JavaScript Pseudo Code**
```javascript
class BudgetForm {
  constructor() {
    this.state = 'initial'; // initial, checked, confirmed
    this.existingBudget = null;
  }
  
  // Dipanggil saat ketiga field terisi
  async onSelectionComplete() {
    this.state = 'checking';
    this.showLoader("Mengecek budget...");
    
    const existing = await this.checkExisting();
    
    if (existing.exists) {
      this.state = 'exists';
      this.existingBudget = existing.data;
      this.showExistingBudgetWarning();
    } else {
      this.state = 'new';
      this.showBudgetItemsForm();
    }
  }
  
  // User konfirmasi mau update
  onConfirmUpdate() {
    this.state = 'confirmed';
    this.showBudgetItemsForm();
    this.changeSubmitButton('UPDATE BUDGET');
  }
  
  // User submit form
  async onSubmit() {
    const result = await this.submitBudget();
    
    if (this.state === 'new') {
      this.showSuccess('Budget berhasil dibuat!');
    } else {
      this.showSuccess('Budget berhasil diupdate!');
    }
  }
}
```

---

## ✅ **Kesimpulan**

1. **Check API** = Untuk validasi UI dan feedback user
2. **Submit API** = Untuk menyimpan data final  
3. **1 Form** tapi **berbeda state** berdasarkan hasil check
4. **User Experience** yang smooth tanpa surprises
5. **Backend Smart** - otomatis tahu create vs update
