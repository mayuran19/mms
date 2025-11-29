package com.mayuran19.mms.security;

import java.util.UUID;

public record TenantUserPrincipal(
    UUID id,
    UUID tenantId,
    String username,
    String email
) {
    public static TenantUserPrincipal from(CustomUserDetails userDetails) {
        if (userDetails.getUserType() != CustomUserDetails.UserType.TENANT) {
            throw new IllegalArgumentException("User is not a tenant user");
        }
        if (userDetails.getTenantId() == null) {
            throw new IllegalArgumentException("Tenant ID is required for tenant user");
        }
        return new TenantUserPrincipal(
            userDetails.getId(),
            userDetails.getTenantId(),
            userDetails.getUsername(),
            userDetails.getEmail()
        );
    }
}