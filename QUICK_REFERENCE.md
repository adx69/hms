# Quick Reference Guide

## 🎯 Most Common Tasks

### 1. Add a New Page
1. Create `src/app/newpage/page.js`
2. Add to sidebar in `src/components/layout/Sidebar.jsx`

### 2. Create API Endpoint
1. Create `src/app/api/resource/route.js`
2. Add auth check: `getServerSession(authOptions)`
3. Add to `src/services/api.js`

### 3. Add Database Model
1. Create `src/models/ModelName.js`
2. Define schema with Mongoose
3. Export model

## ⌨️ VS Code Shortcuts Cheat Sheet

### Editing
- `Ctrl + D` - Select next occurrence
- `Alt + Click` - Multi-cursor
- `Ctrl + Shift + K` - Delete line
- `Alt + Up/Down` - Move line
- `Shift + Alt + Up/Down` - Copy line
- `Ctrl + /` - Toggle comment
- `Ctrl + Shift + L` - Select all occurrences

### Navigation
- `Ctrl + P` - Quick file open
- `Ctrl + Shift + P` - Command palette
- `Ctrl + B` - Toggle sidebar
- `Ctrl + J` - Toggle panel
- `Ctrl + \` - Split editor

### IntelliSense
- `Ctrl + Space` - Trigger suggestions
- `Ctrl + .` - Quick fix
- `F2` - Rename symbol
- `Ctrl + Click` - Go to definition

## 📝 Code Snippets (Type these and press Tab)

### In VS Code (after adding snippets file):
- `napi` - Next.js API route template
- `rcomp` - React component template
- `mmodel` - Mongoose model template
- `crudpage` - CRUD page template
- `formhandler` - Form handler pattern

### Emmet (in JSX files):
- `div.container` → `<div className="container"></div>`
- `button.btn` → `<button className="btn"></button>`
- `ul>li*3` → 3 list items
- `div.card>h1+p` → Card with heading and paragraph

## 🔥 Common Patterns

### API Call Pattern
```javascript
try {
  const response = await someAPI.getAll();
  setData(response.data);
} catch (error) {
  toast.error('Error');
}
```

### Form Pattern
```javascript
const [formData, setFormData] = useState({ name: '' });

<form onSubmit={handleSubmit}>
  <Input
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
  />
</form>
```

### Dialog Pattern
```javascript
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger><Button>Open</Button></DialogTrigger>
  <DialogContent>Content</DialogContent>
</Dialog>
```

## 🚀 Quick Commands

```bash
bun run dev          # Start dev server
bun add package      # Add dependency
bunx shadcn@latest add button  # Add ShadCN component
```

## 📁 File Locations

- **Pages**: `src/app/[name]/page.js`
- **API Routes**: `src/app/api/[name]/route.js`
- **Components**: `src/components/`
- **Models**: `src/models/`
- **Services**: `src/services/api.js`
- **Layout**: `src/components/layout/`

## 🎨 Component Imports

```javascript
// UI Components
import { Button, Card, Input } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table } from '@/components/ui/table';

// Icons
import { Users, Calendar } from 'lucide-react';

// Utils
import { toast } from 'sonner';
import { motion } from 'framer-motion';
```

## 🔐 Authentication Pattern

```javascript
const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## 💾 Database Pattern

```javascript
await connectDB();
const items = await ModelName.find();
```

---

**Print this and keep it handy! 📌**


