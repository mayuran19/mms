package com.mayuran19.mms.platform.tenant;

import com.mayuran19.mms.jooq.tables.pojos.Tenants;
import com.mayuran19.mms.platform.tenant.dto.CreateTenantRequest;
import com.mayuran19.mms.platform.tenant.dto.TenantResponse;
import com.mayuran19.mms.platform.tenant.dto.UpdateTenantRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    @Transactional
    public TenantResponse createTenant(CreateTenantRequest request, UUID currentUserId) {
        if (tenantRepository.existsBySlug(request.slug())) {
            throw new TenantAlreadyExistsException("Tenant with slug '" + request.slug() + "' already exists");
        }

        OffsetDateTime now = OffsetDateTime.now();

        Tenants tenant = new Tenants();
        tenant.setId(UUID.randomUUID());
        tenant.setName(request.name());
        tenant.setSlug(request.slug());
        tenant.setStatus(request.status());
        tenant.setCreatedBy(currentUserId);
        tenant.setCreatedDate(now);
        tenant.setLastModifiedBy(currentUserId);
        tenant.setLastModifiedDate(now);

        Tenants created = tenantRepository.create(tenant);
        return TenantResponse.fromEntity(created);
    }

    public TenantResponse getTenantById(UUID id) {
        Tenants tenant = tenantRepository.findById(id)
            .orElseThrow(() -> new TenantNotFoundException("Tenant not found with id: " + id));
        return TenantResponse.fromEntity(tenant);
    }

    public TenantResponse getTenantBySlug(String slug) {
        Tenants tenant = tenantRepository.findBySlug(slug)
            .orElseThrow(() -> new TenantNotFoundException("Tenant not found with slug: " + slug));
        return TenantResponse.fromEntity(tenant);
    }

    public List<TenantResponse> getAllTenants() {
        return tenantRepository.findAll()
            .stream()
            .map(TenantResponse::fromEntity)
            .toList();
    }

    public List<TenantResponse> getTenantsByStatus(String status) {
        return tenantRepository.findByStatus(status)
            .stream()
            .map(TenantResponse::fromEntity)
            .toList();
    }

    @Transactional
    public TenantResponse updateTenant(UUID id, UpdateTenantRequest request, UUID currentUserId) {
        Tenants existingTenant = tenantRepository.findById(id)
            .orElseThrow(() -> new TenantNotFoundException("Tenant not found with id: " + id));

        String name = request.name() != null ? request.name() : existingTenant.getName();
        String status = request.status() != null ? request.status() : existingTenant.getStatus();

        Tenants updated = tenantRepository.update(id, name, status, currentUserId)
            .orElseThrow(() -> new RuntimeException("Failed to update tenant"));

        return TenantResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteTenant(UUID id) {
        if (!tenantRepository.findById(id).isPresent()) {
            throw new TenantNotFoundException("Tenant not found with id: " + id);
        }

        boolean deleted = tenantRepository.delete(id);
        if (!deleted) {
            throw new RuntimeException("Failed to delete tenant");
        }
    }


    public static class TenantNotFoundException extends RuntimeException {
        public TenantNotFoundException(String message) {
            super(message);
        }
    }

    public static class TenantAlreadyExistsException extends RuntimeException {
        public TenantAlreadyExistsException(String message) {
            super(message);
        }
    }
}