package com.mayuran19.mms.security;

import com.mayuran19.mms.jooq.tables.pojos.PlatformUsers;
import com.mayuran19.mms.jooq.tables.pojos.TenantUsers;
import org.jooq.DSLContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static com.mayuran19.mms.jooq.Tables.PLATFORM_USERS;
import static com.mayuran19.mms.jooq.Tables.TENANT_USERS;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final DSLContext dsl;

    public CustomUserDetailsService(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username.contains("@tenant:")) {
            return loadTenantUser(username);
        } else {
            return loadPlatformUser(username);
        }
    }

    private UserDetails loadPlatformUser(String username) throws UsernameNotFoundException {
        PlatformUsers user = dsl.selectFrom(PLATFORM_USERS)
                .where(PLATFORM_USERS.USERNAME.eq(username)
                        .or(PLATFORM_USERS.EMAIL.eq(username)))
                .fetchOneInto(PlatformUsers.class);

        if (user == null) {
            throw new UsernameNotFoundException("Platform user not found: " + username);
        }

        return new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPasswordHash(),
                CustomUserDetails.UserType.PLATFORM,
                null,
                user.getIsActive() != null && user.getIsActive()
        );
    }

    private UserDetails loadTenantUser(String username) throws UsernameNotFoundException {
        String[] parts = username.split("@tenant:");
        if (parts.length != 2) {
            throw new UsernameNotFoundException("Invalid tenant user format: " + username);
        }

        String email = parts[0];
        String tenantSlug = parts[1];

        TenantUsers user = dsl.select(TENANT_USERS.fields())
                .from(TENANT_USERS)
                .join(com.mayuran19.mms.jooq.Tables.TENANTS)
                .on(TENANT_USERS.TENANT_ID.eq(com.mayuran19.mms.jooq.Tables.TENANTS.ID))
                .where(TENANT_USERS.EMAIL.eq(email)
                        .and(com.mayuran19.mms.jooq.Tables.TENANTS.SLUG.eq(tenantSlug)))
                .fetchOneInto(TenantUsers.class);

        if (user == null) {
            throw new UsernameNotFoundException("Tenant user not found: " + username);
        }

        boolean active = user.getStatus() != null && user.getStatus().equalsIgnoreCase("ACTIVE");

        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getEmail(),
                user.getPasswordHash(),
                CustomUserDetails.UserType.TENANT,
                user.getTenantId(),
                active
        );
    }
}