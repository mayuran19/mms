package com.mayuran19.mms.platform.tenant.dto;

import com.mayuran19.mms.jooq.tables.pojos.TenantUsers;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TenantUserResponse(
    UUID id,
    UUID tenantId,
    String email,
    String firstName,
    String lastName,
    OffsetDateTime createdDate,
    OffsetDateTime lastModifiedDate
) {
    public static TenantUserResponse fromEntity(TenantUsers user) {
        return new TenantUserResponse(
            user.getId(),
            user.getTenantId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getCreatedDate(),
            user.getLastModifiedDate()
        );
    }
}