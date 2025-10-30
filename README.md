# 🔥 Tyopliy Pol Calculator | Калькулятор Теплого Пола

> **Professional underfloor heating material calculator** - Calculate materials, manage projects, export to PDF

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/ustabek)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)

---

## ✨ Features

### 🏠 **Multi-Room Project Calculator**
- **Auto-incrementing project names** - Smart naming: "Проект #1", "Проект #2", etc.
- **Add unlimited rooms** - Calculate materials for entire house
- **Real-time calculations** - Instant material requirements
- **Auto-save** - Projects save automatically
- **Edit & manage** - Full CRUD operations on rooms and projects

### 📊 **Material Management**
- **13 pre-loaded materials** - Pipes, collectors, insulation, and more
- **Custom materials** - Add your own materials
- **Availability toggle** - Mark materials as available/unavailable
- **Unit tracking** - Meters, pieces, kilograms, etc.

### 📜 **Project History**
- **View all projects** - Complete history with details
- **Expandable details** - See all room calculations
- **Export to PDF** - Professional bilingual reports
- **Edit anytime** - Modify project names and details
- **Search & filter** - Find projects quickly

### 📄 **Professional PDF Export**
- **Prominent logo** - 60x30px logo on every PDF
- **Clean sans-serif fonts** - Professional Helvetica typography
- **Bilingual support** - Uzbek and Russian
- **Detailed breakdown** - Room info, materials, quantities
- **Branded footer** - Professional touch

### 🎨 **Modern UI/UX**
- **Material-UI components** - Clean, responsive design
- **Color-coded sections** - Easy navigation
- **Smart logo sizing** - 150px on main page, 60px on others
- **Smooth animations** - Delightful user experience
- **Mobile-friendly** - Works on all devices

---

## 🚀 Tech Stack

### **Backend**
- **Spring Boot 3.5.7** - Modern Java framework
- **PostgreSQL 17** - Robust database
- **JPA/Hibernate** - ORM for data persistence
- **Maven** - Dependency management
- **Apache PDFBox** - PDF generation

### **Frontend**
- **React 18.2** - Modern UI library
- **Material-UI (MUI) 5.15** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation
- **Vite** - Lightning-fast build tool
- **jsPDF** - Client-side PDF generation

---

## 📦 Quick Setup

### **Prerequisites**
- Java 17+
- Node.js 18+
- PostgreSQL 17
- Maven 3.9+

### **1️⃣ Database Setup**

```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Create database
psql -U postgres -c "CREATE DATABASE heating_calculator;"

# Configure authentication (if needed)
sudo nano /etc/postgresql/17/main/pg_hba.conf
# Change: peer → trust (for local development)

# Reload PostgreSQL
sudo systemctl reload postgresql
```

### **2️⃣ Backend Setup**

```bash
cd backend

# Build the project
./mvnw clean package -DskipTests

# Run the application
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

**Backend running at:** `http://localhost:8080/api` ✅

### **3️⃣ Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend running at:** `http://localhost:3001/` ✅

---

## 🎯 API Endpoints

### **Projects**
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects/{id}/summary` - Get project summary
- `GET /api/projects/{id}/summary/pdf` - Download PDF

### **Calculations**
- `POST /api/calculations` - Create calculation
- `GET /api/calculations/{id}` - Get calculation
- `PUT /api/calculations/{id}` - Update calculation
- `DELETE /api/calculations/{id}` - Delete calculation
- `GET /api/calculations/project/{projectId}` - Get all calculations for project

### **Materials**
- `GET /api/materials` - List all materials
- `POST /api/materials` - Add new material
- `PUT /api/materials/{id}` - Update material
- `DELETE /api/materials/{id}` - Delete material

---

## 📁 Project Structure

```
ustabek/
├── backend/
│   ├── src/main/java/diyor/adawev/backend/
│   │   ├── config/              # Configuration (CORS, etc.)
│   │   ├── controller/          # REST API endpoints
│   │   ├── dto/                 # Data transfer objects
│   │   ├── entity/              # JPA entities
│   │   ├── repository/          # Data access layer
│   │   ├── service/             # Business logic
│   │   └── BackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── target/
│       └── backend-0.0.1-SNAPSHOT.jar
│
└── frontend/
    ├── src/
    │   ├── features/            # Assets (images, etc.)
    │   ├── pages/               # Page components
    │   │   ├── LandingPage/
    │   │   ├── MultiRoomCalculator/
    │   │   ├── Materials/
    │   │   └── History/
    │   ├── utils/               # Utilities (PDF generator)
    │   ├── App.js               # Main app component
    │   └── main.js              # Entry point
    ├── package.json
    └── vite.config.js
```

---

## 🎨 Configuration

### **Backend Configuration**
`backend/src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/heating_calculator
spring.datasource.username=postgres
spring.datasource.password=roots

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server
server.port=8080
server.servlet.context-path=/api
```

### **Frontend Configuration**
API URL is configured in each page component:
```javascript
const API_URL = 'http://localhost:8080/api';
```

---

## 🐛 Troubleshooting

### **Database Connection Error**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Verify database exists
psql -U postgres -l | grep heating_calculator
```

### **Port Already in Use**
```bash
# Kill process on port 8080 (backend)
lsof -ti:8080 | xargs kill -9

# Kill process on port 3001 (frontend)
lsof -ti:3001 | xargs kill -9
```

### **Backend Build Fails**
```bash
# Clean and rebuild
cd backend
./mvnw clean install -DskipTests
```

### **Frontend Dependencies Issue**
```bash
# Clear and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Usage Guide

### **1. Create a New Project**
1. Navigate to **"Расчет дома"** from the landing page
2. Project name auto-generates (e.g., "Проект #1")
3. Edit project name if needed (auto-saves on blur)

### **2. Add Rooms**
1. Enter room name (e.g., "Гостиная")
2. Enter dimensions (length × width in meters)
3. Click "Добавить" - Room is added instantly

### **3. Calculate Materials**
1. After adding all rooms, click **"Рассчитать материалы"**
2. View complete material breakdown
3. See total quantities for entire project

### **4. Export to PDF**
1. Click **PDF** button in header
2. Download professional bilingual report
3. Share with clients or contractors

### **5. Manage Materials**
1. Go to **"Материалы"** page
2. Add, edit, or delete materials
3. Toggle availability as needed

### **6. View History**
1. Go to **"История"** page
2. See all projects with expandable details
3. Edit, delete, or export any project

---

## 🌟 What's New in V1.0

- ✅ **Smart project naming** - Auto-incrementing numbers
- ✅ **Bigger, better logos** - 150px main, 60px pages, 60x30 PDF
- ✅ **Clean code** - Removed Redux, optimized imports
- ✅ **Auto-save** - Project names save on blur
- ✅ **Sans-serif PDFs** - Professional Helvetica fonts
- ✅ **Bug fixes** - React hooks optimization
- ✅ **No unused code** - Lean and efficient

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 👨‍💻 Developer

**Diyor Adawev**

---

## 🙏 Acknowledgments

- Material-UI team for amazing components
- Spring Boot community
- PostgreSQL team

---

**Built with ❤️ for the construction industry**

*Making underfloor heating calculations simple and professional.*
