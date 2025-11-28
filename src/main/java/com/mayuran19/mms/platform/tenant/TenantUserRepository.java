package com.mayuran19.mms.platform.tenant;

import com.mayuran19.mms.jooq.tables.pojos.TenantUsers;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.mayuran19.mms.jooq.Tables.TENANT_USERS;

@Repository
public class TenantUserRepository {

    private final DSLContext dsl;

    public TenantUserRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public TenantUsers create(TenantUsers user) {
        return dsl.insertInto(TENANT_USERS)
            .set(TENANT_USERS.ID, user.getId())
            .set(TENANT_USERS.TENANT_ID, user.getTenantId())
            .set(TENANT_USERS.EMAIL, user.getEmail())
            .set(TENANT_USERS.PASSWORD_HASH, user.getPasswordHash())
            .set(TENANT_USERS.FIRST_NAME, user.getFirstName())
            .set(TENANT_USERS.LAST_NAME, user.getLastName())
            .set(TENANT_USERS.CREATED_DATE, user.getCreatedDate())
            .set(TENANT_USERS.LAST_MODIFIED_DATE, user.getLastModifiedDate())
            .returning()
            .fetchOneInto(TenantUsers.class);
    }

    public Optional<TenantUsers> findById(UUID id) {
        return dsl.selectFrom(TENANT_USERS)
            .where(TENANT_USERS.ID.eq(id))
            .fetchOptionalInto(TenantUsers.class);
    }

    public Optional<TenantUsers> findByEmail(String email) {
        return dsl.selectFrom(TENANT_USERS)
            .where(TENANT_USERS.EMAIL.eq(email))
            .fetchOptionalInto(TenantUsers.class);
    }

    public List<TenantUsers> findByTenantId(UUID tenantId) {
        return dsl.selectFrom(TENANT_USERS)
            .where(TENANT_USERS.TENANT_ID.eq(tenantId))
            .orderBy(TENANT_USERS.CREATED_DATE.desc())
            .fetchInto(TenantUsers.class);
    }

    public List<TenantUsers> findAll() {
        return dsl.selectFrom(TENANT_USERS)
            .orderBy(TENANT_USERS.CREATED_DATE.desc())
            .fetchInto(TenantUsers.class);
    }

    public Optional<TenantUsers> update(UUID id, String firstName, String lastName) {
        var updateStep = dsl.update(TENANT_USERS)
            .set(TENANT_USERS.LAST_MODIFIED_DATE, OffsetDateTime.now());

        if (firstName != null) {
            updateStep = updateStep.set(TENANT_USERS.FIRST_NAME, firstName);
        }

        if (lastName != null) {
            updateStep = updateStep.set(TENANT_USERS.LAST_NAME, lastName);
        }

        return updateStep
            .where(TENANT_USERS.ID.eq(id))
            .returning()
            .fetchOptionalInto(TenantUsers.class);
    }

    public boolean delete(UUID id) {
        int deleted = dsl.deleteFrom(TENANT_USERS)
            .where(TENANT_USERS.ID.eq(id))
            .execute();
        return deleted > 0;
    }

    public boolean existsByEmail(String email) {
        return dsl.fetchExists(
            dsl.selectFrom(TENANT_USERS)
                .where(TENANT_USERS.EMAIL.eq(email))
        );
    }

    public boolean existsByTenantId(UUID tenantId) {
        return dsl.fetchExists(
            dsl.selectFrom(TENANT_USERS)
                .where(TENANT_USERS.TENANT_ID.eq(tenantId))
        );
    }

    public long countByTenantId(UUID tenantId) {
        return dsl.selectCount()
            .from(TENANT_USERS)
            .where(TENANT_USERS.TENANT_ID.eq(tenantId))
            .fetchOne(0, Long.class);
    }
}