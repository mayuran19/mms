package com.mayuran19.mms.platform.tenant.dto;

import jakarta.validation.constraints.Size;

public record UpdateTenantUserRequest(
    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    String firstName,

    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    String lastName,

    Boolean isActive
) {}