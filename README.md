<div align="center">
  <img src="logo.png" alt="UstaBek Logo" width="200"/>

  # UstaBek
  ### Калькулятор Теплого Пола | Underfloor Heating Calculator

  *Professional material calculator for underfloor heating systems*

  [![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/ustabek)
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
</div>

---

## 📖 About

**UstaBek** is a professional web application designed for construction professionals to accurately calculate materials needed for underfloor heating installations. Built with modern technologies, it simplifies complex calculations and generates professional reports in seconds.

Whether you're a contractor working on multiple projects or a construction company standardizing your estimation process, UstaBek streamlines material calculations, project management, and client presentations.

---

## ✨ Features

### 🏠 **Multi-Room Project Calculator**
- Calculate materials for entire houses with multiple rooms
- Auto-incrementing project names (Проект #1, #2, #3...)
- Add, edit, and delete rooms with real-time calculations
- Automatic material requirements based on room dimensions
- View comprehensive project summaries with metrics

### 📊 **Material Management**
- 13 pre-loaded construction materials (pipes, collectors, insulation, etc.)
- Add custom materials with your own specifications
- Toggle material availability
- Track different units (meters, pieces, kilograms)
- Edit or remove materials as needed

### 📜 **Project History**
- View all projects in an organized table
- Expand projects to see detailed room breakdowns
- Edit project names inline
- Delete projects with confirmation dialogs
- Search and filter through project history
- Pagination for easy navigation

### 📄 **Professional PDF Export**
- Generate bilingual reports (Uzbek/Russian)
- Company logo on every document
- Clean, professional typography (Helvetica)
- Detailed material breakdowns
- Room-by-room calculations
- Ready to share with clients

### 🎨 **Modern User Interface**
- Clean, responsive Material-UI design
- Color-coded sections for easy navigation
- Smooth animations and transitions
- Mobile-friendly layout
- Intuitive workflow

---

## 🚀 Tech Stack

### **Backend**
```
Framework:      Spring Boot 3.5.7
Language:       Java 17
Database:       PostgreSQL 17
ORM:            Hibernate/JPA
Build Tool:     Maven
PDF Library:    Apache PDFBox 2.0.30
API Style:      RESTful
```

### **Frontend**
```
Library:        React 18.2
UI Framework:   Material-UI (MUI) 5.15
Build Tool:     Vite 5.0.8
Router:         React Router 6.21
HTTP Client:    Axios 1.6.2
State:          React Hooks
PDF:            jsPDF 2.5.1
```

### **Database**
```
System:         PostgreSQL 17
Tables:         4 (projects, calculations, materials, material_items)
ORM:            JPA/Hibernate
Connection:     HikariCP Pool
```

---

## 🎯 Usage

### **1. Create a New Project**
1. Navigate to **"Расчет дома"** from the main page
2. Project name auto-generates (e.g., "Проект #1")
3. Edit the project name if desired (auto-saves)

### **2. Add Rooms**
1. Enter room name (e.g., "Гостиная", "Спальня")
2. Enter room dimensions (length × width in meters)
3. Click **"Добавить"**
4. Room appears in the list with calculated area

### **3. Calculate Materials**
1. After adding all rooms, click **"Рассчитать материалы"**
2. System calculates required materials for all rooms
3. View comprehensive breakdown:
   - Total rooms
   - Total area
   - Pipe length required
   - Material quantities

### **4. Export to PDF**
1. Click **"PDF"** button in the header
2. Professional bilingual report downloads automatically
3. Share with clients or use for procurement

### **5. Manage Materials**
1. Go to **"Материалы"** from the main page
2. View all available materials
3. Add new materials with custom specifications
4. Edit existing materials
5. Toggle availability as needed

### **6. Review Project History**
1. Go to **"История"** from the main page
2. See all completed and ongoing projects
3. Click to expand and view room details
4. Edit project names directly in the table
5. Download PDFs for past projects
6. Delete old projects when needed

---

## 📦 Quick Setup

### **Prerequisites**
- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 17
- Maven 3.9+

### **1. Database Setup**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE heating_calculator;"
```

### **2. Backend**
```bash
cd backend

# Build
./mvnw clean package -DskipTests

# Run
java -jar target/backend-0.0.1-SNAPSHOT.jar
```
Backend runs on: **http://localhost:8080/api**

### **3. Frontend**
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
Frontend runs on: **http://localhost:3001/**

---

## 📱 Screenshots

### Main Dashboard
Clean, professional landing page with three main sections:
- **Расчет дома** - Multi-room calculator
- **Материалы** - Material management
- **История** - Project history

### Multi-Room Calculator
Add rooms, calculate materials, view summaries, and export to PDF - all in one place.

### Material Management
Manage your material database with full CRUD operations.

### Project History
Track all projects with expandable details and PDF export.

---

## 🔧 Configuration

### Backend
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/heating_calculator
spring.datasource.username=postgres
spring.datasource.password=your_password

server.port=8080
server.servlet.context-path=/api
```

### Frontend
API endpoint configured in page components:
```javascript
const API_URL = 'http://localhost:8080/api';
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 👨‍💻 Developer

**Diyor Adawev**

---

<div align="center">
  <strong>Built with ❤️ for the construction industry</strong>
  <br/>
  <em>Making underfloor heating calculations simple and professional</em>
</div>
