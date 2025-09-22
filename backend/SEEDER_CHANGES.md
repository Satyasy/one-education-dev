# Analisa dan Perubahan Database Seeder

## Perubahan Migration yang Ditemukan

### 1. Tabel `budgets`
- **Migration**: Tidak memiliki kolom `amount_allocation`
- **Seeder Lama**: Menggunakan kolom `amount_allocation` yang tidak ada
- **Perbaikan**: Menghapus kolom `amount_allocation` dari seeder budgets

### 2. Tabel `budget_items`
- **Migration**: Menggunakan kolom `amount_allocation`, `realization_amount`, `remaining_amount`
- **Seeder Lama**: Menggunakan kolom `amount` yang tidak ada
- **Perbaikan**: Mengubah `amount` menjadi `amount_allocation` dan menambahkan `realization_amount`, `remaining_amount`

### 3. Tabel `panjar_items`
- **Migration**: Memiliki kolom `status` dengan enum values
- **Seeder Lama**: Tidak memiliki kolom `status`
- **Perbaikan**: Menambahkan kolom `status` dengan nilai yang sesuai

### 4. Tabel Baru yang Perlu Seeder

#### `panjar_item_histories`
- Tabel untuk menyimpan history perubahan item panjar
- Kolom: `panjar_item_id`, `item_name`, `spesification`, `quantity`, `unit`, `price`, `total`, `description`, `note`, `reviewed_by`, `reviewer_role`
- **Seeder Baru**: `PanjarItemHistorySeeder`

#### `panjar_realization_items`
- Tabel untuk menyimpan realisasi pembelian item panjar
- Kolom: `panjar_request_id`, `item_name`, `spesification`, `quantity`, `unit`, `price`, `total`, `description`
- **Seeder Baru**: `PanjarRealizationItemSeeder`

#### `monthly_budget_reports`
- Tabel untuk laporan anggaran bulanan
- Kolom: `unit_id`, `month`, `year`, `total_budget`, `total_realization`, `remaining_budget`, `percentage_realization`
- **Seeder Baru**: `MonthlyBudgetReportSeeder`

## Seeder yang Dibuat/Diperbaiki

### 1. BudgetSeeder.php
**Perubahan:**
- Menghapus kolom `amount_allocation` dari data budgets
- Mengubah kolom `amount` menjadi `amount_allocation` di budget_items
- Menambahkan kolom `realization_amount` dan `remaining_amount`
- Menyesuaikan nilai realisasi dengan data panjar yang approved

### 2. PanjarSeeder.php
**Perubahan:**
- Menambahkan kolom `status` ke semua panjar_items
- Memperbaiki perhitungan `total_amount` di panjar_requests agar sesuai dengan jumlah item
- Status item disesuaikan dengan status request (pending, verified, approved)

### 3. PanjarItemHistorySeeder.php (Baru)
**Fitur:**
- History perubahan item oleh verifier dan approver
- Mencatat revisi spesifikasi, harga, dan quantity
- Menyimpan catatan reviewer dan role reviewer

### 4. PanjarRealizationItemSeeder.php (Baru)
**Fitur:**
- Data realisasi pembelian untuk request yang approved
- Menunjukkan item aktual yang dibeli vs yang direncanakan
- Perbedaan harga dan spesifikasi antara rencana dan realisasi

### 5. MonthlyBudgetReportSeeder.php (Baru)
**Fitur:**
- Laporan anggaran bulanan per unit
- Perhitungan persentase realisasi
- Data untuk 3 bulan (Januari - Maret 2025)

### 6. DatabaseSeeder.php
**Perubahan:**
- Menambahkan 3 seeder baru ke dalam call sequence
- Urutan seeder diatur agar foreign key constraints terpenuhi

## Konsistensi Data

### Total Amount Corrections
1. **Panjar Request 1**: 170M → 181.25M (170M + 7M + 4.25M)
2. **Panjar Request 2**: 5M → 16.25M (5M + 3.75M + 7.5M)
3. **Panjar Request 3**: 170M → 33.75M (8.75M + 25M)
4. **Panjar Request 4**: 15M → 22.5M (15M + 7.5M)
5. **Panjar Request 5**: 50M → 75M (50M + 25M)
6. **Panjar Request 6**: 7.5M → 9M (7.5M + 1.5M)

### Budget Realization Tracking
- Realization amounts di budget_items disesuaikan dengan approved panjar requests
- Remaining amounts dihitung otomatis (allocation - realization)
- Monthly reports mencerminkan total realisasi per unit

## Urutan Eksekusi Seeder

```php
$this->call([
    // Base data
    UnitSeeder::class,
    UserRoleSeeder::class,
    PositionSeeder::class,
    EmployeeSeeder::class,
    
    // Academic data
    StudyProgramSeeder::class,
    AcademicYearSeeder::class,
    CohortSeeder::class,
    SemesterSeeder::class,
    ClassSeeder::class,
    
    // Student data
    StudentSeeder::class,
    StudentClassHistorySeeder::class,
    
    // Budget and Panjar data
    BudgetSeeder::class,
    PanjarSeeder::class,
    PanjarItemHistorySeeder::class,      // Depends on panjar_items
    PanjarRealizationItemSeeder::class,  // Depends on panjar_requests
    MonthlyBudgetReportSeeder::class,    // Depends on units
]);
```

## Testing

Untuk menjalankan seeder yang telah diperbaiki:

```bash
php artisan db:seed --class=BudgetSeeder
php artisan db:seed --class=PanjarSeeder
php artisan db:seed --class=PanjarItemHistorySeeder
php artisan db:seed --class=PanjarRealizationItemSeeder
php artisan db:seed --class=MonthlyBudgetReportSeeder

# Atau jalankan semua seeder
php artisan db:seed
``` 