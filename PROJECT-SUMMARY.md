# CakeControl - Project Summary

## Overview

**CakeControl** คือ React UI Component Library พร้อมระบบ Authentication สำหรับ CAMT (วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่)

- **Framework:** React 19 + Vite 7
- **Routing:** React Router DOM v7
- **Testing:** Jest 30 + Testing Library
- **Linting:** ESLint 9
- **HTTP Client:** Axios + Fetch API
- **Charts:** Chart.js 4 + Recharts 2
- **Backend API:** `http://localhost:3002` (configurable via `VITE_API_URL`)

---

## Project Structure

```
cakecontrol/
├── src/
│   ├── Apis/                  # API service layer
│   │   ├── auth.jsx           # Authentication (login, register, logout, refresh token)
│   │   └── user.jsx           # User, Group, Role, File Upload, Permissions CRUD
│   ├── Apis_test/             # API unit tests
│   │   ├── auth.test.jsx
│   │   └── user.test.jsx
│   ├── config/
│   │   └── api.config.js      # API base URL & endpoint configuration
│   ├── forms/                 # Page-level forms
│   │   ├── Login.jsx          # หน้า Login
│   │   ├── Register.jsx       # หน้า Register
│   │   └── Dashboard.jsx      # หน้า Dashboard
│   ├── components/
│   │   ├── AppLayout.jsx      # Layout หลัก
│   │   ├── SampleControl.jsx  # ตัวอย่างการใช้งาน Controls
│   │   ├── controls/          # ** UI Controls Library (40+ components) **
│   │   │   ├── index.js       # Central export
│   │   │   ├── AccordionControl.jsx
│   │   │   ├── AlertModal.jsx
│   │   │   ├── BadgeControl.jsx
│   │   │   ├── ButtonControl.jsx
│   │   │   ├── ButtonGroupControl.jsx
│   │   │   ├── CalendarControl.jsx
│   │   │   ├── CalendarGridControl.jsx
│   │   │   ├── CardControl.jsx
│   │   │   ├── CheckboxControl.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── DateControl.jsx
│   │   │   ├── DatePickerControl.jsx
│   │   │   ├── DropdownControl.jsx
│   │   │   ├── FormControl.jsx
│   │   │   ├── GridviewControl.jsx
│   │   │   ├── IconControl.jsx
│   │   │   ├── ImageControl.jsx
│   │   │   ├── LabelControl.jsx
│   │   │   ├── LinkControl.jsx
│   │   │   ├── MenuControl.jsx
│   │   │   ├── MultipleUploadControl.jsx
│   │   │   ├── NumberControl.jsx
│   │   │   ├── PaginationControl.jsx
│   │   │   ├── PasswordControl.jsx
│   │   │   ├── ProgressControl.jsx
│   │   │   ├── QRCodeControl.jsx
│   │   │   ├── RatingControl.jsx
│   │   │   ├── SearchBoxControl.jsx
│   │   │   ├── SelectControl.jsx
│   │   │   ├── SliderControl.jsx
│   │   │   ├── TabControl.jsx
│   │   │   ├── TableviewControl.jsx
│   │   │   ├── TextboxControl.jsx
│   │   │   ├── ToggleControl.jsx
│   │   │   ├── TreeControl.jsx
│   │   │   ├── ChartControl.jsx        (Recharts)
│   │   │   ├── BarChartJSControl.jsx    (Chart.js)
│   │   │   ├── LineChartJSControl.jsx   (Chart.js)
│   │   │   ├── PieChartJSControl.jsx    (Chart.js)
│   │   │   ├── DoughnutChartJSControl.jsx
│   │   │   ├── RadarChartJSControl.jsx
│   │   │   ├── AreaChartJSControl.jsx
│   │   │   ├── BubbleChartJSControl.jsx
│   │   │   └── MixedChartJSControl.jsx
│   │   └── controls_doc/      # Built-in documentation pages
│   │       ├── ControlsDocs.jsx
│   │       └── pages/         # 30+ demo pages (one per control)
│   ├── ThemeContext.jsx        # Theme provider (Light/Dark)
│   ├── ThemeSwitcher.jsx       # Theme toggle component
│   ├── theme.css               # CSS variables for theming
│   ├── App.jsx                 # Router & main app
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── package.json
├── index.html
├── eslint.config.js
├── jest.config.js
└── babel.config.json
```

---

## Key Features

### 1. UI Controls Library (40+ components)
- **Input:** Textbox, Number, Password, Select, Checkbox, Toggle, Slider, DatePicker, SearchBox
- **Display:** Label, Badge, Icon, Image, Link, Progress, Rating, QRCode
- **Layout:** Card, Accordion, Tab, Grid, Form, Menu, Tree, Pagination
- **Data:** Tableview, Gridview
- **Charts:** Chart.js (Bar, Line, Pie, Doughnut, Radar, Area, Bubble, Mixed) + Recharts
- **Modals:** AlertModal, ConfirmModal
- **Upload:** MultipleUploadControl (chunked base64 upload)

### 2. Authentication System
- Login / Register / Logout
- JWT access token + auto-expiry check
- Token refresh support
- Token stored in `localStorage`

### 3. API Layer (REST)
- **Users (userx):** CRUD, groups, roles
- **Groups (groupx):** CRUD, members management
- **Roles (rolex):** CRUD with permissions schema
- **File Upload:** Chunked upload (initiate -> chunk -> finalize)
- **Permissions:** Permission check utilities

### 4. Theme System
- Light / Dark mode
- CSS variables-based theming
- System preference detection
- Persistent via `localStorage`

### 5. Documentation
- Built-in `/controls-docs` route with live demos for all controls

---

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Redirect | Redirect ไป `/login` |
| `/login` | Login | หน้า Login |
| `/register` | Register | หน้าลงทะเบียน |
| `/sample` | SampleControl | ตัวอย่าง Controls |
| `/controls-docs` | ControlsDocs | เอกสาร Controls ทั้งหมด |

---

## Scripts

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests (Jest)
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run lint         # ESLint
```

---

## Notes

- UI ใช้ภาษาไทยเป็นหลัก (error messages, labels)
- Backend API ใช้ naming convention: `userx`, `groupx`, `rolex`, `appx` (มี suffix `x`)
- Controls ทุกตัว export จาก `src/components/controls/index.js` สามารถ import แบบ named import ได้เลย
- แต่ละ control มีไฟล์ CSS คู่กัน (ไม่ใช้ CSS-in-JS)
