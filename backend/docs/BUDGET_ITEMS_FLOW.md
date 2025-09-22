# Budget Items Flow Documentation

## 📊 **Schema Budget Items**

### **Database Schema**
```sql
budget_items:
- id: bigint (primary key)
- budget_id: bigint (foreign key to budgets.id)
- name: string (required)
- description: string (nullable)
- amount_allocation: decimal(20,0) / int (required)
- realization_amount: decimal(20,0) / int (default: 0)
- remaining_amount: decimal(20,0) / int (calculated)
- created_at: timestamp
- updated_at: timestamp
```

### **Model Relations**
```php
// Budget Model
public function budgetItems()
{
    return $this->hasMany(BudgetItem::class);
}

// BudgetItem Model  
public function budget()
{
    return $this->belongsTo(Budget::class);
}
```

## 🔄 **Flow Pembuatan Budget Items**

### **1. Input Validation**
```php
// BudgetRequest validation rules
'budget_items' => 'required|array|min:1',
'budget_items.*.name' => 'required|string|max:255',
'budget_items.*.description' => 'nullable|string|max:1000',
'budget_items.*.amount_allocation' => 'required|integer|min:1',
```

### **2. Data Processing Flow**

#### **Scenario A: Create New Budget**
```php
1. Create budget record
2. Loop through budget_items array
3. For each item, create budget_item with:
   - budget_id: auto-assigned via relation
   - name: from input
   - description: from input (nullable)
   - amount_allocation: from input (cast to int)
   - realization_amount: 0 (default)
   - remaining_amount: equals amount_allocation
```

#### **Scenario B: Update Existing Budget**
```php
1. Find existing budget
2. Delete all existing budget_items
3. Loop through new budget_items array
4. Create new budget_items (same as scenario A)
```

### **3. Repository Implementation**
```php
// BudgetRepository::create()
foreach ($dataBudgetItems as $item) {
    $budget->budgetItems()->create([
        'name' => $item['name'],
        'description' => $item['description'] ?? null,
        'amount_allocation' => (int) $item['amount_allocation'],
        'realization_amount' => 0,
        'remaining_amount' => (int) $item['amount_allocation'],
    ]);
}
```

## 📋 **API Request/Response Examples**

### **Request Format**
```json
{
  "unit_id": 1,
  "budget_year_id": 2,
  "quarterly": 1,
  "budget_items": [
    {
      "name": "IT Infrastructure",
      "description": "Server dan networking equipment",
      "amount_allocation": 500000000
    },
    {
      "name": "Office Supplies",
      "description": "Alat tulis dan perlengkapan kantor",
      "amount_allocation": 50000000
    },
    {
      "name": "Training Budget",
      "description": null,
      "amount_allocation": 100000000
    }
  ]
}
```

### **Response Format**
```json
{
  "message": "Budget created successfully",
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
        "description": "Server dan networking equipment",
        "amount_allocation": 500000000,
        "realization_amount": 0,
        "remaining_amount": 500000000,
        "realization_percentage": 0
      },
      {
        "id": 11,
        "name": "Office Supplies", 
        "description": "Alat tulis dan perlengkapan kantor",
        "amount_allocation": 50000000,
        "realization_amount": 0,
        "remaining_amount": 50000000,
        "realization_percentage": 0
      },
      {
        "id": 12,
        "name": "Training Budget",
        "description": null,
        "amount_allocation": 100000000,
        "realization_amount": 0,
        "remaining_amount": 100000000,
        "realization_percentage": 0
      }
    ],
    "created_at": "2025-08-05T...",
    "updated_at": "2025-08-05T..."
  }
}
```

## 🎯 **Key Features Budget Items**

### **1. Auto-Calculated Fields**
- **realization_amount**: Default 0, akan diupdate dari panjar requests
- **remaining_amount**: amount_allocation - realization_amount
- **realization_percentage**: (realization_amount / amount_allocation) * 100

### **2. Validation Rules**
- **name**: Required, max 255 characters
- **description**: Optional, max 1000 characters  
- **amount_allocation**: Required integer, minimum 1
- **budget_items array**: Required, minimum 1 item

### **3. Data Type Casting**
```php
// Model casts
protected $casts = [
    'amount_allocation' => 'integer',
    'realization_amount' => 'integer', 
    'remaining_amount' => 'integer',
];
```

### **4. Helper Methods**
```php
// Update remaining amount after realization
$budgetItem->updateRemainingAmount();

// Get realization percentage
$percentage = $budgetItem->realization_percentage;
```

## 🔄 **Complete Flow Diagram**

```
User Input
    ↓
Validation (BudgetRequest)
    ↓
Controller (store/update)
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Database Transaction
    ├── Create/Update Budget
    ├── Delete Old Budget Items (if update)
    └── Create New Budget Items
        ├── name: from input
        ├── description: from input (nullable)
        ├── amount_allocation: cast to int
        ├── realization_amount: 0
        └── remaining_amount: = amount_allocation
    ↓
Response with BudgetResource
```

## ⚠️ **Important Notes**

### **Data Consistency**
- All budget_items are **replaced** when updating budget (not merged)
- Database transactions ensure data integrity
- Foreign key constraints prevent orphaned records

### **Calculated Fields**
- `remaining_amount` is calculated: `amount_allocation - realization_amount`
- `realization_percentage` is calculated dynamically
- These fields update when panjar requests are processed

### **Validation Edge Cases**
- Minimum 1 budget item required per budget
- Amount allocation must be positive integer
- Description is optional but limited to 1000 characters

## 🚀 **Usage Examples**

### **Frontend Implementation**
```javascript
// Create budget with items
const budgetData = {
  unit_id: 1,
  budget_year_id: 2,
  quarterly: 1,
  budget_items: [
    {
      name: "IT Equipment",
      description: "Laptops, servers, networking",
      amount_allocation: 750000000
    },
    {
      name: "Office Rent",
      description: "Monthly office rental",
      amount_allocation: 240000000
    }
  ]
};

const response = await fetch('/api/budgets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(budgetData)
});

const result = await response.json();
console.log(result.data.budget_items); // Array of created budget items
```

### **Backend Model Usage**
```php
// Get budget with items
$budget = Budget::with('budgetItems')->find(1);

// Calculate total allocation
$totalAllocation = $budget->budgetItems->sum('amount_allocation');

// Get items with high realization
$highRealization = $budget->budgetItems()
    ->whereRaw('realization_amount > amount_allocation * 0.8')
    ->get();

// Update realization for specific item
$budgetItem = BudgetItem::find(1);
$budgetItem->realization_amount = 300000000;
$budgetItem->updateRemainingAmount(); // Auto-calculate remaining
```

## ✅ **Flow Validation Checklist**

- ✅ **Schema Compliance**: Matches provided schema (budget_id, name, description, amount_allocation)
- ✅ **Data Types**: Integer casting for amounts, string validation for text fields
- ✅ **Relations**: Proper hasMany/belongsTo relationships
- ✅ **Validation**: Comprehensive request validation with appropriate rules
- ✅ **Transaction Safety**: All operations wrapped in database transactions
- ✅ **Calculated Fields**: Auto-calculation of remaining_amount and realization_percentage
- ✅ **Nullable Handling**: Proper handling of optional description field
- ✅ **Cascading**: Foreign key constraints with cascade delete

**Status: ✅ Flow is CORRECT and optimized for the provided schema!**
