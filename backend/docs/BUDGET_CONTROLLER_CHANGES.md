# Budget Controller API Changes

## Perubahan pada BudgetController

### 🔄 Field Changes
**Sebelum:** `['id', 'unit_id', 'year', 'quarterly']`
**Sesudah:** `['id', 'unit_id', 'budget_year_id', 'quarterly']`

### 🆕 Parameter Baru untuk Index

```php
// Parameter yang bisa digunakan di GET /api/budgets
$params = [
    'search' => $request->input('search'),          // Search term
    'unit_id' => $request->input('unit_id'),        // Filter by unit
    'budget_year_id' => $request->input('budget_year_id'), // NEW: Filter by budget year
    'active_year_only' => $request->input('active_year_only'), // NEW: Only active year
    'sort_field' => $request->input('sort_field', 'created_at'),
    'sort_order' => $request->input('sort_order', 'desc'),
    'page' => (int) $request->input('page', 1),
    'per_page' => (int) $request->input('per_page', 10),
];
```

### 📊 Response Format Improvements

Semua response sekarang konsisten dengan format:
```json
{
  "message": "Operation completed successfully",
  "data": {...},
  "meta": {...} // untuk pagination
}
```

### 🛠️ Methods Added

- ✅ `update()` - Update budget
- ✅ `destroy()` - Delete budget

## API Usage Examples

### 1. Get All Budgets
```bash
GET /api/budgets
GET /api/budgets?budget_year_id=2
GET /api/budgets?active_year_only=true
GET /api/budgets?unit_id=1&budget_year_id=2&quarterly=1
```

**Response:**
```json
{
  "message": "Budgets retrieved successfully",
  "data": [
    {
      "id": 1,
      "unit": {
        "id": 1,
        "name": "SMK Telkom Sidoarjo"
      },
      "budget_year": {
        "id": 2,
        "year": 2025,
        "is_active": true,
        "description": "Tahun Anggaran 2025 (Aktif)"
      },
      "quarterly": 1,
      "budget_items": [...],
      "created_at": "2025-08-04T...",
      "updated_at": "2025-08-04T..."
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 50,
    "total_pages": 5
  }
}
```

### 2. Create Budget
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
    }
  ]
}
```

### 3. Update Budget
```bash
PUT /api/budgets/1
Content-Type: application/json

{
  "unit_id": 1,
  "budget_year_id": 2,
  "quarterly": 2,
  "budget_items": [...]
}
```

### 4. Delete Budget
```bash
DELETE /api/budgets/1
```

**Response:**
```json
{
  "message": "Budget deleted successfully"
}
```

## Frontend Integration

### JavaScript/React Example:
```javascript
// Get budgets for active year only
const fetchActiveBudgets = async () => {
  const response = await fetch('/api/budgets?active_year_only=true');
  const data = await response.json();
  return data.data;
};

// Filter budgets by unit and year
const fetchBudgetsByFilter = async (unitId, budgetYearId) => {
  const response = await fetch(
    `/api/budgets?unit_id=${unitId}&budget_year_id=${budgetYearId}`
  );
  const data = await response.json();
  return data.data;
};

// Create budget
const createBudget = async (budgetData) => {
  const response = await fetch('/api/budgets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(budgetData)
  });
  
  if (response.ok) {
    const result = await response.json();
    console.log(result.message); // "Budget created successfully"
    return result.data;
  }
};
```

### Vue.js Example:
```vue
<template>
  <div>
    <!-- Filter Controls -->
    <select v-model="filters.budget_year_id" @change="loadBudgets">
      <option value="">Semua Tahun</option>
      <option v-for="year in budgetYears" :key="year.value" :value="year.value">
        {{ year.label }}
      </option>
    </select>
    
    <select v-model="filters.unit_id" @change="loadBudgets">
      <option value="">Semua Unit</option>
      <option v-for="unit in units" :key="unit.value" :value="unit.value">
        {{ unit.label }}
      </option>
    </select>
    
    <!-- Budget List -->
    <div v-for="budget in budgets" :key="budget.id">
      <h3>{{ budget.unit.name }} - Q{{ budget.quarterly }} {{ budget.budget_year.year }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      budgets: [],
      filters: {
        budget_year_id: '',
        unit_id: '',
        active_year_only: false
      }
    }
  },
  methods: {
    async loadBudgets() {
      const params = new URLSearchParams(this.filters);
      const response = await this.$http.get(`/api/budgets?${params}`);
      this.budgets = response.data.data;
    }
  }
}
</script>
```
