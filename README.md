# Transport App Server

A Node.js/Express server for transport application management.

## Environment Configuration

This application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

### Database Configuration
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
DB_DATE_STRINGS=true
```

### Server Configuration
```
PORT=3001
NODE_ENV=development
```

### CORS Configuration
```
CORS_ORIGIN=*
```

### File Paths
```
STATIC_FILES_PATH=report/fichier
```

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your configuration (use `.env.example` as a template)

3. Start the server:
   ```bash
   npm start
   ```

## Project Structure

- `config.js` - Centralized configuration management
- `db.js` - Database connection pool
- `routes/` - Modular route handlers
- `utils/` - Utility functions
- `report/` - PDF generation and report handling

## Features

- Modular route organization
- Environment-based configuration
- MySQL database integration
- PDF report generation
- Authentication system
- CORS support

## Authentication (JWT)

This server uses JSON Web Tokens (JWT) for stateless authentication.

### Environment variables

Add to your `.env`:
```
JWT_SECRET=change_me_in_env
JWT_EXPIRES_IN=7d
```

### Login endpoints
- `POST /login_centre` with JSON body `{ "username": "...", "password": "..." }`
- `POST /login_service` with JSON body `{ "username": "...", "password": "...", "service": "..." }`

On success, the response includes:
```
{ "token": "<jwt>", "user": { ... }, "expiresIn": "7d" }
```

### Authenticated requests
Send the token in the `Authorization` header:
```
Authorization: Bearer <jwt>
```

### Check current user
- `GET /auth/me` returns the decoded user if the token is valid.

### Protecting routes
Use the middleware in `middleware/auth.js`:
```js
const { authenticateToken } = require('./middleware/auth');
router.get('/secure-endpoint', authenticateToken, (req, res) => { /* ... */ });
```
