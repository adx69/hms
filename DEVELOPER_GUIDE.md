# Developer Guide - Hospital Management System

## 🚀 Quick Start Guide

### Understanding the Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (backend)
│   │   ├── auth/          # Authentication endpoints
│   │   ├── patients/      # Patient CRUD operations
│   │   ├── doctors/       # Doctor CRUD operations
│   │   ├── appointments/  # Appointment management
│   │   └── billing/       # Billing operations
│   ├── dashboard/         # Main dashboard (staff)
│   ├── doctor/            # Doctor portal
│   ├── patient/            # Patient portal
│   ├── patients/          # Patients management page
│   ├── doctors/           # Doctors management page
│   ├── appointments/      # Appointments page
│   ├── billing/           # Billing page
│   └── login/             # Login pages
├── components/            # Reusable React components
│   ├── layout/           # Layout components (Sidebar, Navbar)
│   └── ui/               # ShadCN UI components
├── lib/                   # Utility functions
│   └── mongodb.js        # Database connection
├── models/               # Mongoose database models
└── services/             # API service functions
    └── api.js            # Axios API calls
```

## 📝 Common Tasks & How to Do Them

### 1. Adding a New Page

**Example: Adding a "Reports" page**

1. Create the page file:
   ```bash
   src/app/reports/page.js
   ```

2. Create the layout (if needed):
   ```bash
   src/app/reports/layout.js
   ```

3. Add to sidebar navigation:
   - Edit `src/components/layout/Sidebar.jsx`
   - Add to `menuItems` array:
   ```javascript
   { name: 'Reports', href: '/reports', icon: FileText }
   ```

### 2. Creating a New API Route

**Example: Creating a reports API**

1. Create API route:
   ```bash
   src/app/api/reports/route.js
   ```

2. Add authentication check:
   ```javascript
   const session = await getServerSession(authOptions);
   if (!session) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

3. Add to services:
   - Edit `src/services/api.js`
   - Add new API functions:
   ```javascript
   export const reportsAPI = {
     getAll: () => api.get('/reports'),
     // ... more methods
   };
   ```

### 3. Adding a New Database Model

**Example: Creating a Report model**

1. Create model file:
   ```bash
   src/models/Report.js
   ```

2. Define schema:
   ```javascript
   import mongoose from 'mongoose';

   const ReportSchema = new mongoose.Schema({
     title: { type: String, required: true },
     // ... more fields
   });

   export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
   ```

### 4. Creating a Form with Validation

**Pattern to follow:**

```javascript
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
});

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Validation
    if (!formData.field1) {
      toast.error('Field 1 is required');
      return;
    }
    
    // API call
    await someAPI.create(formData);
    toast.success('Created successfully');
    // Reset form
  } catch (error) {
    toast.error('Error creating');
  }
};
```

## ⌨️ Typing Faster - Tips & Tricks

### 1. Use VS Code Snippets

Create custom snippets in VS Code:

**File: `.vscode/snippets.code-snippets`**

```json
{
  "Next.js API Route": {
    "prefix": "napi",
    "body": [
      "import { NextResponse } from 'next/server';",
      "import connectDB from '@/lib/mongodb';",
      "import { getServerSession } from 'next-auth';",
      "import { authOptions } from '../auth/[...nextauth]/route';",
      "",
      "export async function GET() {",
      "  try {",
      "    const session = await getServerSession(authOptions);",
      "    if (!session) {",
      "      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });",
      "    }",
      "",
      "    await connectDB();",
      "    // Your code here",
      "    return NextResponse.json({});",
      "  } catch (error) {",
      "    return NextResponse.json({ error: error.message }, { status: 500 });",
      "  }",
      "}"
    ]
  },
  "React Component": {
    "prefix": "rcomp",
    "body": [
      "'use client';",
      "",
      "import { useState } from 'react';",
      "",
      "export default function ${1:ComponentName}() {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "}"
    ]
  }
}
```

### 2. Keyboard Shortcuts (VS Code)

**Essential Shortcuts:**
- `Ctrl + D` - Select next occurrence (multi-cursor)
- `Alt + Click` - Add cursor at click position
- `Ctrl + Shift + K` - Delete line
- `Ctrl + /` - Toggle comment
- `Alt + Up/Down` - Move line up/down
- `Shift + Alt + Up/Down` - Copy line up/down
- `Ctrl + Space` - Trigger IntelliSense
- `Ctrl + .` - Quick fix/suggestions
- `F2` - Rename symbol (refactor)

**Navigation:**
- `Ctrl + P` - Quick file open
- `Ctrl + Shift + P` - Command palette
- `Ctrl + B` - Toggle sidebar
- `Ctrl + J` - Toggle panel

### 3. Use Emmet Abbreviations

In JSX/HTML files, type these and press Tab:

```
div.container>h1.title+p.text
```
Becomes:
```html
<div className="container">
  <h1 className="title"></h1>
  <p className="text"></p>
</div>
```

**Common Emmet:**
- `div.card` → `<div className="card"></div>`
- `button.btn-primary` → `<button className="btn-primary"></button>`
- `ul>li*3` → Creates 3 list items

### 4. Code Templates & Patterns

**Copy-Paste Templates:**

**API Route Template:**
```javascript
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ModelName from '@/models/ModelName';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const items = await ModelName.find();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**Page Component Template:**
```javascript
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { someAPI } from '@/services/api';
import { toast } from 'sonner';

export default function PageName() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await someAPI.getAll();
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Your content */}
    </motion.div>
  );
}
```

## 🎯 Common Patterns in This Codebase

### 1. CRUD Operations Pattern

**Create:**
```javascript
const handleCreate = async (data) => {
  try {
    await someAPI.create(data);
    toast.success('Created successfully');
    fetchData(); // Refresh list
  } catch (error) {
    toast.error('Error creating');
  }
};
```

**Update:**
```javascript
const handleUpdate = async (id, data) => {
  try {
    await someAPI.update(id, data);
    toast.success('Updated successfully');
    fetchData();
  } catch (error) {
    toast.error('Error updating');
  }
};
```

**Delete:**
```javascript
const handleDelete = async (id) => {
  if (confirm('Are you sure?')) {
    try {
      await someAPI.delete(id);
      toast.success('Deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Error deleting');
    }
  }
};
```

### 2. Form Handling Pattern

```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

const handleSubmit = async (e) => {
  e.preventDefault();
  // Validation
  // API call
  // Success/Error handling
};

// In JSX:
<form onSubmit={handleSubmit}>
  <Input
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
</form>
```

### 3. Dialog/Modal Pattern

```javascript
const [dialogOpen, setDialogOpen] = useState(false);
const [editingItem, setEditingItem] = useState(null);

<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogTrigger asChild>
    <Button onClick={() => setEditingItem(null)}>Add New</Button>
  </DialogTrigger>
  <DialogContent>
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  </DialogContent>
</Dialog>
```

## 🔧 Useful Commands

### Development
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
```

### Database
```bash
# Seed database (via API)
curl -X POST http://localhost:3000/api/auth/seed
```

### Adding Dependencies
```bash
bun add package-name           # Add dependency
bun add -d package-name        # Add dev dependency
bunx --bun shadcn@latest add component-name  # Add ShadCN component
```

## 📚 Key Libraries Used

- **Next.js** - Framework
- **Mongoose** - MongoDB ODM
- **NextAuth** - Authentication
- **Framer Motion** - Animations
- **ShadCN UI** - Component library
- **Recharts** - Charts
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## 💡 Pro Tips

1. **Use TypeScript-like patterns:**
   - Add JSDoc comments for better IntelliSense
   ```javascript
   /**
    * @param {string} id - The item ID
    * @returns {Promise<Object>}
    */
   ```

2. **Component Organization:**
   - Keep components small and focused
   - Extract reusable logic into custom hooks
   - Use composition over inheritance

3. **Error Handling:**
   - Always wrap API calls in try-catch
   - Show user-friendly error messages
   - Log errors to console for debugging

4. **Performance:**
   - Use `useMemo` for expensive calculations
   - Use `useCallback` for event handlers passed to children
   - Lazy load heavy components

5. **Code Organization:**
   - Group related files together
   - Use consistent naming conventions
   - Keep API routes close to their models

## 🐛 Debugging Tips

1. **Check Browser Console:**
   - Look for errors in Network tab
   - Check Console for JavaScript errors

2. **Check Server Logs:**
   - Look at terminal where `bun run dev` is running
   - Check for MongoDB connection errors

3. **Common Issues:**
   - MongoDB not running → Start MongoDB service
   - Authentication errors → Check session/role
   - API errors → Check network tab for response

## 📖 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Happy Coding! 🚀**


