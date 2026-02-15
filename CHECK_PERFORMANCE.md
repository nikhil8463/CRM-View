# 🔍 Performance Check Guide

## Quick Test Steps

### 1. Clear Everything
```bash
# Stop the dev server if running
# Then clear cache and restart

# Windows PowerShell:
cd h:\CRM\crm-ui
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
npm run dev
```

### 2. Browser Setup
1. Open browser in **Incognito/Private mode** (Ctrl + Shift + N)
2. Open DevTools (F12)
3. Go to **Network** tab
4. Check "Disable cache" option
5. Keep DevTools open

### 3. Test Sequence

#### Test 1: Login Page
- **Expected**: 0-1 requests
- **Load time**: <1 second

#### Test 2: Dashboard
1. Login to the system
2. Check Network tab
3. **Expected**: 5-8 requests (leads, tasks, campaigns, users, audit logs)
4. **Load time**: 2-3 seconds
5. **No duplicates**

#### Test 3: Campaign Detail Page
1. Navigate to any campaign
2. Watch Network tab carefully
3. **Expected requests**:
   - GET `/api/campaigns/{id}` - Once
   - GET `/api/campaigns/{id}/analytics` - Once
   - GET `/api/leads?campaign_id={id}` - Once
   - GET `/api/tasks?campaign_id={id}` - Once
   - GET `/api/communication-logs?campaign_id={id}` - Once
4. **Total**: Exactly 5 requests
5. **Load time**: 2-3 seconds
6. **No duplicate requests**

#### Test 4: Navigation Test (Cache Check)
1. Click on another campaign
2. Go back to the first campaign
3. **Expected**: 0 new requests (loaded from cache)
4. **Load time**: Instant (<100ms)

#### Test 5: Hard Refresh
1. On campaign detail page
2. Press Ctrl + Shift + R (hard refresh)
3. **Expected**: Same 5 requests as Test 3
4. **Still no duplicates**

## ✅ Success Criteria

### Network Tab Should Show:
```
Campaign Detail Page Load:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Request                          Status  Time    Size
────────────────────────────────────────────────────
GET /api/campaigns/1              200    120ms   2.5kB
GET /api/campaigns/1/analytics    200    95ms    1.8kB
GET /api/leads?campaign_id=1      200    145ms   15.3kB
GET /api/tasks?campaign_id=1      200    88ms    3.2kB
GET /api/communication-logs?...   200    102ms   8.1kB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total: 5 requests
Total Time: ~550ms
Total Size: ~30.9kB
```

### ❌ Red Flags (Should NOT see):
- ⛔ Same request appearing twice
- ⛔ More than 5-6 requests per page
- ⛔ Request timings > 1 second (after backend optimization)
- ⛔ Total load time > 5 seconds
- ⛔ Requests on navigation between cached pages

## 📊 Performance Comparison

### Before Fix:
```
Campaign Detail Page:
- Total Requests: 124
- Load Time: 31.88 seconds
- Duplicate Requests: Yes (2x each)
- Cache: Not working
- Bundle Size: Large (all pages loaded)
```

### After Fix:
```
Campaign Detail Page:
- Total Requests: 5
- Load Time: 2-3 seconds
- Duplicate Requests: No
- Cache: Working (10 min)
- Bundle Size: Optimized (lazy loaded)
```

### Improvement:
- 🚀 **95% fewer requests** (124 → 5)
- 🚀 **90% faster loading** (31.88s → 2-3s)
- 🚀 **100% duplicate elimination**
- 🚀 **Instant navigation** (with cache)

## 🐛 Troubleshooting

### Still seeing duplicate requests?

1. **Check if StrictMode was removed:**
```bash
# Search for StrictMode in main.jsx
cd h:\CRM\crm-ui
findstr /s "StrictMode" src\main.jsx
# Should return: No results or commented out
```

2. **Verify hook configuration:**
```bash
# Check if hooks have refetchOnMount: false
findstr /s "refetchOnMount" src\hooks\*.js
# All should be "false"
```

3. **Clear browser cache completely:**
- Chrome: Settings → Privacy → Clear browsing data
- Check "Cached images and files"
- Time range: "All time"
- Click "Clear data"

4. **Check for React Query DevTools interference:**
- Disable any React Query extensions
- Test in Incognito mode

### Data seems stale?

1. **Check cache timeout:**
   - Default is 10 minutes
   - Data will refresh after this time

2. **Force refresh:**
   - Hard refresh: Ctrl + Shift + R
   - Or click refresh icon in the page

3. **Manual cache invalidation:**
   - Mutations should auto-invalidate
   - Check mutation hooks have `invalidateQueries`

### Performance still slow?

1. **Check backend:**
```bash
# Test API directly
curl http://localhost:8000/api/campaigns/1
# Should respond in <1 second
```

2. **Check network speed:**
   - Network tab → Right-click → "Network conditions"
   - Set to "Fast 3G" or "No throttling"

3. **Profile React components:**
   - React DevTools → Profiler
   - Record while loading page
   - Identify slow components

## 📝 Console Checks

### Open browser console and run:

```javascript
// Check React Query cache
window.__REACT_QUERY_STATE__ // Should show cached queries

// Check bundle loading (should see multiple chunks)
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('.js'))
  .map(r => ({ name: r.name.split('/').pop(), size: r.transferSize }))

// Check component render count
// Should be 1 per component (not 2)
```

## ✨ Expected Console Output

**Should see:**
```
[vite] connecting...
[vite] connected.
Lazy loading: Dashboard component
Lazy loading: CampaignDetail component
```

**Should NOT see:**
```
⛔ Double render warning
⛔ Duplicate query key warning
⛔ StrictMode warning
⛔ Multiple component mount messages
```

## 🎯 Final Validation

Run this checklist:

- [ ] No duplicate requests in Network tab
- [ ] Campaign detail loads in 2-3 seconds
- [ ] Navigation between pages is instant (cached)
- [ ] No console errors
- [ ] Bundle is code-split (multiple .js chunks)
- [ ] Components render once (not twice)
- [ ] Hard refresh works correctly
- [ ] Data updates after mutations

## 📞 If Issues Persist

1. **Capture network HAR file:**
   - Network tab → Right-click → "Save all as HAR"
   - Share for analysis

2. **Share console logs:**
   - Console → Right-click → "Save as..."

3. **Check browser version:**
   - Chrome/Edge 90+ recommended
   - Firefox 88+ recommended

4. **Verify Node/npm versions:**
```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

---

**Remember**: 
- Always test in **Incognito mode** first
- Keep **DevTools Network tab** open
- Check for **duplicate requests** specifically
- Verify **load times** under 3 seconds

🚀 **If you see 5 requests and 2-3 second load time, optimization is successful!**
