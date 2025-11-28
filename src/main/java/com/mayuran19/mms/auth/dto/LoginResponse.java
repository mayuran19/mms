package com.mayuran19.mms.auth.dto;

import java.util.UUID;

public record LoginResponse(
        UUID userId,
        String username,
        String email,
        String userType,
        UUID tenantId,
        String message
) {}