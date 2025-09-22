# Budget Create/Update Flow

## 🔄 Alur Baru Pembuatan Budget

### Konsep
User memilih:
1. **Unit** - Unit kerja
2. **Year** - Tahun anggaran (hanya yang aktif)
3. **Quarterly** - Kuartal (1-4)
4. **Budget Items** - Item-item anggaran

### Logika
- Jika budget dengan kombinasi (unit_id, budget_year_id, quarterly) **sudah ada** → **UPDATE**
- Jika budget dengan kombinasi tersebut **belum ada** → **CREATE**

## 📊 API Endpoints

### 1. Check Existing Budget
```bash
POST /api/budgets/check-existing
Content-Type: application/json

{
  "unit_id": 1,
  "budget_year_id": 2,
  "quarterly": 1
}
```

**Response jika sudah ada:**
```json
{
  "message": "Budget already exists",
  "exists": true,
  "data": {
    "id": 5,
    "unit": {
      "id": 1,
      "name": "SMK Telkom Sidoarjo"
    },
    "budget_year": {
      "id": 2,
      "year": 2025,
      "is_active": true
    },
    "quarterly": 1,
    "budget_items": [
      {
        "id": 10,
        "name": "IT Infrastructure",
        "description": "Server dan networking",
        "amount_allocation": 500000000
      }
    ]
  }
}
```

**Response jika belum ada:**
```json
{
  "message": "Budget does not exist",
  "exists": false,
  "data": null
}
```

### 2. Create/Update Budget
```bash
POST /api/budgets
Content-Type: application/json

{
  "unit_id": 1,
  "budget_year_id": 2,
  "quarterly": 1,
  "budget_items": [
    {
      "name": "IT Infrastructure",
      "description": "Server dan networking",
      "amount_allocation": 500000000
    },
    {
      "name": "Office Supplies",
      "description": "Alat tulis kantor",
      "amount_allocation": 50000000
    }
  ]
}
```

**Response:**
```json
{
  "message": "Budget created successfully", // atau "Budget updated successfully"
  "data": {
    "id": 5,
    "unit": {...},
    "budget_year": {...},
    "quarterly": 1,
    "budget_items": [...]
  }
}
```

## 🔧 Frontend Implementation

### JavaScript/React Example:
```javascript
class BudgetForm {
  async checkExistingBudget(unitId, budgetYearId, quarterly) {
    const response = await fetch('/api/budgets/check-existing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        unit_id: unitId,
        budget_year_id: budgetYearId,
        quarterly: quarterly
      })
    });
    
    const result = await response.json();
    return result;
  }
  
  async submitBudget(formData) {
    // 1. Check if budget exists
    const existingCheck = await this.checkExistingBudget(
      formData.unit_id,
      formData.budget_year_id,
      formData.quarterly
    );
    
    if (existingCheck.exists) {
      // Show confirmation dialog
      const confirmed = confirm(
        `Budget untuk unit ini pada Q${formData.quarterly} ${existingCheck.data.budget_year.year} sudah ada. 
        Apakah Anda ingin mengupdate data yang ada?`
      );
      
      if (!confirmed) return;
    }
    
    // 2. Submit budget (will auto create or update)
    const response = await fetch('/api/budgets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert(existingCheck.exists ? 'Budget berhasil diupdate!' : 'Budget berhasil dibuat!');
      return result.data;
    } else {
      throw new Error(result.message);
    }
  }
}
```

### Vue.js Example:
```vue
<template>
  <form @submit.prevent="submitForm">
    <!-- Unit Selection -->
    <select v-model="form.unit_id" required>
      <option value="">Pilih Unit</option>
      <option v-for="unit in units" :key="unit.value" :value="unit.value">
        {{ unit.label }}
      </option>
    </select>
    
    <!-- Budget Year Selection -->
    <select v-model="form.budget_year_id" required>
      <option value="">Pilih Tahun Anggaran</option>
      <option v-for="year in budgetYears" :key="year.value" :value="year.value">
        {{ year.label }}
      </option>
    </select>
    
    <!-- Quarterly Selection -->
    <select v-model="form.quarterly" required>
      <option value="">Pilih Kuartal</option>
      <option value="1">Q1 (Jan-Mar)</option>
      <option value="2">Q2 (Apr-Jun)</option>
      <option value="3">Q3 (Jul-Sep)</option>
      <option value="4">Q4 (Oct-Dec)</option>
    </select>
    
    <!-- Budget Items -->
    <div v-for="(item, index) in form.budget_items" :key="index">
      <input v-model="item.name" placeholder="Nama Item" required>
      <textarea v-model="item.description" placeholder="Deskripsi"></textarea>
      <input v-model.number="item.amount_allocation" type="number" placeholder="Jumlah Alokasi" required>
      <button type="button" @click="removeItem(index)">Hapus</button>
    </div>
    
    <button type="button" @click="addItem">Tambah Item</button>
    <button type="submit" :disabled="loading">{{ loading ? 'Processing...' : 'Simpan Budget' }}</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        unit_id: '',
        budget_year_id: '',
        quarterly: '',
        budget_items: [
          { name: '', description: '', amount_allocation: 0 }
        ]
      }
    }
  },
  methods: {
    async checkExisting() {
      if (!this.form.unit_id || !this.form.budget_year_id || !this.form.quarterly) {
        return { exists: false };
      }
      
      const response = await this.$http.post('/api/budgets/check-existing', {
        unit_id: this.form.unit_id,
        budget_year_id: this.form.budget_year_id,
        quarterly: this.form.quarterly
      });
      
      return response.data;
    },
    
    async submitForm() {
      this.loading = true;
      
      try {
        // Check if budget exists
        const existingCheck = await this.checkExisting();
        
        if (existingCheck.exists) {
          const confirmed = await this.$confirm(
            `Budget untuk unit ini pada Q${this.form.quarterly} sudah ada. Apakah Anda ingin mengupdate?`,
            'Budget Sudah Ada',
            { type: 'warning' }
          );
          
          if (!confirmed) {
            this.loading = false;
            return;
          }
        }
        
        // Submit budget
        const response = await this.$http.post('/api/budgets', this.form);
        
        this.$message.success(
          existingCheck.exists ? 'Budget berhasil diupdate!' : 'Budget berhasil dibuat!'
        );
        
        this.$router.push('/budgets');
        
      } catch (error) {
        this.$message.error(error.message || 'Terjadi kesalahan');
      } finally {
        this.loading = false;
      }
    },
    
    addItem() {
      this.form.budget_items.push({
        name: '',
        description: '',
        amount_allocation: 0
      });
    },
    
    removeItem(index) {
      this.form.budget_items.splice(index, 1);
    }
  },
  
  watch: {
    // Auto-check when user selects unit, year, quarterly
    'form.unit_id': 'onSelectionChange',
    'form.budget_year_id': 'onSelectionChange',
    'form.quarterly': 'onSelectionChange'
  },
  
  methods: {
    async onSelectionChange() {
      if (this.form.unit_id && this.form.budget_year_id && this.form.quarterly) {
        const existing = await this.checkExisting();
        if (existing.exists) {
          this.$message.info(`Budget untuk Q${this.form.quarterly} sudah ada. Data akan diupdate jika Anda melanjutkan.`);
        }
      }
    }
  }
}
</script>
```

## 🔄 Backend Logic Flow

### BudgetRepository::create()
```php
1. Check if budget exists with (unit_id, budget_year_id, quarterly)
2. If EXISTS:
   - Delete existing budget_items
   - Create new budget_items
   - Return updated budget
3. If NOT EXISTS:
   - Create new budget
   - Create budget_items
   - Return new budget
```

### Database Transaction
- Semua operasi dibungkus dalam DB transaction
- Rollback otomatis jika ada error
- Atomic operation untuk konsistensi data

## 🎯 Benefits

1. **User Friendly**: User tidak perlu khawatir duplikasi data
2. **Flexible**: Bisa update budget items kapan saja
3. **Safe**: Transaction-based untuk data integrity
4. **Predictable**: Selalu ada feedback apakah create atau update

## ⚠️ Important Notes

- Budget items akan **direplace** sepenuhnya, bukan di-merge
- Kombinasi (unit_id, budget_year_id, quarterly) adalah **unique constraint**
- Semua operasi menggunakan **database transaction**
- Budget year harus dalam status **active** untuk bisa dipilih
