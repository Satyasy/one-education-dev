# Panduan Akses File dari Frontend

## 1. URL Akses File

File yang disimpan di `public/storage` dapat diakses langsung melalui URL dengan format:

```
http://your-domain.com/storage/folder_name/file_name.ext
```

### Contoh untuk environment lokal:
```
http://localhost:8000/storage/panjar_receipts/filename.jpg
http://localhost:8000/storage/panjar_photos/filename.jpg
```

## 2. Response dari API

Ketika menggunakan API, field file akan mengembalikan URL lengkap:

```json
{
  "id": 1,
  "panjar_request": {
    "id": 1,
    "total_amount": 1000000,
    "unit": "IT Department",
    "budget_item": {
      "id": 1,
      "name": "Equipment",
      "description": "IT Equipment"
    }
  },
  "item_name": "Laptop",
  "receipt_file": "http://localhost:8000/storage/panjar_receipts/Q7hkffKxym...jpg",
  "item_photo": "http://localhost:8000/storage/panjar_photos/5XzYentByp...jpg"
}
```

## 3. Cara Menggunakan di Frontend

### JavaScript/React:
```javascript
// Menampilkan gambar
<img src={item.receipt_file} alt="Receipt" />
<img src={item.item_photo} alt="Item Photo" />

// Download file
const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
};

// Gunakan
downloadFile(item.receipt_file, 'receipt.jpg');
```

### Vue.js:
```vue
<template>
  <div>
    <img :src="item.receipt_file" alt="Receipt" v-if="item.receipt_file" />
    <img :src="item.item_photo" alt="Photo" v-if="item.item_photo" />
    
    <a :href="item.receipt_file" download v-if="item.receipt_file">
      Download Receipt
    </a>
  </div>
</template>
```

### HTML biasa:
```html
<!-- Menampilkan gambar -->
<img src="http://localhost:8000/storage/panjar_receipts/filename.jpg" alt="Receipt">

<!-- Link download -->
<a href="http://localhost:8000/storage/panjar_receipts/filename.jpg" download>
  Download Receipt
</a>
```

## 4. Konfigurasi yang Perlu Dipastikan

### Laravel Storage Link
Pastikan symlink sudah dibuat:
```bash
php artisan storage:link
```

### File .env
Pastikan APP_URL sudah diset:
```
APP_URL=http://localhost:8000
```

### CORS (jika frontend di domain berbeda)
Di `config/cors.php`:
```php
'paths' => ['api/*', 'storage/*'],
'allowed_origins' => ['http://localhost:3000'], // domain frontend
```

## 5. Troubleshooting

### File tidak bisa diakses:
1. Pastikan symlink storage sudah dibuat
2. Cek permission folder storage
3. Pastikan file benar-benar ada di `storage/app/public/`

### CORS Error:
1. Tambahkan domain frontend ke `allowed_origins` di config cors
2. Tambahkan `storage/*` ke paths yang diizinkan

### 404 Not Found:
1. Cek apakah file benar-benar ada
2. Cek apakah path di database benar
3. Pastikan APP_URL di .env sesuai dengan domain yang digunakan
