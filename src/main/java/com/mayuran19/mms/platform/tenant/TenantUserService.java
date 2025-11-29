package com.mayuran19.mms.platform.tenant;

import com.mayuran19.mms.jooq.tables.pojos.TenantUsers;
import com.mayuran19.mms.platform.tenant.dto.CreateTenantUserRequest;
import com.mayuran19.mms.platform.tenant.dto.TenantUserResponse;
import com.mayuran19.mms.platform.tenant.dto.UpdateTenantUserRequest;
import com.mayuran19.mms.security.PlatformUserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TenantUserService {

    private final TenantUserRepository tenantUserRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;

    public TenantUserService(
        TenantUserRepository tenantUserRepository,
        TenantRepository tenantRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.tenantUserRepository = tenantUserRepository;
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public TenantUserResponse createTenantUser(PlatformUserPrincipal principal, UUID tenantId, CreateTenantUserRequest request) {
        // Verify tenant exists
        tenantRepository.findById(tenantId)
            .orElseThrow(() -> new TenantNotFoundException("Tenant not found with id: " + tenantId));

        // Check if username already exists
        if (tenantUserRepository.existsByEmail(request.email())) {
            throw new TenantUserAlreadyExistsException("User with username '" + request.email() + "' already exists");
        }

        OffsetDateTime now = OffsetDateTime.now();

        TenantUsers user = new TenantUsers();
        user.setId(UUID.randomUUID());
        user.setTenantId(tenantId);
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setCreatedDate(now);
        user.setLastModifiedDate(now);

        TenantUsers created = tenantUserRepository.create(principal, user);
        return TenantUserResponse.fromEntity(created);
    }

    public TenantUserResponse getTenantUserById(UUID userId) {
        TenantUsers user = tenantUserRepository.findById(userId)
            .orElseThrow(() -> new TenantUserNotFoundException("Tenant user not found with id: " + userId));
        return TenantUserResponse.fromEntity(user);
    }

    public List<TenantUserResponse> getTenantUsersByTenantId(UUID tenantId) {
        // Verify tenant exists
        tenantRepository.findById(tenantId)
            .orElseThrow(() -> new TenantNotFoundException("Tenant not found with id: " + tenantId));

        return tenantUserRepository.findByTenantId(tenantId)
            .stream()
            .map(TenantUserResponse::fromEntity)
            .toList();
    }

    public List<TenantUserResponse> getAllTenantUsers() {
        return tenantUserRepository.findAll()
            .stream()
            .map(TenantUserResponse::fromEntity)
            .toList();
    }

    @Transactional
    public TenantUserResponse updateTenantUser(UUID userId, UpdateTenantUserRequest request) {
        TenantUsers existingUser = tenantUserRepository.findById(userId)
            .orElseThrow(() -> new TenantUserNotFoundException("Tenant user not found with id: " + userId));

        String firstName = request.firstName() != null ? request.firstName() : existingUser.getFirstName();
        String lastName = request.lastName() != null ? request.lastName() : existingUser.getLastName();

        TenantUsers updated = tenantUserRepository.update(userId, firstName, lastName)
            .orElseThrow(() -> new RuntimeException("Failed to update tenant user"));

        return TenantUserResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteTenantUser(UUID userId) {
        if (!tenantUserRepository.findById(userId).isPresent()) {
            throw new TenantUserNotFoundException("Tenant user not found with id: " + userId);
        }

        boolean deleted = tenantUserRepository.delete(userId);
        if (!deleted) {
            throw new RuntimeException("Failed to delete tenant user");
        }
    }

    public long countUsersByTenant(UUID tenantId) {
        return tenantUserRepository.countByTenantId(tenantId);
    }

    // Exception classes
    public static class TenantUserNotFoundException extends RuntimeException {
        public TenantUserNotFoundException(String message) {
            super(message);
        }
    }

    public static class TenantUserAlreadyExistsException extends RuntimeException {
        public TenantUserAlreadyExistsException(String message) {
            super(message);
        }
    }

    public static class TenantNotFoundException extends RuntimeException {
        public TenantNotFoundException(String message) {
            super(message);
        }
    }
}