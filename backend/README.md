# Underfloor Heating Calculator - Backend

Spring Boot backend для калькулятора теплого пола.

## Технологии
- Java 17
- Spring Boot 3.5.7
- PostgreSQL
- JPA/Hibernate

## Запуск

### 1. База данных
```bash
# Создать базу данных
createdb -U postgres heating_calculator

# Запустить миграции (из папки backend-new)
cd migrations
./run_all.sh

# После успешного выполнения можно удалить папку migrations
cd ..
rm -rf migrations
```

### 2. Конфигурация
Настройки в `src/main/resources/application.properties`:
- Database URL: `jdbc:postgresql://localhost:5432/heating_calculator`
- Username: `postgres`
- Password: `roots`

### 3. Сборка и запуск
```bash
# Сборка
mvn clean package

# Запуск
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

API доступен на: http://localhost:8080/api

## API Endpoints

### Calculations
- `POST /api/calculations` - Создать расчет
- `GET /api/calculations/{id}` - Получить расчет

### Materials (13 default materials автоматически добавляются при миграции)
- `GET /api/materials` - Все материалы
- `GET /api/materials/{id}` - Один материал
- `POST /api/materials` - Создать материал
- `PUT /api/materials/{id}` - Обновить материал
- `DELETE /api/materials/{id}` - Удалить материал (soft delete)

### Projects
- `GET /api/projects` - Все проекты
- `GET /api/projects/{id}` - Один проект
- `POST /api/projects` - Создать проект
- `PUT /api/projects/{id}` - Обновить проект
- `DELETE /api/projects/{id}` - Удалить проект
