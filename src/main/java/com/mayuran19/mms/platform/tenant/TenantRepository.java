package com.mayuran19.mms.platform.tenant;

import com.mayuran19.mms.jooq.tables.pojos.Tenants;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.mayuran19.mms.jooq.Tables.TENANTS;

@Repository
public class TenantRepository {

    private final DSLContext dsl;

    public TenantRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public Tenants create(Tenants tenant) {
        return dsl.insertInto(TENANTS)
            .set(TENANTS.ID, tenant.getId())
            .set(TENANTS.NAME, tenant.getName())
            .set(TENANTS.SLUG, tenant.getSlug())
            .set(TENANTS.STATUS, tenant.getStatus())
            .set(TENANTS.CREATED_BY, tenant.getCreatedBy())
            .set(TENANTS.CREATED_DATE, tenant.getCreatedDate())
            .set(TENANTS.LAST_MODIFIED_BY, tenant.getLastModifiedBy())
            .set(TENANTS.LAST_MODIFIED_DATE, tenant.getLastModifiedDate())
            .returning()
            .fetchOneInto(Tenants.class);
    }

    public Optional<Tenants> findById(UUID id) {
        return dsl.selectFrom(TENANTS)
            .where(TENANTS.ID.eq(id))
            .fetchOptionalInto(Tenants.class);
    }

    public Optional<Tenants> findBySlug(String slug) {
        return dsl.selectFrom(TENANTS)
            .where(TENANTS.SLUG.eq(slug))
            .fetchOptionalInto(Tenants.class);
    }

    public List<Tenants> findAll() {
        return dsl.selectFrom(TENANTS)
            .orderBy(TENANTS.CREATED_DATE.desc())
            .fetchInto(Tenants.class);
    }

    public List<Tenants> findByStatus(String status) {
        return dsl.selectFrom(TENANTS)
            .where(TENANTS.STATUS.eq(status))
            .orderBy(TENANTS.CREATED_DATE.desc())
            .fetchInto(Tenants.class);
    }

    public Optional<Tenants> update(UUID id, String name, String status, UUID modifiedBy) {
        return dsl.update(TENANTS)
            .set(TENANTS.NAME, name)
            .set(TENANTS.STATUS, status)
            .set(TENANTS.LAST_MODIFIED_BY, modifiedBy)
            .set(TENANTS.LAST_MODIFIED_DATE, OffsetDateTime.now())
            .where(TENANTS.ID.eq(id))
            .returning()
            .fetchOptionalInto(Tenants.class);
    }

    public boolean delete(UUID id) {
        int deleted = dsl.deleteFrom(TENANTS)
            .where(TENANTS.ID.eq(id))
            .execute();
        return deleted > 0;
    }

    public boolean existsBySlug(String slug) {
        return dsl.fetchExists(
            dsl.selectFrom(TENANTS)
                .where(TENANTS.SLUG.eq(slug))
        );
    }

    public boolean existsBySlugAndNotId(String slug, UUID id) {
        return dsl.fetchExists(
            dsl.selectFrom(TENANTS)
                .where(TENANTS.SLUG.eq(slug))
                .and(TENANTS.ID.ne(id))
        );
    }
}