package com.mayuran19.mms.auth.dto;

public record TenantLoginRequest(
        String email,
        String tenantSlug,
        String password
) {}