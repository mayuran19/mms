package com.mayuran19.mms.security;

import java.util.UUID;

public record PlatformUserPrincipal(
    UUID id,
    String username,
    String email
) {
    public static PlatformUserPrincipal from(CustomUserDetails userDetails) {
        if (userDetails.getUserType() != CustomUserDetails.UserType.PLATFORM) {
            throw new IllegalArgumentException("User is not a platform user");
        }
        return new PlatformUserPrincipal(
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail()
        );
    }
}