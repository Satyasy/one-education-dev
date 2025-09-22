# DetailPanjar Module Structure

This module has been refactored to improve code organization and maintainability by breaking down the large DetailPanjar component into smaller, reusable components.

## 📁 File Structure

```
src/pages/Panjars/
├── DetailPanjar.tsx                    # Main component (simplified)
├── components/
│   ├── index.ts                       # Export all components
│   ├── PanjarInfoCard.tsx             # Displays panjar general information
│   ├── PanjarOfficersCard.tsx         # Shows officers information
│   ├── PanjarItemsTable.tsx           # Table with panjar items and actions
│   ├── PanjarActionsCard.tsx          # Main action buttons (verify/approve)
│   ├── NoteModal.tsx                  # Modal for adding notes
│   └── HistoryModal.tsx               # Modal for viewing item history
├── hooks/
│   └── usePanjarPermissions.ts        # Permission logic hook
├── types/
│   └── panjarTypes.ts                 # Type definitions
├── utils/
│   └── panjarHelpers.ts               # Helper functions
└── README.md                          # This documentation
```

## 🔧 Components

### 1. PanjarInfoCard
**Purpose:** Displays general panjar information like budget, status, unit, etc.

**Props:**
- `panjarData: Panjar` - Main panjar data object

**Features:**
- Responsive grid layout
- Currency formatting
- Status badges
- Dark mode support

### 2. PanjarOfficersCard
**Purpose:** Shows information about officials involved in the panjar process.

**Props:**
- `panjarData: Panjar` - Main panjar data object
- `user: User | null` - Current user for permission checks

**Features:**
- Dynamic officer information based on user roles
- Conditional rendering based on verification/approval status
- Fallback names when officers not assigned

### 3. PanjarItemsTable
**Purpose:** Main table component for displaying and managing panjar items.

**Props:**
- `panjarData: Panjar` - Main panjar data object
- `canVerify: boolean` - Permission to verify items
- `canApprove: boolean` - Permission to approve items
- `refetch: () => void` - Function to refresh data

**Features:**
- Dropdown menus for item actions
- Note management system
- History viewing functionality
- Status updates with API integration
- Responsive design

### 4. PanjarActionsCard
**Purpose:** Main action buttons for panjar-level operations.

**Props:**
- `panjarData: Panjar` - Main panjar data object
- `canVerify: boolean` - Permission to verify panjar
- `canApprove: boolean` - Permission to approve panjar
- `user: User | null` - Current user
- `refetch: () => void` - Function to refresh data
- `id: string` - Panjar ID

**Features:**
- Verify/Approve panjar buttons
- Total amount display
- Permission-based rendering
- Warning messages for sequential approval

### 5. NoteModal
**Purpose:** Modal for adding/editing notes on panjar items.

**Props:**
- `isOpen: boolean` - Modal visibility state
- `onClose: () => void` - Close modal handler
- `currentEditingItem: CurrentEditingItem | null` - Item being edited
- `onSave: () => void` - Save note handler
- `onCancel: () => void` - Cancel edit handler
- `onNoteChange: (note: string) => void` - Note change handler

**Features:**
- Form validation
- Professional modal design
- Textarea for long notes
- Save/Cancel actions

### 6. HistoryModal
**Purpose:** Modal for viewing panjar item history with timeline design.

**Props:**
- `isOpen: boolean` - Modal visibility state
- `onClose: () => void` - Close modal handler
- `currentHistoryItem: CurrentHistoryItem | null` - Item with history

**Features:**
- Timeline view with visual indicators
- Status-based color coding
- Date formatting
- Empty state handling
- Scrollable content area

## 🎣 Hooks

### usePanjarPermissions
**Purpose:** Centralizes permission logic for panjar operations.

**Parameters:**
- `panjarData: Panjar | undefined` - Panjar data for permission checks

**Returns:**
- `canVerify: boolean` - User can verify items/panjar
- `canApprove: boolean` - User can approve items/panjar
- `user: User | null` - Current user object

**Features:**
- Handles different user roles (kepala-sekolah, other roles)
- Unit-based permission checking
- Sequential approval logic

## 🛠️ Utils

### panjarHelpers.ts
**Functions:**
- `formatCurrency(amount: string): string` - Formats currency in Indonesian format
- `formatDate(dateString: string): string` - Formats date with Indonesian locale
- `getStatusColor(status: string): string` - Returns Tailwind classes for status colors

## 📝 Types

### panjarTypes.ts
**Interfaces:**
- `DropdownState` - State for dropdown visibility
- `NotesState` - State for item notes
- `CurrentEditingItem` - Current item being edited
- `CurrentHistoryItem` - Current item history being viewed

## 🚀 Usage Example

```tsx
import { DetailPanjar } from "./DetailPanjar";

// Main component is automatically composed of all sub-components
function App() {
  return <DetailPanjar />;
}
```

## 📈 Benefits of This Structure

1. **Separation of Concerns:** Each component has a single responsibility
2. **Reusability:** Components can be used independently
3. **Maintainability:** Easier to debug and modify specific features
4. **Testability:** Individual components can be tested in isolation
5. **Code Organization:** Related logic is grouped together
6. **Performance:** Smaller components with focused re-renders

## 🔄 Migration Notes

The refactored version maintains full backward compatibility. All existing functionality has been preserved while improving code organization. The main DetailPanjar component now acts as a composition root that orchestrates all sub-components.

## 🎨 Design Patterns Used

- **Composition Pattern:** DetailPanjar composes multiple specialized components
- **Custom Hooks:** Business logic extracted to reusable hooks
- **Modal Pattern:** Consistent modal implementation across features
- **Props Drilling Alternative:** Hooks reduce prop drilling for permissions
- **Utility Functions:** Common operations centralized in helper functions