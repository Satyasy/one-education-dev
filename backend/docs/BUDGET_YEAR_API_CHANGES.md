# Budget Year & Budget API Changes

## Perubahan Skema Database

### Sebelum:
- Tabel `budgets` memiliki field `year` langsung
- Format: `budgets(id, unit_id, year, quarterly)`

### Sesudah:
- Tabel `budget_years` terpisah untuk mengelola tahun anggaran
- Tabel `budgets` menggunakan `budget_year_id` sebagai foreign key
- Format: 
  - `budget_years(id, year, is_active, description)`
  - `budgets(id, unit_id, budget_year_id, quarterly)`

## API Endpoints Baru

### Budget Years

#### GET /api/budget-years/select
**Deskripsi:** Mengambil tahun anggaran untuk komponen select
**Response:**
```json
{
  "message": "Budget years retrieved successfully for select",
  "data": [
    {
      "value": 2,
      "label": "2025 (Aktif)",
      "year": 2025,
      "is_active": true
    },
    {
      "value": 1,
      "label": "2024",
      "year": 2024,
      "is_active": false
    }
  ]
}
```

#### PATCH /api/budget-years/{id}/set-active
**Deskripsi:** Mengaktifkan tahun anggaran tertentu (otomatis menonaktifkan yang lain)

#### Standard CRUD:
- `GET /api/budget-years` - List dengan pagination
- `POST /api/budget-years` - Create
- `GET /api/budget-years/{id}` - Show
- `PUT /api/budget-years/{id}` - Update
- `DELETE /api/budget-years/{id}` - Delete

## Perubahan Request Format

### Budget Request (CREATE/UPDATE)

#### Sebelum:
```json
{
  "unit_id": 1,
  "year": 2025,
  "quarterly": 1,
  "budget_items": [...]
}
```

#### Sesudah:
```json
{
  "unit_id": 1,
  "budget_year_id": 2,
  "quarterly": 1,
  "budget_items": [...]
}
```

## Perubahan Response Format

### Budget Resource

#### Sebelum:
```json
{
  "id": 1,
  "unit": {...},
  "year": 2025,
  "quarterly": 1
}
```

#### Sesudah:
```json
{
  "id": 1,
  "unit": {...},
  "budget_year": {
    "id": 2,
    "year": 2025,
    "is_active": true,
    "description": "Tahun Anggaran 2025 (Aktif)"
  },
  "quarterly": 1,
  "budget_items": [...],
  "created_at": "...",
  "updated_at": "..."
}
```

## Filter Baru untuk Budget

### Query Parameters Baru:
- `budget_year_id` - Filter berdasarkan tahun anggaran
- `active_year_only=true` - Hanya tahun anggaran aktif

### Contoh:
```
GET /api/budgets?budget_year_id=2&quarterly=1
GET /api/budgets?active_year_only=true
```

## Migration Required

Jalankan migrasi untuk mengupdate skema:
```bash
php artisan migrate
php artisan db:seed --class=BudgetYearSeeder
php artisan db:seed --class=BudgetSeeder
```

## Frontend Integration

### React Example:
```jsx
// Load budget years untuk select
const [budgetYears, setBudgetYears] = useState([]);

useEffect(() => {
  fetch('/api/budget-years/select')
    .then(res => res.json())
    .then(data => setBudgetYears(data.data));
}, []);

// Form untuk create budget
<select name="budget_year_id">
  {budgetYears.map(year => (
    <option key={year.value} value={year.value}>
      {year.label}
    </option>
  ))}
</select>
```

### Vue.js Example:
```vue
<template>
  <select v-model="form.budget_year_id">
    <option value="">Pilih Tahun Anggaran</option>
    <option v-for="year in budgetYears" :key="year.value" :value="year.value">
      {{ year.label }}
    </option>
  </select>
</template>

<script>
export default {
  data() {
    return {
      budgetYears: [],
      form: {
        unit_id: '',
        budget_year_id: '',
        quarterly: 1
      }
    }
  },
  async mounted() {
    const response = await this.$http.get('/api/budget-years/select');
    this.budgetYears = response.data.data;
  }
}
</script>
```
