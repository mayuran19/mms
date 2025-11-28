package com.mayuran19.mms.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class CustomUserDetails implements UserDetails {

    private final UUID id;
    private final String username;
    private final String email;
    private final String passwordHash;
    private final UserType userType;
    private final UUID tenantId;
    private final boolean active;

    public CustomUserDetails(UUID id, String username, String email, String passwordHash,
                           UserType userType, UUID tenantId, boolean active) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.userType = userType;
        this.tenantId = tenantId;
        this.active = active;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return switch (userType) {
            case PLATFORM -> List.of(new SimpleGrantedAuthority("ROLE_PLATFORM_USER"));
            case TENANT -> List.of(new SimpleGrantedAuthority("ROLE_TENANT_USER"));
        };
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public UserType getUserType() {
        return userType;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public enum UserType {
        PLATFORM,
        TENANT
    }
}