# Member Management System (MMS)

A full-stack application for managing members and tenants with a Spring Boot backend and React frontend.

## Tech Stack

### Backend
- Java 25
- Spring Boot 4.0.0
- Spring Security (Session-based authentication)
- PostgreSQL
- jOOQ (Type-safe SQL)
- Liquibase (Database migrations)
- Docker Compose

### Frontend
- React 18
- TypeScript
- Vite
- TanStack Router
- Material UI
- ESLint

## Prerequisites

- **Java 25** - [Download here](https://www.oracle.com/java/technologies/downloads/)
- **Maven** (included via mvnw wrapper)
- **Docker** and **Docker Compose** - For PostgreSQL
- **Node.js 18+** and **npm** - [Download here](https://nodejs.org/)

## Quick Start

### 1. Start PostgreSQL with Docker Compose

```bash
docker-compose up -d
```

This will start a PostgreSQL database on port 5432 with:
- Database: `mms`
- Username: `mms`
- Password: `password`

### 2. Start the Backend

```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

On first run, Liquibase will:
- Create all database tables
- Insert an initial platform admin user

### 3. Start the Frontend

```bash
cd frontend
npm install  # First time only
npm run dev
```

The frontend will start on `http://localhost:3000`

## Default Login Credentials

### Platform Admin
- **Username:** `admin`
- **Email:** `admin@platform.local`
- **Password:** `Admin@123`

**Important:** Change this password after first login in production!

## Project Structure

```
mms/
├── src/                              # Backend source code
│   ├── main/
│   │   ├── java/com/mayuran19/mms/
│   │   │   ├── auth/                 # Authentication controllers
│   │   │   ├── security/             # Security configuration
│   │   │   ├── jooq/                 # Generated jOOQ classes
│   │   │   └── MmsApplication.java
│   │   └── resources/
│   │       ├── db/changelog/         # Liquibase migrations
│   │       └── application.yml       # Application configuration
│   └── test/                         # Backend tests
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── routes/                   # TanStack Router routes
│   │   ├── components/               # React components
│   │   ├── services/                 # API services
│   │   ├── theme/                    # Material UI theme
│   │   └── types/                    # TypeScript types
│   ├── public/                       # Static assets
│   └── package.json                  # Frontend dependencies
├── docs/                             # Documentation
├── compose.yaml                      # Docker Compose configuration
├── pom.xml                           # Maven dependencies
└── README.md                         # This file
```

## Database

The application uses PostgreSQL with Liquibase for schema management.

### Migrations

Database migrations are in `src/main/resources/db/changelog/changes/`:

1. `001-create-tenants-table.xml` - Tenants table
2. `002-create-platform-users-table.xml` - Platform users table
3. `003-create-tenant-users-table.xml` - Tenant users table
4. `004-create-spring-session-tables.xml` - Spring Session tables
5. `005-insert-initial-platform-user.xml` - Initial admin user

### Regenerate jOOQ Classes

After database changes:

```bash
./mvnw clean compile
```

## API Endpoints

### Authentication

**Platform Login**
```
POST /api/auth/platform/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123"
}
```

**Platform Logout**
```
POST /api/auth/platform/logout
```

**Tenant Login**
```
POST /api/auth/tenant/login
Content-Type: application/json

{
  "tenantId": "uuid",
  "username": "user",
  "password": "password"
}
```

**Tenant Logout**
```
POST /api/auth/tenant/logout
```

### Protected Endpoints

- `/api/platform/**` - Requires `ROLE_PLATFORM_USER`
- `/api/tenant/**` - Requires `ROLE_TENANT_USER`

## Development

### Backend Development

```bash
# Run with hot reload
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build
./mvnw clean package
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Building for Production

### Backend Only

```bash
./mvnw clean package
java -jar target/mms-0.0.1-SNAPSHOT.jar
```

### Full Stack

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Copy frontend build to Spring Boot static resources:
```bash
cp -r frontend/dist/* src/main/resources/static/
```

3. Build the backend:
```bash
./mvnw clean package
```

4. Run:
```bash
java -jar target/mms-0.0.1-SNAPSHOT.jar
```

The application will be available at `http://localhost:8080`

## Configuration

### Backend Configuration

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mms
    username: mms
    password: password

server:
  port: 8080
  servlet:
    session:
      timeout: 30m
```

### Frontend Configuration

Edit `frontend/vite.config.ts` for the API proxy:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

## Security

- Session-based authentication using Spring Session JDBC
- BCrypt password hashing
- CSRF protection disabled (enable for production if needed)
- Role-based access control (RBAC)

## Next Steps

1. Change the default admin password
2. Implement tenant management UI
3. Add user management features
4. Implement member management for tenants
5. Add email verification
6. Set up proper CORS configuration
7. Enable CSRF protection for production
8. Add comprehensive tests
9. Set up CI/CD pipeline

## License

This project is licensed under the MIT License.