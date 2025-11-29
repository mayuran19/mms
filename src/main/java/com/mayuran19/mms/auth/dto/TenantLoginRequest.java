package com.mayuran19.mms.auth.dto;

public record TenantLoginRequest(
        String username,
        String tenantSlug,
        String password
) {}