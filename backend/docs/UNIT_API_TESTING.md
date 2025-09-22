# Test Unit API

## Manual Testing dengan curl

### 1. Test endpoint untuk select (yang paling penting)
```bash
curl -X GET "http://localhost:8000/api/units/select" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "message": "Units retrieved successfully for select",
  "data": [
    {
      "value": 1,
      "label": "Kepala Sekolah",
      "code": "KS"
    },
    {
      "value": 2,
      "label": "Tata Usaha", 
      "code": "TU"
    }
  ]
}
```

### 2. Test list units dengan pagination
```bash
curl -X GET "http://localhost:8000/api/units?per_page=5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Test create unit
```bash
curl -X POST "http://localhost:8000/api/units" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IT Department",
    "code": "IT",
    "description": "Information Technology Department"
  }'
```

### 4. Test get single unit
```bash
curl -X GET "http://localhost:8000/api/units/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Testing dengan Postman

### Collection Setup:
1. **Base URL:** `http://localhost:8000/api`
2. **Authorization:** Bearer Token
3. **Headers:** `Content-Type: application/json`

### Requests:
1. **GET** `/units/select` - Main endpoint untuk frontend select
2. **GET** `/units` - List dengan pagination  
3. **POST** `/units` - Create new unit
4. **GET** `/units/{id}` - Get unit detail
5. **PUT** `/units/{id}` - Update unit
6. **DELETE** `/units/{id}` - Delete unit

## Frontend Integration Examples

### React Example:
```jsx
import { useState, useEffect } from 'react';
import Select from 'react-select';

const UnitSelector = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    fetch('/api/units/select', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => setUnits(data.data))
    .catch(err => console.error(err));
  }, []);

  return (
    <Select
      options={units}
      value={selectedUnit}
      onChange={setSelectedUnit}
      placeholder="Pilih Unit..."
      isSearchable
    />
  );
};
```

### Vue.js Example:
```vue
<template>
  <div>
    <label>Pilih Unit:</label>
    <select v-model="selectedUnit" @change="onUnitChange">
      <option value="">-- Pilih Unit --</option>
      <option v-for="unit in units" :key="unit.value" :value="unit.value">
        {{ unit.label }} ({{ unit.code }})
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      units: [],
      selectedUnit: ''
    }
  },
  async created() {
    try {
      const response = await this.$http.get('/api/units/select');
      this.units = response.data.data;
    } catch (error) {
      console.error('Error loading units:', error);
    }
  },
  methods: {
    onUnitChange() {
      this.$emit('unit-selected', this.selectedUnit);
    }
  }
}
</script>
```

## Error Handling

### Common Errors:
1. **401 Unauthorized** - Token invalid atau expired
2. **403 Forbidden** - User tidak memiliki permission
3. **404 Not Found** - Unit tidak ditemukan
4. **422 Validation Error** - Data input tidak valid

### Response Format untuk Error:
```json
{
  "message": "Error message",
  "errors": {
    "field_name": ["Error detail"]
  }
}
```
