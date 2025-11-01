# UstaBek Project - Comprehensive Structure Analysis

## Project Overview
**UstaBek** is a professional web application for calculating materials needed for underfloor heating installations. It features a modern React frontend with a Spring Boot backend.

**Repository Location:** `/home/adawev/UstaBek`

---

## 1. Overall Project Structure

```
UstaBek/
├── backend/                    # Spring Boot REST API
├── frontend/                   # React + Vite SPA
├── start.sh                    # Startup script
├── README.md                   # Project documentation
├── CHANGELOG.md               # Version history
├── logo.png                   # Project logo
├── .git/                      # Git repository
└── .gitignore                 # Git ignore rules
```

### Key Configuration Files
- **Backend:** `pom.xml` (Maven build config)
- **Frontend:** `package.json`, `vite.config.js`
- **Backend:** `application.properties` (Spring configuration)

---

## 2. Backend Analysis

### Framework & Technology Stack
- **Framework:** Spring Boot 3.5.7
- **Language:** Java 17
- **Database:** PostgreSQL 17
- **ORM:** Hibernate/JPA
- **Build Tool:** Maven
- **PDF Generation:** Apache PDFBox 2.0.30
- **Additional:** Lombok, Jackson
- **API Style:** RESTful
- **Server Port:** 8888
- **Context Path:** `/api`

### Backend Directory Structure
```
backend/src/main/java/diyor/adawev/backend/
├── BackendApplication.java          # Main Spring Boot app entry point
├── config/
│   └── WebConfig.java              # CORS configuration
├── controller/                      # REST endpoint handlers
│   ├── ProjectController.java      # Project CRUD + PDF endpoints
│   ├── CalculationController.java  # Calculation/room endpoints
│   └── MaterialController.java     # Material management endpoints
├── service/                         # Business logic
│   ├── ProjectService.java         # Project operations
│   ├── CalculationService.java     # Calculation logic
│   ├── MaterialService.java        # Material management
│   └── PdfService.java            # PDF generation
├── repository/                      # Data access layer (JPA)
│   ├── ProjectRepository.java
│   ├── CalculationRepository.java
│   └── MaterialRepository.java
├── entity/                          # JPA entities
│   ├── Project.java
│   ├── Calculation.java
│   ├── Material.java
│   ├── MaterialItem.java
│   └── CollectorInfo.java
└── dto/                             # Data Transfer Objects
    ├── ProjectRequest.java
    ├── ProjectResponse.java
    ├── ProjectSummaryResponse.java
    ├── CalculationRequest.java
    ├── CalculationResponse.java
    ├── MaterialRequest.java
    ├── MaterialResponse.java
    └── Others...
```

### Database Configuration
```properties
# File: backend/src/main/resources/application.properties
spring.application.name=underfloor-heating-calculator
spring.datasource.url=jdbc:postgresql://localhost:5432/heating_calculator
spring.datasource.username=postgres
spring.datasource.password=roots
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8888
server.servlet.context-path=/api
```

### REST API Endpoints

#### Projects Controller (`/api/projects`)
- `POST /` - Create new project
- `GET /` - Get all projects
- `GET /{id}` - Get specific project
- `PUT /{id}` - Update project
- `DELETE /{id}` - Delete project
- `GET /{id}/summary` - Get project summary
- `GET /{id}/summary/pdf` - Download project PDF

#### Calculations Controller (`/api/calculations`)
- `POST /` - Create calculation
- `GET /{id}` - Get calculation
- `GET /project/{projectId}` - Get all calculations for project
- `PUT /{id}` - Update calculation
- `DELETE /{id}` - Delete calculation

#### Materials Controller (`/api/materials`)
- `GET /` - Get all materials
- `GET /{id}` - Get specific material
- `POST /` - Create material
- `PUT /{id}` - Update material
- `DELETE /{id}` - Delete material

### CORS Configuration
File: `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/config/WebConfig.java`

```java
Allowed Origins: 
- http://localhost:3000
- http://localhost:3001
- http://localhost:5173
- https://ustabek.uz

Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: *
Credentials: true
```

### Error Handling Status
- **Current Status:** NO dedicated error handler found
- **Exception Handling:** Relies on Spring Boot default error handling
- **Custom Exception Classes:** None found
- **Error Response Format:** Uses Spring default error response

---

## 3. Frontend Analysis

### Framework & Technology Stack
- **Library:** React 18.2
- **UI Framework:** Material-UI (MUI) 5.15
- **Build Tool:** Vite 5.0.8
- **Router:** React Router 6.21
- **HTTP Client:** Axios 1.6.2
- **State Management:** React Hooks + Redux Toolkit 2.0.1
- **PDF Generation:** jsPDF 2.5.1
- **Internationalization:** i18next 23.7.11
- **Server Port:** 3000 (via Vite)

### Frontend Directory Structure
```
frontend/src/
├── main.js                         # Vite entry point
├── index.css                       # Global styles
├── App.js                          # Main app component with routing
├── pages/                          # Page components
│   ├── LandingPage/
│   │   └── LandingPage.js         # Home page with menu
│   ├── MultiRoomCalculator/
│   │   └── MultiRoomCalculator.js # Main calculator page
│   ├── Materials/
│   │   └── Materials.js           # Material management page
│   ├── History/
│   │   └── History.js             # Project history page
│   └── CalculatorPage/
│       └── CalculatorPage.js      # Legacy calculator page
├── components/                     # Reusable components
│   ├── CalculatorForm/
│   │   └── CalculatorForm.js
│   └── ResultsDisplay/
│       └── ResultsDisplay.js
├── features/                       # Feature slices & assets
│   ├── theme/
│   │   └── themeSlice.js          # Redux theme slice
│   └── images/
│       └── logo.png
├── store/                          # Redux store configuration
│   ├── store.js                   # Store setup
│   ├── api.js                     # API utilities
│   ├── middleware/
│   │   └── api.js                 # API middleware
│   └── reducers/
│       ├── calculation.js         # Calculation state
│       └── project.js             # Project state
└── utils/                          # Utility functions
    └── pdfGenerator.js            # PDF generation utilities
```

### Main Routing (React Router v6)
File: `/home/adawev/UstaBek/frontend/src/App.js`

```javascript
Routes:
- "/" → LandingPage (home)
- "/multi-room" → MultiRoomCalculator (main calculator)
- "/materials" → Materials (material management)
- "/history" → History (project history)

Current Status: NO catch-all route or 404 handler
```

### Current Routing Implementation
```javascript
// App.js
<Router>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/multi-room" element={<MultiRoomCalculator />} />
    <Route path="/materials" element={<Materials />} />
    <Route path="/history" element={<History />} />
    {/* MISSING: 404 catch-all route */}
  </Routes>
</Router>
```

### Theme Configuration
- Primary Color: #576861 (forest green)
- Secondary Color: #ffffff
- Success: #22c55e
- Error: #ef4444
- Warning: #f59e0b
- Info: #3b82f6

### API Configuration
File: `/home/adawev/UstaBek/frontend/src/pages/MultiRoomCalculator/MultiRoomCalculator.js`

```javascript
API_URL = 'https://api.ustabek.uz/api'
```

Also in Vite config:
```javascript
proxy: {
  '/api': {
    target: 'https://api.ustabek.uz',
    changeOrigin: true
  }
}
```

---

## 4. Current Error Handling Analysis

### Backend Error Handling
- **Custom Exception Handlers:** NONE found
- **Error Handling:** Relies on Spring Boot defaults
- **Error Response Format:** Standard Spring error responses
- **Status Codes:** Controllers use standard HTTP status codes
  - 200 OK for successful GET/PUT
  - 201 CREATED for POST
  - 204 NO CONTENT for DELETE
  - No 404 handling for not found resources

### Frontend Error Handling
- **404 Page:** NONE
- **Error Boundaries:** NONE
- **Global Error Handler:** NONE
- **HTTP Error Handling:** Basic try-catch in components
  - Axios errors logged to console
  - User notifications via Snackbar
  - No graceful handling of routing to non-existent routes

**Example from MultiRoomCalculator.js:**
```javascript
try {
  const response = await axios.get(`${API_URL}/projects`);
  // ...
} catch (error) {
  console.error('Error fetching projects:', error);
  showNotification('Project yuklashda xatolik', 'error');
}
```

---

## 5. Recommendations for 404 Page Implementation

### Frontend 404 Handler

**Location:** Create new file
`/home/adawev/UstaBek/frontend/src/pages/NotFoundPage/NotFoundPage.js`

**Implementation:**
1. Create a NotFoundPage component with:
   - Centered layout with 404 heading
   - Explanation message
   - Back to home button
   - Maybe an icon (use Material-UI icons)
   - Consistent theme colors (#576861)

2. Update `/home/adawev/UstaBek/frontend/src/App.js`:
```javascript
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

// Add at END of Routes (before closing Routes)
<Route path="*" element={<NotFoundPage />} />
```

3. Add styling to match existing design patterns

### Backend 404 Handler (Optional but Recommended)

**Location:** Create new file
`/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/exception/GlobalExceptionHandler.java`

**Implementation:**
1. Create custom exception classes:
   - `ResourceNotFoundException.java`
   - `ValidationException.java`

2. Create global exception handler with `@ControllerAdvice`
   - Handle 404 errors
   - Return consistent error response format
   - Handle validation errors
   - Handle generic exceptions

3. Create error response DTO:
   `ErrorResponse.java`

4. Modify controllers to throw proper exceptions

---

## 6. File Paths Summary

### Key Frontend Files
- App Router: `/home/adawev/UstaBek/frontend/src/App.js`
- Theme Config: `/home/adawev/UstaBek/frontend/src/App.js` (theme creation)
- Pages Directory: `/home/adawev/UstaBek/frontend/src/pages/`
- Components: `/home/adawev/UstaBek/frontend/src/components/`
- Store: `/home/adawev/UstaBek/frontend/src/store/store.js`

### Key Backend Files
- Main App: `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/BackendApplication.java`
- CORS Config: `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/config/WebConfig.java`
- Controllers: `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/controller/`
- Services: `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/service/`
- Config: `/home/adawev/UstaBek/backend/src/main/resources/application.properties`

### Build Configuration
- Frontend Config: `/home/adawev/UstaBek/frontend/vite.config.js`
- Frontend Package: `/home/adawev/UstaBek/frontend/package.json`
- Backend Build: `/home/adawev/UstaBek/backend/pom.xml`

---

## 7. Technology Compatibility Matrix

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 18.2 | UI Library |
| | React Router | 6.21 | Client-side routing |
| | Material-UI | 5.15 | UI Components |
| | Vite | 5.0.8 | Build tool |
| | Axios | 1.6.2 | HTTP client |
| **Backend** | Spring Boot | 3.5.7 | Framework |
| | Java | 17 | Language |
| | Hibernate/JPA | (included) | ORM |
| | PostgreSQL | 17 | Database |
| | Maven | (builtin) | Build tool |
| | PDFBox | 2.0.30 | PDF generation |

---

## 8. Development Workflow

### Starting the Application

Run from project root:
```bash
./start.sh
```

Or separately:
```bash
# Backend (port 8888, context /api)
cd backend
mvn spring-boot:run

# Frontend (port 3000)
cd frontend
npm install
npm run dev
```

### Frontend Development Server
- Runs on: `http://localhost:3000`
- Build: `npm run build`
- Preview: `npm run preview`

### Backend Development Server
- Runs on: `http://localhost:8888`
- API Base: `http://localhost:8888/api`
- Database: PostgreSQL on localhost:5432

---

## 9. Project Statistics

- **Backend Java Files:** 28+ files
- **Frontend JS Components:** 16 files
- **Page Components:** 5 (LandingPage, MultiRoomCalculator, Materials, History, CalculatorPage)
- **Services:** 4 (Project, Calculation, Material, PDF)
- **Controllers:** 3 (Project, Calculation, Material)
- **Dependencies:** 20+ (npm), 6+ (maven)

---

## 10. Next Steps for 404 Implementation

1. **Priority 1 - Frontend:** Add NotFoundPage component and catch-all route
2. **Priority 2 - Polish:** Add error boundaries for better error handling
3. **Priority 3 - Backend:** Add global exception handler for consistent API error responses
4. **Priority 4 - Testing:** Test all error scenarios

---

## Notes

- Application supports multiple languages (Russian, Uzbek)
- Uses Redux Toolkit for complex state management
- Strong focus on material calculations and PDF export
- Professional Material-UI design throughout
- No existing custom error handling infrastructure
- All API calls handled individually in components
