# API Configuration

This directory contains the **centralized API configuration** for the entire application.

## Files

### `api.js`
Single source of truth for all API calls in the application.

**Exports:**
- `API_BASE_URL` - The base URL for all API endpoints
- `apiClient` - Configured axios instance (default export)

## Usage

### In Services
```javascript
import apiClient from '../config/api';

export const getAllProjects = async () => {
  const response = await apiClient.get('/projects');
  return response.data;
};
```

### In Redux Middleware
```javascript
import apiClient from '../../config/api';

const response = await apiClient({
  method: 'GET',
  url: '/projects',
});
```

### In Components (if needed)
```javascript
import apiClient from '../../config/api';

const data = await apiClient.post('/projects', { name: 'New Project' });
```

## Features

✅ **Centralized Base URL** - Change once, applies everywhere
✅ **Auto Auth Headers** - Automatically adds JWT token from localStorage
✅ **Global Error Handling** - Catches and logs all API errors
✅ **Request/Response Interceptors** - Modify requests/responses globally
✅ **30s Timeout** - Prevents hanging requests
✅ **Environment Support** - Use `REACT_APP_API_URL` env variable

## Environment Variables

Create a `.env` file in the frontend root:

```env
REACT_APP_API_URL=https://api.ustabek.uz/api
```

Or for development:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

## DO NOT

❌ Don't create axios instances in components
❌ Don't hardcode API URLs anywhere else
❌ Don't duplicate API configuration

Always import from this centralized config!
