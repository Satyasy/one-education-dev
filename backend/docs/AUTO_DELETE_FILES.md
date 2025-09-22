# Auto Delete Files Feature - PanjarRealizationItem

## Overview
Fitur ini memastikan bahwa file `receipt_file` dan `item_photo` otomatis terhapus dari storage ketika:
1. **Data dihapus** - File akan otomatis terhapus
2. **Data diupdate dengan file baru** - File lama akan terhapus, file baru akan disimpan

## Implementation

### 1. Model Events (app/Models/PanjarRealizationItem.php)
```php
protected static function boot()
{
    parent::boot();

    // When model is being deleted, also delete associated files
    static::deleting(function ($item) {
        $item->deleteFiles();
    });
}
```

### 2. Helper Methods
```php
// Delete all associated files
public function deleteFiles()
{
    if ($this->receipt_file && Storage::disk('public')->exists($this->receipt_file)) {
        Storage::disk('public')->delete($this->receipt_file);
    }
    
    if ($this->item_photo && Storage::disk('public')->exists($this->item_photo)) {
        Storage::disk('public')->delete($this->item_photo);
    }
}

// Delete specific file
public function deleteFile($field)
{
    if ($this->$field && Storage::disk('public')->exists($this->$field)) {
        Storage::disk('public')->delete($this->$field);
    }
}
```

### 3. Repository Updates
```php
// Auto delete when record is deleted
public function deletePanjarRealizationItem(int $id)
{
    $item = PanjarRealizationItem::findOrFail($id);
    // Files will be automatically deleted by model event
    $item->delete();
    return $item;
}

// Delete old files when updating with new files
public function updatePanjarRealizationItem(int $id, array $data)
{
    $item = PanjarRealizationItem::findOrFail($id);
    
    // Delete old files if new ones are being uploaded
    if (isset($data['receipt_file']) && $item->receipt_file) {
        $item->deleteFile('receipt_file');
    }
    
    if (isset($data['item_photo']) && $item->item_photo) {
        $item->deleteFile('item_photo');
    }
    
    $item->update($data);
    return $item->load(['panjarRequest.unit', 'panjarRequest.budgetItem']);
}
```

## How It Works

### Scenario 1: Delete Data
```
1. User calls DELETE /api/panjar-realizations/{id}
2. Repository calls $item->delete()
3. Model event 'deleting' triggers
4. deleteFiles() method is called
5. Both receipt_file and item_photo are deleted from storage
6. Record is deleted from database
```

### Scenario 2: Update with New Files
```
1. User calls PUT /api/panjar-realizations/{id} with new files
2. Controller processes new files and stores them
3. Repository receives data with new file paths
4. Old files are deleted using deleteFile() method
5. New file paths are saved to database
```

## Benefits

1. **No Orphaned Files**: Files are automatically cleaned up
2. **Storage Efficiency**: Old files don't accumulate unnecessarily  
3. **Consistent Behavior**: Same logic for delete and update operations
4. **Maintainable**: Centralized file deletion logic in model
5. **Safe**: Checks file existence before attempting deletion

## Testing

### Test Delete:
```bash
# Create record with files
POST /api/panjar-realizations
{
    "panjar_request_id": 1,
    "item_name": "Test Item",
    "receipt_file": "uploaded_file.jpg",
    "item_photo": "uploaded_photo.jpg"
}

# Delete record
DELETE /api/panjar-realizations/1

# Check: Files should be deleted from storage/app/public/
```

### Test Update:
```bash
# Update with new files
PUT /api/panjar-realizations/1
{
    "item_name": "Updated Item",
    "receipt_file": "new_receipt.jpg",  # Old receipt will be deleted
    "item_photo": "new_photo.jpg"      # Old photo will be deleted
}
```
