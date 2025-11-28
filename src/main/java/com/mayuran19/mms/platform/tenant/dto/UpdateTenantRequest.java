package com.mayuran19.mms.platform.tenant.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateTenantRequest(
    @Size(min = 2, max = 255, message = "Tenant name must be between 2 and 255 characters")
    String name,

    @Pattern(regexp = "^(ACTIVE|INACTIVE|SUSPENDED)$", message = "Status must be ACTIVE, INACTIVE, or SUSPENDED")
    String status
) {}