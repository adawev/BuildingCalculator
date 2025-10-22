# Underfloor Heating Calculator

Full-stack web app for calculating underfloor heating materials and costs.

## Tech Stack

**Backend:** Spring Boot + PostgreSQL
**Frontend:** React + Redux + Material-UI

---

## Quick Setup

### 1. PostgreSQL Setup

```bash
# Allow passwordless connection
sudo nano /etc/postgresql/16/main/pg_hba.conf
# Change: peer → trust

# Reload PostgreSQL
sudo systemctl reload postgresql

# Create database
psql -U postgres -c "CREATE DATABASE heating_calculator;"
```

### 2. Run Backend

```bash
cd backend
java -jar target/heating-calculator-1.0.0.jar
```

Backend runs on: `http://localhost:8080/api`

### 3. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## Configuration

**Backend:** `backend/src/main/resources/application.yml`
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/heating_calculator
    username: postgres
    password:  # empty for trust auth
```

**Frontend:** Already configured with CORS

---

## API Endpoints

- `POST /api/calculate` - Calculate heating requirements
- `GET /api/materials` - List materials
- `POST /api/projects` - Create project

---

## Troubleshooting

**Password error:** Edit `pg_hba.conf` → change `peer` to `trust`

**CORS error:** Already fixed in backend

**Port in use:** Kill process: `pkill -f java` or `pkill -f vite`

---

## Project Structure

```
underfloor-heating-calculator/
├── backend/
│   ├── src/main/java/com/underfloorheating/
│   │   ├── entity/          # Database models
│   │   ├── repository/      # Data access
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST API
│   │   └── config/          # CORS & Security
│   └── target/
│       └── heating-calculator-1.0.0.jar
│
└── frontend/
    └── src/
        ├── components/      # React components
        ├── redux/           # State management
        └── services/        # API calls
```

---

**That's it!** Simple and clean. 🚀
