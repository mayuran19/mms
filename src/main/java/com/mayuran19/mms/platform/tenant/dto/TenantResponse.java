package com.mayuran19.mms.platform.tenant.dto;

import com.mayuran19.mms.jooq.tables.pojos.Tenants;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TenantResponse(
    UUID id,
    String name,
    String slug,
    String status,
    UUID createdBy,
    OffsetDateTime createdDate,
    UUID lastModifiedBy,
    OffsetDateTime lastModifiedDate
) {
    public static TenantResponse fromEntity(Tenants tenant) {
        return new TenantResponse(
            tenant.getId(),
            tenant.getName(),
            tenant.getSlug(),
            tenant.getStatus(),
            tenant.getCreatedBy(),
            tenant.getCreatedDate(),
            tenant.getLastModifiedBy(),
            tenant.getLastModifiedDate()
        );
    }
}