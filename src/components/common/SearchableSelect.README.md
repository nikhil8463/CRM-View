# SearchableSelect Component

A reusable, styled dropdown component with search functionality and avatar support.

## Features

- ✅ **Search functionality** - Filter options by name or email
- ✅ **Avatar circles** - Colorful user avatars with initials
- ✅ **Styled design** - Matches the CRM design system
- ✅ **Keyboard accessible** - Full keyboard navigation support
- ✅ **Loading states** - Disabled state while loading
- ✅ **Empty state** - Option to clear selection
- ✅ **Responsive** - Works on all screen sizes
- ✅ **Custom rendering** - Override option rendering if needed

## Basic Usage

```jsx
import SearchableSelect from '@/components/common/SearchableSelect'

function MyComponent() {
  const [selectedUser, setSelectedUser] = useState('')
  
  const users = [
    { id: 1, name: 'Jessica Martinez', email: 'jessica.martinez@crm.com' },
    { id: 2, name: 'Emily Rodriguez', email: 'emily.rodriguez@crm.com' },
    { id: 3, name: 'David Thompson', email: 'david.thompson@crm.com' },
  ]

  return (
    <SearchableSelect
      label="Assign To"
      options={users}
      value={selectedUser}
      onChange={setSelectedUser}
      placeholder="Select a user"
      emptyText="No assignment"
      showAvatar={true}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | Array | `[]` | Array of options with `{id, name, email, avatar}` structure |
| `value` | string/number | - | Selected value (option.id) |
| `onChange` | Function | - | Callback when selection changes `(value) => {}` |
| `placeholder` | string | `'Select an option'` | Placeholder text when nothing selected |
| `label` | string | - | Label displayed above the select |
| `required` | boolean | `false` | Shows asterisk (*) if required |
| `emptyText` | string | `'No assignment'` | Text for the empty/clear option |
| `noResultsText` | string | `'No results found'` | Text shown when search has no results |
| `showAvatar` | boolean | `true` | Whether to show avatar circles |
| `disabled` | boolean | `false` | Disables the select |
| `className` | string | `''` | Additional CSS classes |
| `renderOption` | Function | - | Custom render function for options |

## Examples

### 1. User Selection with Search

```jsx
<SearchableSelect
  label="Assign To"
  options={users}
  value={formData.assigned_to}
  onChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}
  placeholder="Select a user"
  emptyText="No assignment (assign to yourself)"
  showAvatar={true}
/>
```

### 2. Lead Selection

```jsx
<SearchableSelect
  label="Lead"
  options={leads}
  value={selectedLead}
  onChange={setSelectedLead}
  placeholder="Select a lead"
  emptyText="No lead selected"
  required={true}
/>
```

### 3. Custom Option Rendering

```jsx
<SearchableSelect
  label="Select Campaign"
  options={campaigns}
  value={selectedCampaign}
  onChange={setSelectedCampaign}
  showAvatar={false}
  renderOption={(option) => (
    <div>
      <div className="font-semibold">{option.name}</div>
      <div className="text-xs text-slate-500">
        Budget: ${option.budget} • Status: {option.status}
      </div>
    </div>
  )}
/>
```

### 4. Without Avatars

```jsx
<SearchableSelect
  label="Select Status"
  options={[
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
    { id: 'pending', name: 'Pending' },
  ]}
  value={status}
  onChange={setStatus}
  showAvatar={false}
  placeholder="Select status"
/>
```

### 5. With Loading State

```jsx
const [users, setUsers] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchUsers().then(data => {
    setUsers(data)
    setLoading(false)
  })
}, [])

return (
  <SearchableSelect
    label="Assign To"
    options={users}
    value={selectedUser}
    onChange={setSelectedUser}
    disabled={loading}
    placeholder={loading ? "Loading users..." : "Select a user"}
  />
)
```

## Option Data Structure

Options should be objects with the following structure:

```javascript
{
  id: 1,                                    // Required: Unique identifier
  name: 'Jessica Martinez',                 // Required: Display name
  email: 'jessica.martinez@crm.com',       // Optional: Secondary text
  avatar: 'https://...',                    // Optional: Not used currently (uses initials)
}
```

## Styling

The component uses Tailwind CSS and matches the CRM design system:
- Primary color for focus states
- Rounded corners (rounded-xl)
- Smooth transitions
- Custom scrollbar support

## Accessibility

- Full keyboard navigation
- ARIA labels
- Focus management
- Screen reader friendly

## Integration Examples

### In Forms

```jsx
<form onSubmit={handleSubmit}>
  <SearchableSelect
    label="Assigned User"
    options={users}
    value={formData.userId}
    onChange={(value) => setFormData(prev => ({ ...prev, userId: value }))}
    required={true}
  />
  
  <button type="submit">Submit</button>
</form>
```

### With React Hook Form

```jsx
import { Controller } from 'react-hook-form'

<Controller
  name="assigned_to"
  control={control}
  render={({ field }) => (
    <SearchableSelect
      label="Assign To"
      options={users}
      value={field.value}
      onChange={field.onChange}
    />
  )}
/>
```

## Current Usage

This component is currently used in:
- ✅ AddTaskModal - User and Lead selection
- 🔜 Add to other modals and forms as needed

## Future Enhancements

- Multiple selection support
- Async option loading
- Grouping options
- Custom avatar images
- Badge/tag display in options
