# Tenant Management API

The tenant management feature allows platform administrators to create, read, update, and delete tenants in the system.

## Package Structure

The feature follows a feature-based package structure:

```
com.mayuran19.mms.tenant/
├── dto/
│   ├── CreateTenantRequest.java
│   ├── UpdateTenantRequest.java
│   └── TenantResponse.java
├── TenantController.java
├── TenantService.java
└── TenantRepository.java
```

## Database Schema

### Tenants Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Tenant display name |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | URL-friendly identifier |
| status | VARCHAR(50) | NOT NULL | ACTIVE, INACTIVE, or SUSPENDED |
| created_by | UUID | NOT NULL | User who created the tenant |
| created_date | TIMESTAMP WITH TIME ZONE | NOT NULL | Creation timestamp |
| last_modified_by | UUID | NOT NULL | User who last modified the tenant |
| last_modified_date | TIMESTAMP WITH TIME ZONE | NOT NULL | Last modification timestamp |

## API Endpoints

All endpoints require `ROLE_PLATFORM_USER` authentication.

### Create Tenant

```
POST /api/platform/tenants
Content-Type: application/json

{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "status": "ACTIVE"
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "status": "ACTIVE",
  "createdBy": "00000000-0000-0000-0000-000000000001",
  "createdDate": "2025-11-28T14:30:00Z",
  "lastModifiedBy": "00000000-0000-0000-0000-000000000001",
  "lastModifiedDate": "2025-11-28T14:30:00Z"
}
```

**Validation Rules**:
- `name`: Required, 2-255 characters
- `slug`: Required, 2-100 characters, lowercase letters, numbers, and hyphens only
- `status`: Required, must be ACTIVE, INACTIVE, or SUSPENDED

**Error Responses**:
- `400 Bad Request`: Validation errors
- `409 Conflict`: Tenant with the same slug already exists

### Get All Tenants

```
GET /api/platform/tenants
```

**Optional Query Parameters**:
- `status`: Filter by status (ACTIVE, INACTIVE, SUSPENDED)

**Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "status": "ACTIVE",
    ...
  }
]
```

### Get Tenant by ID

```
GET /api/platform/tenants/{id}
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "status": "ACTIVE",
  ...
}
```

**Error Responses**:
- `404 Not Found`: Tenant not found

### Get Tenant by Slug

```
GET /api/platform/tenants/slug/{slug}
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "status": "ACTIVE",
  ...
}
```

**Error Responses**:
- `404 Not Found`: Tenant not found

### Update Tenant

```
PUT /api/platform/tenants/{id}
Content-Type: application/json

{
  "name": "Acme Corporation Updated",
  "status": "INACTIVE"
}
```

**Note**: The slug cannot be updated. All fields are optional.

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Corporation Updated",
  "slug": "acme-corp",
  "status": "INACTIVE",
  ...
}
```

**Error Responses**:
- `404 Not Found`: Tenant not found
- `400 Bad Request`: Validation errors

### Delete Tenant

```
DELETE /api/platform/tenants/{id}
```

**Response** (204 No Content)

**Error Responses**:
- `404 Not Found`: Tenant not found

## Testing the API

### Prerequisites
1. Start the application with Java 25:
```bash
export JAVA_HOME=~/.sdkman/candidates/java/25.0.1-oracle
export PATH=$JAVA_HOME/bin:$PATH
./mvnw spring-boot:run
```

2. Login as platform admin to get a session cookie:
```bash
curl -c cookies.txt -X POST http://localhost:8080/api/auth/platform/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

### Example cURL Commands

**Create a Tenant**:
```bash
curl -b cookies.txt -X POST http://localhost:8080/api/platform/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "slug": "test-company",
    "status": "ACTIVE"
  }'
```

**List All Tenants**:
```bash
curl -b cookies.txt http://localhost:8080/api/platform/tenants
```

**Get Tenant by ID**:
```bash
curl -b cookies.txt http://localhost:8080/api/platform/tenants/{tenant-id}
```

**Update Tenant**:
```bash
curl -b cookies.txt -X PUT http://localhost:8080/api/platform/tenants/{tenant-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company Updated",
    "status": "INACTIVE"
  }'
```

**Delete Tenant**:
```bash
curl -b cookies.txt -X DELETE http://localhost:8080/api/platform/tenants/{tenant-id}
```

## Implementation Details

### Feature-Based Package Structure

The implementation follows a feature-based (vertical slice) package structure where all components related to tenant management are grouped together:

- **DTOs**: Request and response objects with validation
- **Repository**: Data access layer using jOOQ
- **Service**: Business logic and transaction management
- **Controller**: REST API endpoints with security

### Security

- All endpoints require platform user authentication (`@PreAuthorize("hasRole('PLATFORM_USER')")`)
- Created/modified by fields are automatically populated from the current user's session
- Session-based authentication using Spring Session JDBC

### Validation

- Jakarta Bean Validation is used for request validation
- Custom validation patterns for slug format
- Status enum validation

### Error Handling

- Custom exceptions for not found and already exists scenarios
- Exception handlers in controller for consistent error responses
- HTTP status codes following REST conventions

## Future Enhancements

- Add pagination for list endpoints
- Add search and filtering capabilities
- Implement soft delete instead of hard delete
- Add audit logging for tenant operations
- Add tenant-specific configuration options