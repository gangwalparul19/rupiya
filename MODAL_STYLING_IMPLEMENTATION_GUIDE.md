# Modal Styling Implementation Guide

## Quick Start

To use the professional modal styling system in any page:

### Step 1: Import Components
```typescript
import FormModal from '@/components/FormModal';
import FormField from '@/components/FormField';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormTextarea from '@/components/FormTextarea';
import FormCheckbox from '@/components/FormCheckbox';
import FormActions from '@/components/FormActions';
```

### Step 2: Create Modal State
```typescript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({
  name: '',
  type: 'option1',
  description: '',
  isActive: true,
});
```

### Step 3: Build the Modal
```typescript
<FormModal
  isOpen={isOpen}
  title="Add New Item"
  subtitle="Fill in the details below"
  onClose={() => setIsOpen(false)}
  maxWidth="lg"
>
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Form fields */}
    <FormField label="Name" required>
      <FormInput
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter name"
      />
    </FormField>

    <FormField label="Type" required>
      <FormSelect
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      >
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </FormSelect>
    </FormField>

    <FormField label="Description">
      <FormTextarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Enter description"
        rows={3}
      />
    </FormField>

    <FormCheckbox
      label="Active"
      checked={formData.isActive}
      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
    />

    <FormActions
      onSubmit={() => {}}
      onCancel={() => setIsOpen(false)}
      submitLabel="Add Item"
      cancelLabel="Cancel"
      isLoading={isLoading}
    />
  </form>
</FormModal>
```

## Component Reference

### FormModal
**Props**:
- `isOpen: boolean` - Controls modal visibility
- `title: string` - Modal title
- `subtitle?: string` - Optional subtitle
- `onClose: () => void` - Close handler
- `children: React.ReactNode` - Modal content
- `maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'` - Max width (default: 'lg')

**Example**:
```typescript
<FormModal
  isOpen={true}
  title="Add Item"
  subtitle="Create a new item"
  onClose={() => {}}
  maxWidth="lg"
>
  {/* Content */}
</FormModal>
```

### FormField
**Props**:
- `label: string` - Field label
- `required?: boolean` - Show required indicator
- `error?: string` - Error message
- `children: React.ReactNode` - Input component
- `helperText?: string` - Helper text

**Example**:
```typescript
<FormField label="Email" required error={error} helperText="Enter valid email">
  <FormInput type="email" />
</FormField>
```

### FormInput
**Props**: All standard HTML input attributes plus:
- `icon?: React.ReactNode` - Left-aligned icon
- `error?: boolean` - Error state

**Example**:
```typescript
<FormInput
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={handleChange}
  error={hasError}
/>
```

### FormSelect
**Props**: All standard HTML select attributes plus:
- `icon?: React.ReactNode` - Left-aligned icon
- `error?: boolean` - Error state
- `options?: Array<{ value: string; label: string }>` - Options array

**Example**:
```typescript
<FormSelect value={selected} onChange={handleChange}>
  <option value="">Select option</option>
  <option value="1">Option 1</option>
</FormSelect>
```

### FormTextarea
**Props**: All standard HTML textarea attributes plus:
- `error?: boolean` - Error state

**Example**:
```typescript
<FormTextarea
  placeholder="Enter description"
  rows={3}
  value={value}
  onChange={handleChange}
/>
```

### FormCheckbox
**Props**: All standard HTML input attributes plus:
- `label?: string` - Checkbox label

**Example**:
```typescript
<FormCheckbox
  label="I agree"
  checked={checked}
  onChange={handleChange}
/>
```

### FormActions
**Props**:
- `onSubmit?: () => void` - Submit handler
- `onCancel?: () => void` - Cancel handler
- `submitLabel?: string` - Submit button text (default: 'Save')
- `cancelLabel?: string` - Cancel button text (default: 'Cancel')
- `isLoading?: boolean` - Loading state
- `submitVariant?: 'primary' | 'success' | 'danger'` - Button variant

**Example**:
```typescript
<FormActions
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  submitLabel="Save"
  cancelLabel="Cancel"
  isLoading={isLoading}
  submitVariant="primary"
/>
```

## Styling Classes

### Available Tailwind Classes
- `form-group` - Form field wrapper
- `form-label` - Form label
- `form-input` - Form input (legacy)
- `form-select` - Form select (legacy)
- `btn` - Button base
- `btn-primary` - Primary button
- `btn-secondary` - Secondary button
- `btn-danger` - Danger button
- `card` - Card container
- `heading-page` - Page heading
- `heading-section` - Section heading
- `text-secondary` - Secondary text
- `text-tertiary` - Tertiary text

## Complete Example

```typescript
'use client';

import { useState } from 'react';
import FormModal from '@/components/FormModal';
import FormField from '@/components/FormField';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormActions from '@/components/FormActions';

export default function MyPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Your submit logic here
      console.log('Submitting:', formData);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
      >
        + Add Item
      </button>

      <FormModal
        isOpen={isOpen}
        title="Add New Item"
        onClose={() => setIsOpen(false)}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Name" required>
            <FormInput
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              required
            />
          </FormField>

          <FormField label="Category" required>
            <FormSelect
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
              <option value="cat1">Category 1</option>
              <option value="cat2">Category 2</option>
            </FormSelect>
          </FormField>

          <FormActions
            onSubmit={() => {}}
            onCancel={() => setIsOpen(false)}
            submitLabel="Add Item"
            cancelLabel="Cancel"
            isLoading={isLoading}
          />
        </form>
      </FormModal>
    </div>
  );
}
```

## Migration Guide

### From Old Inline Card Modal to FormModal

**Before**:
```typescript
{showModal && (
  <div className="card mb-block">
    <h2 className="heading-section mb-4">Add Item</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Name</label>
        <input type="text" className="form-input" />
      </div>
      <div className="flex gap-2 pt-4">
        <button type="submit" className="btn btn-primary flex-1">Add</button>
        <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">Cancel</button>
      </div>
    </form>
  </div>
)}
```

**After**:
```typescript
<FormModal
  isOpen={showModal}
  title="Add Item"
  onClose={() => setShowModal(false)}
>
  <form onSubmit={handleSubmit} className="space-y-4">
    <FormField label="Name" required>
      <FormInput type="text" />
    </FormField>
    <FormActions
      onSubmit={() => {}}
      onCancel={() => setShowModal(false)}
      submitLabel="Add"
    />
  </form>
</FormModal>
```

## Best Practices

1. **Always use FormField wrapper** for consistent spacing and labels
2. **Use space-y-4** on form containers for consistent spacing
3. **Set required on FormField** for visual indicator
4. **Use FormActions** for consistent button styling
5. **Handle loading state** in FormActions
6. **Validate before submit** in your handler
7. **Close modal after success** in your handler
8. **Show error messages** in FormField error prop

## Troubleshooting

### Modal not showing
- Check `isOpen` prop is true
- Check `onClose` handler is working
- Verify z-index (modal has z-50)

### Styling looks off
- Ensure Tailwind CSS is loaded
- Check for conflicting CSS classes
- Verify dark mode is enabled in tailwind.config

### Form not submitting
- Check form has `onSubmit` handler
- Verify button is `type="submit"`
- Check for validation errors

## Performance Tips

1. Use `useMemo` for form data if complex
2. Debounce onChange handlers if needed
3. Use `useCallback` for handlers
4. Lazy load modal content if heavy

## Accessibility

All components include:
- ✅ Proper label associations
- ✅ Required field indicators
- ✅ Error message display
- ✅ Focus ring visibility
- ✅ Keyboard navigation support
- ✅ ARIA labels where needed

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Summary

The professional modal styling system provides:
- Consistent, polished appearance
- Reusable components
- Bootstrap-inspired design
- Full accessibility support
- Responsive design
- Easy to implement
- Production ready
