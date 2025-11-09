# Hospital Management System

A complete, modern Hospital Management System built with Next.js, MongoDB, and TailwindCSS.

## Features

- 🔐 **Authentication** - NextAuth with role-based access (Admin, Doctor, Receptionist)
- 📊 **Dashboard** - Overview with charts and statistics
- 👥 **Patients Management** - Full CRUD operations for patient records
- 👨‍⚕️ **Doctors Management** - Manage doctor profiles and availability
- 📅 **Appointments** - Schedule and manage patient appointments
- 💰 **Billing** - Track bills and payment status
- ⚙️ **Settings** - User profile and theme toggle

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: NextAuth.js
- **Styling**: TailwindCSS + ShadCN UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Bun (package manager)
- MongoDB connection string (already configured)

### Installation

1. Install dependencies:
```bash
bun install
```

2. Seed the database with an admin user:
```bash
# Make a POST request to /api/auth/seed
# Or use curl:
curl -X POST http://localhost:3000/api/auth/seed
```

Default admin credentials:
- Email: `admin@hospital.com`
- Password: `admin123`

3. Run the development server:
```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard page
│   ├── patients/         # Patients management
│   ├── doctors/          # Doctors management
│   ├── appointments/     # Appointments
│   ├── billing/          # Billing
│   ├── settings/         # Settings
│   └── login/            # Login page
├── components/
│   ├── layout/           # Layout components (Sidebar, Navbar)
│   └── ui/               # ShadCN UI components
├── lib/
│   └── mongodb.js        # MongoDB connection
├── models/               # Mongoose models
└── services/
    └── api.js            # API service functions
```

## Environment Variables

Create a `.env.local` file (optional, defaults are set):

```env
NEXTAUTH_SECRET=your-secret-key-here
MONGODB_URI=mongodb+srv://venom:123@cluster0.juhchz4.mongodb.net/hospital-management
```

## Features in Detail

### Authentication
- Role-based access control
- Protected routes via middleware
- Session management with NextAuth

### Dashboard
- Real-time statistics
- Weekly charts for appointments and revenue
- Animated cards with Framer Motion

### Patients Management
- Searchable patient table
- Add, edit, delete patients
- Link patients to doctors

### Doctors Management
- Doctor cards with availability status
- Specialization and department tracking
- Experience tracking

### Appointments
- Schedule appointments
- Track appointment status
- Link to patients and doctors

### Billing
- Create bills with multiple items
- Track payment status
- Mark bills as paid

### Settings
- User profile display
- Theme toggle (light/dark)
- Logout functionality

## Design

- **Theme**: Black & White minimal aesthetic
- **Responsive**: Mobile, tablet, and desktop support
- **Animations**: Smooth transitions with Framer Motion
- **UI Components**: ShadCN UI components

## License

MIT
