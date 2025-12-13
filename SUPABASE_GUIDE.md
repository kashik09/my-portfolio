# Supabase Database Guide

## How to View Your Database

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in with your account

2. **Select Your Project**
   - Click on your portfolio project

3. **View Tables**
   - Click "Table Editor" in the left sidebar
   - You'll see all your tables: users, projects, project_requests, etc.
   - Click any table to view/edit data

4. **Run SQL Queries**
   - Click "SQL Editor" in the left sidebar
   - Write and run custom SQL queries

## Enable Row Level Security (RLS)

**Why RLS is Important:**
- Protects your data from unauthorized access
- Prevents users from viewing/editing data they shouldn't
- Required for production Supabase projects

**How to Enable:**

1. Go to Supabase Dashboard → Your Project → SQL Editor
2. Copy the entire contents of `prisma/migrations/enable_rls.sql`
3. Paste into the SQL Editor
4. Click "Run" button
5. Verify: Go to "Database" → "Policies" to see all the security policies

**What This Does:**
- ✅ **Projects**: Anyone can view published projects, only admins can create/edit
- ✅ **Requests**: Anyone can submit requests, only admins can view all
- ✅ **Visits**: Anyone can log page visits, only admins can view analytics
- ✅ **Users**: Users see their own profile, admins see all
- ✅ **NextAuth tables**: Protected for security

## Common Database Tasks

### View All Projects
```sql
SELECT * FROM projects ORDER BY created_at DESC;
```

### View Service Requests
```sql
SELECT * FROM project_requests ORDER BY created_at DESC;
```

### Check Analytics
```sql
SELECT page_path, COUNT(*) as visits
FROM visits
GROUP BY page_path
ORDER BY visits DESC;
```

### Find Your Admin User
```sql
SELECT id, email, role FROM users WHERE role = 'ADMIN';
```

## Troubleshooting

### "Tenant or user not found"
- Your database is paused
- Go to Dashboard → Click "Restore project"

### "RLS policy violation"
- You're trying to access data without proper permissions
- Check that you're logged in as an admin user
- Or run queries using the SQL Editor (bypasses RLS)

### Can't see tables
- Make sure you ran `npx prisma db push`
- Check "Table Editor" in Supabase dashboard
- Refresh the page

## Database Connection

Your `.env` file should have:
```
DATABASE_URL="postgresql://..."
```

This connects your Next.js app to Supabase PostgreSQL.
