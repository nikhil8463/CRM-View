# React Query Hooks Architecture

## Overview
This directory contains custom React Query hooks that provide a clean interface for interacting with the Laravel backend API. All hooks follow consistent patterns for queries and mutations.

## Base Configuration
- **API Client**: All services use `apiClient` from `@/services/apiClient` with automatic Bearer token injection
- **Query Keys**: Structured as arrays for efficient cache management: `['resource', params]`, `['resource', id]`
- **Stale Times**: Configured per resource type based on data volatility
- **Error Handling**: Toast notifications on all mutations
- **Cache Invalidation**: Automatic query invalidation after successful mutations

## Available Hooks

### 1. useAuth.js
**Purpose**: Authentication and authorization
```javascript
import { useAuth } from '@/hooks/useAuth'

const { login, register, logout, isLoginLoading, isRegisterLoading, isLogoutLoading } = useAuth()

// Login
login({ email, password })

// Register (admin only)
register({ name, email, role_id, staff_type_id, password, password_confirmation })

// Logout
logout()
```

**Features**:
- Auto-navigation after login
- Sets auth store and token
- Clears all cache on logout
- Toast feedback on all operations

---

### 2. useCampaigns.js
**Purpose**: Campaign management
```javascript
import { 
  useCampaigns, 
  useCampaign, 
  useCreateCampaign, 
  useUpdateCampaign, 
  useDeleteCampaign 
} from '@/hooks/useCampaigns'

// Fetch all campaigns (with optional filters)
const { data, isLoading, error } = useCampaigns({ status: 'active' })

// Fetch single campaign
const { data: campaign } = useCampaign(campaignId)

// Create campaign
const { mutate: createCampaign } = useCreateCampaign()
createCampaign({ name, type, start_date, end_date, budget })

// Update campaign
const { mutate: updateCampaign } = useUpdateCampaign()
updateCampaign({ id: campaignId, data: { status: 'completed' } })

// Delete campaign
const { mutate: deleteCampaign } = useDeleteCampaign()
deleteCampaign(campaignId)
```

**Stale Time**: 5 minutes

---

### 3. useLeads.js
**Purpose**: Lead management with status and assignment operations
```javascript
import { 
  useLeads, 
  useLead, 
  useLeadTimeline,
  useCreateLead, 
  useUpdateLead, 
  useDeleteLead,
  useUpdateLeadStatus,
  useAssignLead
} from '@/hooks/useLeads'

// Fetch all leads
const { data: leads } = useLeads()

// Fetch single lead
const { data: lead } = useLead(leadId)

// Fetch lead timeline
const { data: timeline } = useLeadTimeline(leadId)

// CRUD operations
const { mutate: createLead } = useCreateLead()
const { mutate: updateLead } = useUpdateLead()
const { mutate: deleteLead } = useDeleteLead()

// Status update
const { mutate: updateStatus } = useUpdateLeadStatus()
updateStatus({ id: leadId, status: 'qualified' })

// Assign lead
const { mutate: assignLead } = useAssignLead()
assignLead({ id: leadId, user_id: userId })
```

**Stale Time**: 2 minutes

---

### 4. useCalls.js
**Purpose**: Call logging and transcript management
```javascript
import { 
  useCalls, 
  useCall, 
  useCallTranscript,
  useCreateCall, 
  useUpdateCall, 
  useDeleteCall 
} from '@/hooks/useCalls'

// Fetch all calls
const { data: calls } = useCalls()

// Fetch single call
const { data: call } = useCall(callId)

// Fetch call transcript
const { data: transcript } = useCallTranscript(callId)

// CRUD operations
const { mutate: createCall } = useCreateCall()
const { mutate: updateCall } = useUpdateCall()
const { mutate: deleteCall } = useDeleteCall()
```

**Stale Time**: 2 minutes

---

### 5. useTasks.js
**Purpose**: Task management with completion and overdue tracking
```javascript
import { 
  useTasks, 
  useTask, 
  useOverdueTasks,
  useCreateTask, 
  useUpdateTask, 
  useDeleteTask,
  useCompleteTask
} from '@/hooks/useTasks'

// Fetch all tasks
const { data: tasks } = useTasks()

// Fetch single task
const { data: task } = useTask(taskId)

// Fetch overdue tasks (for dashboard widgets)
const { data: overdueTasks } = useOverdueTasks()

// CRUD operations
const { mutate: createTask } = useCreateTask()
const { mutate: updateTask } = useUpdateTask()
const { mutate: deleteTask } = useDeleteTask()

// Complete task
const { mutate: completeTask } = useCompleteTask()
completeTask(taskId)
```

**Stale Time**: 2 minutes

---

### 6. useUsers.js
**Purpose**: User management (admin only)
```javascript
import { 
  useUsers, 
  useUser, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser,
  useToggleUserStatus
} from '@/hooks/useUsers'

// Fetch all users
const { data: users } = useUsers()

// Fetch single user
const { data: user } = useUser(userId)

// CRUD operations
const { mutate: createUser } = useCreateUser()
const { mutate: updateUser } = useUpdateUser()
const { mutate: deleteUser } = useDeleteUser()

// Toggle user status (active/inactive)
const { mutate: toggleStatus } = useToggleUserStatus()
toggleStatus(userId)
```

**Stale Time**: 5 minutes

---

### 7. useRoles.js
**Purpose**: Role management (admin only)
```javascript
import { 
  useRoles, 
  useRole, 
  useCreateRole, 
  useUpdateRole, 
  useDeleteRole 
} from '@/hooks/useRoles'

// Fetch all roles
const { data: roles } = useRoles()

// Fetch single role
const { data: role } = useRole(roleId)

// CRUD operations
const { mutate: createRole } = useCreateRole()
const { mutate: updateRole } = useUpdateRole()
const { mutate: deleteRole } = useDeleteRole()
```

**Stale Time**: 10 minutes (roles change infrequently)

---

### 8. useAuditLogs.js
**Purpose**: Audit log retrieval (read-only)
```javascript
import { 
  useAuditLogs, 
  useModelAuditLogs, 
  useUserAuditLogs 
} from '@/hooks/useAuditLogs'

// Fetch all audit logs (with optional filters)
const { data: logs } = useAuditLogs({ action: 'create', limit: 50 })

// Fetch audit logs for specific model
const { data: modelLogs } = useModelAuditLogs('Lead', leadId)

// Fetch audit logs for specific user
const { data: userLogs } = useUserAuditLogs(userId)
```

**Stale Time**: 2 minutes

---

### 9. useCommunications.js
**Purpose**: Multi-channel communications (email, SMS, WhatsApp)
```javascript
import { 
  useSendEmail, 
  useSendSMS, 
  useSendWhatsApp 
} from '@/hooks/useCommunications'

// Send email
const { mutate: sendEmail } = useSendEmail()
sendEmail({ to, subject, body })

// Send SMS
const { mutate: sendSMS } = useSendSMS()
sendSMS({ to, message })

// Send WhatsApp
const { mutate: sendWhatsApp } = useSendWhatsApp()
sendWhatsApp({ to, message })
```

---

## Patterns and Best Practices

### Query Hooks
Query hooks return an object with:
- `data`: The fetched data
- `isLoading`: Loading state
- `error`: Error object if fetch failed
- `refetch`: Function to manually refetch

```javascript
const { data, isLoading, error, refetch } = useResource(id)

if (isLoading) return <Spinner />
if (error) return <Error message={error.message} />
return <div>{data.name}</div>
```

### Mutation Hooks
Mutation hooks return an object with:
- `mutate`: Function to trigger the mutation
- `isPending`: Loading state
- `isSuccess`: Success state
- `isError`: Error state

```javascript
const { mutate: createResource, isPending } = useCreateResource()

<button 
  onClick={() => createResource(data)} 
  disabled={isPending}
>
  {isPending ? 'Creating...' : 'Create'}
</button>
```

### Cache Invalidation
All mutations automatically invalidate related queries:
```javascript
// After creating a campaign
queryClient.invalidateQueries({ queryKey: ['campaigns'] })

// After updating a campaign
queryClient.invalidateQueries({ queryKey: ['campaigns'] })
queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })
```

### Optimistic Updates
For better UX, mutations can implement optimistic updates:
```javascript
const { mutate } = useUpdateResource()

mutate(
  { id, data },
  {
    onSuccess: () => {
      // Cache is automatically invalidated
    },
    onError: (error) => {
      // Rollback happens automatically
    }
  }
)
```

## Integration Checklist

### Page Integration
When connecting a page to backend:
1. ✅ Import required hooks
2. ✅ Replace mock data with query hooks
3. ✅ Add loading states
4. ✅ Add error handling
5. ✅ Connect forms to mutation hooks
6. ✅ Test CRUD operations
7. ✅ Verify cache invalidation

### Example Page Integration
```javascript
import { useLeads, useCreateLead, useUpdateLead } from '@/hooks/useLeads'

function LeadsPage() {
  // Fetch data
  const { data: leadsData, isLoading } = useLeads()
  const leads = leadsData?.data || []
  
  // Mutations
  const { mutate: createLead } = useCreateLead()
  const { mutate: updateLead } = useUpdateLead()
  
  // Loading state
  if (isLoading) return <Spinner />
  
  return (
    <div>
      {leads.map(lead => (
        <LeadCard 
          key={lead.id} 
          lead={lead}
          onUpdate={(data) => updateLead({ id: lead.id, data })}
        />
      ))}
    </div>
  )
}
```

## Testing Backend Connection

### Prerequisites
1. Laravel backend running at `http://localhost:8000`
2. Database seeded with test data
3. CORS configured in Laravel

### Test Sequence
1. **Authentication**: Login → verify token stored → check `/me` endpoint
2. **Campaigns**: List → Create → Update → Delete
3. **Leads**: List → Create → Update Status → Assign → Delete
4. **Calls**: List → Create → View Transcript → Delete
5. **Tasks**: List → Create → Complete → View Overdue → Delete
6. **Users** (Admin): List → Create → Toggle Status → Delete
7. **Roles** (Admin): List → Create → Update → Delete
8. **Audit Logs**: List → Filter by Model → Filter by User

### Debugging
- Check Network tab for failed requests
- Verify Bearer token in request headers
- Check Laravel logs: `storage/logs/laravel.log`
- Verify CORS settings in `config/cors.php`
- Test endpoints in Postman first

## Next Steps
1. ✅ Create remaining hooks (COMPLETE)
2. ✅ Connect Login/Register pages (COMPLETE)
3. 🔄 Connect Campaign pages
4. 🔄 Connect Lead pages
5. 🔄 Connect Call pages
6. 🔄 Connect Task pages
7. 🔄 Connect User pages (Admin)
8. 🔄 Connect Role pages (Admin)
9. 🔄 Connect Audit Log page (Admin)
10. 🔄 Implement role-based access control
11. 🔄 End-to-end testing

## Role-Based Access Control

### Admin-Only Features
- Users Management (`/dashboard/users`)
- Roles Management (`/dashboard/roles`)
- Audit Logs (`/dashboard/audit-logs`)
- System Settings

### Implementation
```javascript
import { useAuthStore } from '@/store/authStore'

function AdminRoute({ children }) {
  const { user } = useAuthStore()
  const isAdmin = user?.role_id === 1 || user?.role?.name === 'super_admin'
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />
  }
  
  return children
}
```

## API Response Structure
All API responses follow this structure:
```json
{
  "success": true,
  "data": { /* resource or array of resources */ },
  "message": "Success message",
  "meta": { /* pagination info for lists */ }
}
```

Hooks automatically extract `data` from responses, so components receive clean data.
