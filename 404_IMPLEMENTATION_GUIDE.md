# 404 Page Implementation Guide for UstaBek

## Quick Reference - Where to Add 404 Page Handler

### Frontend Implementation (PRIORITY 1)

#### Step 1: Create NotFoundPage Component
Create file: `/home/adawev/UstaBek/frontend/src/pages/NotFoundPage/NotFoundPage.js`

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ErrorOutlineIcon sx={{ fontSize: 120, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
            404
          </Typography>
          
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Страница не найдена
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ py: 1.5, px: 4 }}
          >
            Вернуться на главную
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
```

#### Step 2: Update App.js
File: `/home/adawev/UstaBek/frontend/src/App.js`

Add import at the top:
```javascript
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
```

Update the Routes section - ADD THIS AT THE END before closing `</Routes>`:
```javascript
<Route path="*" element={<NotFoundPage />} />
```

Complete Routes section should look like:
```javascript
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/multi-room" element={<MultiRoomCalculator />} />
  <Route path="/materials" element={<Materials />} />
  <Route path="/history" element={<History />} />
  <Route path="*" element={<NotFoundPage />} />  {/* ADD THIS LINE */}
</Routes>
```

---

### Backend Implementation (PRIORITY 2 - OPTIONAL)

#### Step 1: Create ResourceNotFoundException
File: `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/exception/ResourceNotFoundException.java`

```java
package diyor.adawev.backend.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

#### Step 2: Create ErrorResponse DTO
File: `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/dto/ErrorResponse.java`

```java
package diyor.adawev.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private String path;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
}
```

#### Step 3: Create GlobalExceptionHandler
File: `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/exception/GlobalExceptionHandler.java`

```java
package diyor.adawev.backend.exception;

import diyor.adawev.backend.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error("Resource Not Found")
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFound(
            NoHandlerFoundException ex,
            HttpServletRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error("Endpoint Not Found")
                .message("The requested API endpoint does not exist")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(
            Exception ex,
            HttpServletRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Internal Server Error")
                .message("An unexpected error occurred")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

#### Step 4: Update application.properties
File: `/home/adawev/UstaBek/backend/src/main/resources/application.properties`

Add these lines:
```properties
# Error Handling
server.error.include-message=always
server.error.include-binding-errors=always
spring.mvc.throw-exception-if-no-handler-found=true
spring.web.resources.add-mappings=false
```

#### Step 5: Update Controllers (Example for ProjectController)
File: `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/controller/ProjectController.java`

Add import:
```java
import diyor.adawev.backend.exception.ResourceNotFoundException;
```

Update methods to throw exceptions:
```java
@GetMapping("/{id}")
public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
    return ResponseEntity.ok(
        projectService.getProject(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id))
    );
}
```

---

## Implementation Checklist

### Frontend (Required)
- [ ] Create `/home/adawev/UstaBek/frontend/src/pages/NotFoundPage/NotFoundPage.js`
- [ ] Import NotFoundPage in `App.js`
- [ ] Add `<Route path="*" element={<NotFoundPage />} />` to Routes
- [ ] Test by visiting non-existent route (e.g., `/nonexistent`)

### Backend (Optional but Recommended)
- [ ] Create exception directory
- [ ] Create ResourceNotFoundException.java
- [ ] Create ErrorResponse.java DTO
- [ ] Create GlobalExceptionHandler.java
- [ ] Update application.properties
- [ ] Update controllers to use new exception handling
- [ ] Test API endpoints with invalid IDs

---

## Files Modified/Created Summary

### Frontend
- **Created:** 
  - `/home/adawev/UstaBek/frontend/src/pages/NotFoundPage/NotFoundPage.js` (new)
  - `/home/adawev/UstaBek/frontend/src/pages/NotFoundPage/` (new directory)

- **Modified:**
  - `/home/adawev/UstaBek/frontend/src/App.js` (add import + route)

### Backend (Optional)
- **Created:**
  - `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/exception/ResourceNotFoundException.java`
  - `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/exception/GlobalExceptionHandler.java`
  - `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/dto/ErrorResponse.java`
  - `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/exception/` (new directory)

- **Modified:**
  - `/home/adawev/UstaBek/backend/src/main/resources/application.properties`
  - All controller files (add throw statements)

---

## Testing the Implementation

### Frontend Testing
1. Start the app: `npm run dev`
2. Visit: `http://localhost:3000/nonexistent-page`
3. Should see 404 page with back button

### Backend Testing
1. Start backend: `mvn spring-boot:run`
2. Test invalid project: `curl http://localhost:8888/api/projects/99999`
3. Should get proper error response with 404 status

---

## Color Scheme Reference
- Primary: `#576861` (forest green)
- Error: `#ef4444` (red)
- Success: `#22c55e` (green)
- Background: `#f8f9fa` (light gray)

---

## Related Files in Project

**Router Setup:** `/home/adawev/UstaBek/frontend/src/App.js`
**Theme Config:** `/home/adawev/UstaBek/frontend/src/App.js`
**Pages Directory:** `/home/adawev/UstaBek/frontend/src/pages/`
**Controllers:** `/home/adawev/UstaBek/backend/src/main/java/diyor/adawev/backend/controller/`

---

## Notes
- The catch-all route `*` must be the LAST route in React Router
- Multilingual support exists; add Uzbek translation if needed
- Material-UI theme is already configured and consistent
- Error handling follows Spring Boot best practices
