# 🚀 Employee Logistics - Workforce Management Platform

A production-ready Employee Attendance System built with the **MERN stack** (MongoDB, Express, React, Node.js) featuring a modern Learning Platform UI inspired by Coursera, Udemy, and Notion.

## ✨ Features

### For Employees
- ✅ **Check-in/Check-out** with one click
- 📅 **Calendar View** of attendance history with color-coded statuses
- 📊 **Dashboard** with monthly statistics and 7-day activity chart
- 👤 **Profile Page** to view and manage personal information
- 🕐 Real-time tracking of today's attendance status
- 📈 Monthly summary (present, absent, late, half-day counts)

### For Managers
- 👥 **Team Dashboard** with comprehensive analytics
- 📊 **Charts & Visualizations** (weekly trend, department breakdown)
- 📋 **All Attendance Records** with advanced filtering
- 📅 **Team Calendar View** showing all employees' attendance
- 📄 **Reports Generation** with CSV export
- ⏰ **Late Arrivals** and **Absent Employees** tracking
- 🔍 Filter by date range, status, department, and employee

### Business Logic
- 🚫 **Prevents duplicate check-ins** per day
- ⏱️ **Late marking** if check-in after 9:30 AM
- 🕒 **Half-day marking** if total hours < 4
- 🤖 **Auto absent marking** via daily cron job (runs at 00:05 AM)
- ⏳ **Automatic hours calculation** between check-in and check-out

## 🎨 UI/UX Highlights

- 🌌 **Dark Navy Blue Gradient** theme
- 💎 **Glassmorphism** effects on cards
- ✨ **Smooth Animations** and transitions
- 📱 **Fully Responsive** design
- 🎯 **Modern Typography** (Inter font)
- 🔔 **Toast Notifications** for user feedback
- 📊 **Interactive Charts** using Recharts
- 📆 **FullCalendar** integration for attendance history

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Redux Toolkit (state management)
- React Router v6 (routing)
- Axios (API calls)
- Tailwind CSS (styling with custom theme)
- Recharts (data visualization)
- FullCalendar (calendar view)
- React Hot Toast (notifications)
- React Icons
- date-fns (date formatting)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (authentication)
- bcrypt (password hashing)
- express-validator (input validation)
- json2csv (CSV export)
- node-cron (auto-mark absent)
- Helmet (security)
- Morgan (logging)
- CORS

## 📁 Project Structure

```
Tap_Demo/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/          # Mongoose models
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Cron jobs
│   │   └── validations/     # Input validators
│   ├── server.js            # Express app
│   ├── seed.js              # Database seeding
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── features/        # Redux slices
    │   ├── layouts/         # Layout components
    │   ├── pages/           # Route pages
    │   ├── services/        # API service layer
    │   ├── App.jsx          # Main app with routing
    │   ├── main.jsx         # Entry point
    │   └── index.css        # Global styles
    ├── tailwind.config.js   # Tailwind configuration
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

## 📱 Required Pages

**Employee:**
- ✅ Login/Register
- ✅ Dashboard
- ✅ Mark Attendance (integrated in Dashboard)
- ✅ My Attendance History
- ✅ Profile

**Manager:**
- ✅ Login
- ✅ Dashboard
- ✅ All Employees Attendance
- ✅ Team Calendar View
- ✅ Reports
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository** (or use the existing `Tap_Demo` folder)

2. **Setup Backend**

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env and add your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/attendance_system
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance_system

# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

3. **Seed the Database**

```bash
npm run seed
```

This will create:
- 2 Managers
- 10 Employees
- 30 days of attendance data

4. **Start Backend Server**

```bash
npm start
# Server runs on http://localhost:5000
```

5. **Setup Frontend** (in a new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

6. **Open in Browser**

Navigate to `http://localhost:5173`

## 🔐 Demo Login Credentials

### Manager Account
- **Email:** john.manager@company.com
- **Password:** password123

### Employee Account
- **Email:** alice.johnson@company.com
- **Password:** password123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (Protected)

### Employee Attendance
- `POST /api/attendance/checkin` - Check-in
- `POST /api/attendance/checkout` - Check-out
- `GET /api/attendance/my-history` - Get history (paginated)
- `GET /api/attendance/my-summary?month=YYYY-MM` - Monthly summary
- `GET /api/attendance/today` - Today's status

### Manager Attendance
- `GET /api/attendance/all` - All attendance (with filters)
- `GET /api/attendance/employee/:id` - Specific employee attendance
- `GET /api/attendance/summary` - Team summary
- `GET /api/attendance/export` - Export to CSV
- `GET /api/attendance/today-status` - Who's present today

### Dashboard
- `GET /api/dashboard/employee` - Employee stats
- `GET /api/dashboard/manager` - Manager stats

## 🗄️ Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'employee' | 'manager',
  employeeCode: String (unique),
  department: String
}
```

### Attendance Collection
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: 'present' | 'absent' | 'late' | 'half-day',
  totalHours: Number
}
```

## 🎯 Key Features Implementation

### Auto-Mark Absent Cron Job
Runs daily at 00:05 AM to mark employees absent who didn't check in the previous day.

### Business Rules
- **Late Status:** Check-in after 9:30 AM → status = 'late'
- **Half-Day:** Total hours < 4 → status = 'half-day'
- **Present:** Normal attendance → status = 'present'
- **Absent:** No check-in → status = 'absent'

## 🔒 Security Features
- JWT token authentication
- Password hashing with bcrypt (10 rounds)
- Input validation and sanitization
- Protected routes (role-based access control)
- Helmet for security headers
- CORS configured

## 📱 Responsive Design
- Mobile-first approach
- Collapsible sidebar on desktop
- Hamburger menu on mobile
- Touch-friendly buttons and interactions

## 🎨 Customization

### Change Theme Colors
Edit `frontend/tailwind.config.js` to customize the color palette:

```javascript
colors: {
  navy: {
    950: '#0A1929', // Primary background
  },
  // ... modify other colors
}
```

### Modify Business Rules
Edit `backend/src/controllers/attendanceController.js`:
- Change late time threshold
- Adjust half-day hours
- Modify status logic

## 📦 Build for Production

### Backend
```bash
cd backend
npm start
# Use PM2 or similar for production deployment
```

### Frontend
```bash
cd frontend
npm run build
# Serve the 'dist' folder with your preferred web server
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check firewall settings for MongoDB Atlas
- Verify network access in Atlas dashboard
- From `backend/`, run `npm run test:db` for a direct mongoose connection test
- From `backend/`, run `npm run diagnose:db` to test DNS and TCP reachability to Atlas hosts

### Frontend Not Loading
- Check if backend is running on port 5000
- Verify VITE_API_URL in frontend/.env
- Clear browser cache

### Cron Job Not Running
- Ensure server timezone is correct
- Check server logs for cron execution
- Verify node-cron is installed

## 📄 License
MIT

## 👨‍💻 Author
Built with ❤️ using the MERN stack

---

**Enjoy using AttendEase! 🎉**
