# Unit API Documentation

## Endpoint untuk Select Frontend

### GET /api/units/select

**Deskripsi:** Mengambil data unit yang dioptimasi untuk komponen select frontend

**Method:** GET

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response Success (200):**
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
    },
    {
      "value": 3,
      "label": "Wakil Kepala Sekolah",
      "code": "WKS"
    }
  ]
}
```

## Penggunaan di Frontend

### React/JavaScript
```javascript
// Fetch units untuk select
const fetchUnits = async () => {
  try {
    const response = await fetch('/api/units/select', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching units:', error);
  }
};

// Menggunakan dengan React Select
import Select from 'react-select';

const UnitSelect = () => {
  const [units, setUnits] = useState([]);
  
  useEffect(() => {
    fetchUnits().then(setUnits);
  }, []);
  
  return (
    <Select
      options={units}
      placeholder="Pilih Unit"
      isSearchable
    />
  );
};
```

### Vue.js
```vue
<template>
  <select v-model="selectedUnit">
    <option value="">Pilih Unit</option>
    <option 
      v-for="unit in units" 
      :key="unit.value" 
      :value="unit.value"
    >
      {{ unit.label }}
    </option>
  </select>
</template>

<script>
export default {
  data() {
    return {
      units: [],
      selectedUnit: ''
    }
  },
  async mounted() {
    try {
      const response = await this.$http.get('/api/units/select');
      this.units = response.data.data;
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  }
}
</script>
```

### Angular
```typescript
// unit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  constructor(private http: HttpClient) {}
  
  getUnitsForSelect(): Observable<any> {
    return this.http.get('/api/units/select');
  }
}

// component.ts
export class MyComponent {
  units: any[] = [];
  
  constructor(private unitService: UnitService) {}
  
  ngOnInit() {
    this.unitService.getUnitsForSelect().subscribe(
      response => {
        this.units = response.data;
      }
    );
  }
}
```

## Endpoints Lainnya

### GET /api/units
**Deskripsi:** Mengambil semua unit dengan pagination
**Parameters:**
- `per_page` (optional): Number of items per page (default: 10)

### POST /api/units
**Deskripsi:** Membuat unit baru
**Body:**
```json
{
  "name": "Nama Unit",
  "code": "KODE",
  "parent_id": 1,
  "head_id": 2,
  "description": "Deskripsi unit"
}
```

### GET /api/units/{id}
**Deskripsi:** Mengambil detail unit berdasarkan ID

### PUT /api/units/{id}
**Deskripsi:** Update unit
**Body:** Same as POST

### DELETE /api/units/{id}
**Deskripsi:** Hapus unit

## Format Response untuk Select

API `/api/units/select` mengembalikan format yang sudah optimasi untuk komponen select:
- `value`: ID unit (untuk submit form)
- `label`: Nama unit (untuk display)
- `code`: Kode unit (informasi tambahan)

Format ini compatible dengan library seperti:
- React Select
- Vue Select
- Angular Material Select
- HTML native select
- Dan sebagian besar library select frontend lainnya
