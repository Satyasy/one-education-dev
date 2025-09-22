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
