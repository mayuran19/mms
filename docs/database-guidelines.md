# Database Schema Guidelines

## Multi-Tenant SaaS Architecture

This document outlines the database design standards for the Member Management System (MMS), a multi-tenant SaaS platform.

## Core Principles

### 1. Multi-Tenancy
- **All tenant-scoped tables MUST include a `tenant_id` column**
- Platform-level tables (e.g., `tenants`, `platform_users`) are exempt from this requirement
- Use row-level tenant isolation for data security

### 2. Primary Keys
- **Use UUIDv7 (time-ordered UUID) for all primary keys**
- UUIDv7 provides:
  - Chronological ordering (timestamp-based prefix)
  - Database index efficiency
  - Distributed system compatibility
  - No collision risk across tenants

### 3. Audit Fields
Every table MUST include the following audit columns:
- `created_by` (UUID, NOT NULL) - References platform_users.id
- `created_date` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- `last_modified_by` (UUID, NOT NULL) - References platform_users.id
- `last_modified_date` (TIMESTAMPTZ, NOT NULL, DEFAULT CURRENT_TIMESTAMP)

## Standard Table Structure

### Platform-Level Tables
Platform tables manage the SaaS infrastructure itself.

```sql
CREATE TABLE platform_users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_by UUID NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID NOT NULL,
    last_modified_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    created_by UUID NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID NOT NULL,
    last_modified_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Tenant-Scoped Tables
All business domain tables MUST follow this pattern:

```sql
CREATE TABLE example_entity (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    -- Business columns here --
    created_by UUID NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID NOT NULL,
    last_modified_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Index for tenant-scoped queries
CREATE INDEX idx_example_entity_tenant_id ON example_entity(tenant_id);
```

## UUID Generation

### Java Application Layer
UUIDs are generated in the Java application layer using the **FasterXML java-uuid-generator** library before persisting to the database.

**Library:**
```xml
<dependency>
    <groupId>com.fasterxml.uuid</groupId>
    <artifactId>java-uuid-generator</artifactId>
    <version>5.1.0</version>
</dependency>
```

**Usage Example:**
```java
import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.TimeBasedEpochGenerator;
import java.util.UUID;

public class UuidGenerator {
    private static final TimeBasedEpochGenerator generator = Generators.timeBasedEpochGenerator();

    public static UUID generateId() {
        return generator.generate();
    }
}
```

**Benefits:**
- Time-ordered UUIDs (UUIDv7/time-based epoch) for efficient database indexing
- Monotonically increasing IDs improve B-tree index performance
- No database-side UUID generation overhead
- Consistent UUID generation across distributed services
- Application-level control and testability

**Important:**
- Always generate UUIDs in the application before INSERT
- Do NOT use database DEFAULT values for UUID columns
- Use the same UUID generation strategy across all services
- Thread-safe generator instance should be reused (singleton pattern)

## Naming Conventions

### Tables
- Use snake_case
- Plural nouns for collections (e.g., `members`, `organizations`)
- Platform tables prefixed with `platform_` (e.g., `platform_users`)

### Columns
- Use snake_case
- Foreign keys: `{referenced_table_singular}_id` (e.g., `tenant_id`, `organization_id`)
- Boolean columns: Prefix with `is_`, `has_`, `can_` (e.g., `is_active`, `has_access`)
- Timestamps: Use `_date` suffix (e.g., `created_date`, `expiry_date`)

### Indexes
- Format: `idx_{table_name}_{column_names}`
- Example: `idx_members_tenant_id_email`

### Foreign Keys
- Format: `fk_{table_name}_{referenced_table}`
- Example: `fk_members_tenants`

## Query Patterns

### Tenant Isolation
Always include tenant_id in WHERE clauses for tenant-scoped data:

```sql
SELECT * FROM members
WHERE tenant_id = :tenantId
  AND is_active = true;
```

### Audit Trail
Update audit fields on every modification:

```sql
UPDATE members
SET
    email = :newEmail,
    last_modified_by = :userId,
    last_modified_date = CURRENT_TIMESTAMP
WHERE id = :memberId
  AND tenant_id = :tenantId;
```

## JOOQ Code Generation

### Configuration
- Package: `com.mayuran19.mms.jooq`
- Generate POJOs with equals/hashCode
- Generate DAOs for all tables
- Use Java Time types for temporal fields
- Enable fluent setters

### Exclusions
Exclude Liquibase metadata tables:
- `databasechangelog`
- `databasechangeloglock`

## Security Considerations

1. **Never expose internal UUIDs in public APIs** - Use separate public IDs if needed
2. **Always validate tenant_id in application layer** - Prevent cross-tenant data access
3. **Use parameterized queries** - Prevent SQL injection
4. **Implement row-level security (RLS)** - Additional defense layer in PostgreSQL
5. **Audit all data access** - Log queries with tenant context

## Migration Strategy

### Liquibase Best Practices
1. One changeset per logical change
2. Include rollback instructions where possible
3. Use descriptive changeset IDs: `{number}-{description}`
4. Tag releases for easy rollback points
5. Test migrations on production-like data volumes

### Tenant Onboarding
New tenant creation should:
1. Insert record into `tenants` table
2. Create initial admin user linked to tenant
3. Initialize tenant-specific configuration
4. Set up default roles and permissions

## Performance Optimization

1. **Partition large tables by tenant_id** - For multi-million row tables
2. **Index tenant_id + frequently queried columns** - Composite indexes
3. **Use UUIDv7 clustering** - Improves sequential insert performance
4. **Monitor query plans** - Ensure tenant_id filters use indexes
5. **Consider read replicas** - For reporting and analytics

## Compliance

- **GDPR**: Audit fields support data lineage tracking
- **Data Residency**: tenant_id enables geographic data isolation
- **Audit Requirements**: created_date and modified_date track data lifecycle
