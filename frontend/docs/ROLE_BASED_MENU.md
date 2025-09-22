# Role-Based Menu System

Sistem menu berbasis role yang telah diimplementasikan untuk mengontrol akses menu berdasarkan peran pengguna.

## 🚀 Fitur yang Diimplementasikan

### 1. **useRole Hook**
Hook untuk mengelola role dan permission checking:
- `hasRole(role)` - Cek apakah user memiliki role tertentu
- `hasAnyRole(roles)` - Cek apakah user memiliki salah satu dari role yang diberikan
- `hasAllRoles(roles)` - Cek apakah user memiliki semua role yang diberikan
- `isAdmin()`, `isFinance()`, `isUnitHead()`, dll - Helper functions untuk role umum

### 2. **AppSidebar dengan Role-Based Filtering**
Sidebar yang secara otomatis menyembunyikan menu yang tidak dapat diakses user:
- Menu difilter berdasarkan role user
- Sub-menu juga difilter
- Menampilkan informasi user dan role badge
- Fallback message jika tidak ada menu yang dapat diakses

### 3. **ProtectedRoute Component**
Komponen untuk melindungi halaman/route berdasarkan role:
- Redirect ke login jika belum auth
- Redirect ke unauthorized jika tidak memiliki role yang diperlukan
- Support untuk multiple roles
- HOC version juga tersedia

### 4. **Unauthorized Page**
Halaman khusus untuk menampilkan pesan akses ditolak:
- Menampilkan informasi user dan role saat ini
- Tombol navigasi kembali
- Design yang user-friendly

## 📋 Konfigurasi Role Menu

### Menu Items Configuration
```typescript
const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
    roles: [], // All authenticated users
  },
  {
    icon: <DollarLineIcon />,
    name: "Panjar",
    path: "/panjars",
    roles: ["admin", "finance", "unit_head", "verifier", "approver", "employee"],
  },
  {
    icon: <FileIcon />,
    name: "Budget", 
    path: "/budgets",
    roles: ["admin", "finance", "unit_head"], // Restricted access
  },
  {
    name: "Settings",
    icon: <TableIcon />,
    roles: ["admin", "super_admin"], // Admin only
    subItems: [
      { 
        name: "Users", 
        path: "/users",
        roles: ["admin", "super_admin"] 
      },
    ],
  },
];
```

## 🔧 Penggunaan

### 1. Menggunakan useRole Hook
```typescript
import { useRole } from '../hooks/useAuth';

const MyComponent = () => {
    const { hasRole, isAdmin, user } = useRole();
    
    return (
        <div>
            {hasRole('admin') && <AdminButton />}
            {isAdmin() && <SuperAdminSection />}
            <p>Welcome, {user?.name}</p>
        </div>
    );
};
```

### 2. Melindungi Route dengan ProtectedRoute
```typescript
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Protect single route
<Route 
    path="/budgets" 
    element={
        <ProtectedRoute roles={['admin', 'finance']}>
            <BudgetPage />
        </ProtectedRoute>
    } 
/>

// Using HOC
const ProtectedBudgetPage = withRoleProtection(
    BudgetPage, 
    ['admin', 'finance'],
    '/unauthorized'
);
```

### 3. Conditional Rendering Berdasarkan Role
```typescript
import { useMenuAccess } from '../hooks/useMenuAccess';

const ActionButtons = () => {
    const { canCreatePanjar, canApprovePanjar } = useMenuAccess();
    
    return (
        <div>
            {canCreatePanjar() && <CreateButton />}
            {canApprovePanjar() && <ApproveButton />}
        </div>
    );
};
```

## 🎯 Role Hierarchy

### Roles yang Didukung:
- **super_admin** - Akses penuh ke semua fitur
- **admin** - Akses administrasi umum
- **finance** - Akses ke fitur keuangan dan budget
- **unit_head** - Kepala unit, dapat mengakses panjar dan budget unit
- **verifier** - Dapat memverifikasi panjar
- **approver** - Dapat menyetujui panjar
- **employee** - User biasa, dapat membuat panjar

### Permission Matrix:
| Fitur | super_admin | admin | finance | unit_head | verifier | approver | employee |
|-------|-------------|--------|---------|-----------|----------|----------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Panjar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Panjar | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Verify Panjar | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Approve Panjar | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Budget Management | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| User Management | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 🔒 Security Notes

1. **Client-side protection** - Menu filtering hanya untuk UX, validation tetap harus dilakukan di server
2. **API Security** - Pastikan API endpoint juga memvalidasi role user
3. **Role Sync** - Pastikan role di client selalu sync dengan server
4. **Token Validation** - Implement proper token validation dan refresh

## 📝 Catatan Pengembangan

- Role-based menu akan otomatis update ketika user role berubah
- Component akan re-render ketika authentication state berubah  
- Gunakan React.memo untuk optimasi performance jika diperlukan
- Test semua role scenario untuk memastikan access control bekerja dengan benar
