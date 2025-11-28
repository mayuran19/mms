package com.mayuran19.mms.platform.tenant;

import com.mayuran19.mms.platform.tenant.dto.CreateTenantUserRequest;
import com.mayuran19.mms.platform.tenant.dto.TenantUserResponse;
import com.mayuran19.mms.platform.tenant.dto.UpdateTenantUserRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/platform/tenants/{tenantId}/users")
@PreAuthorize("hasRole('PLATFORM_USER')")
public class TenantUserController {

    private final TenantUserService tenantUserService;

    public TenantUserController(TenantUserService tenantUserService) {
        this.tenantUserService = tenantUserService;
    }

    @PostMapping
    public ResponseEntity<TenantUserResponse> createTenantUser(
        @PathVariable UUID tenantId,
        @Valid @RequestBody CreateTenantUserRequest request
    ) {
        TenantUserResponse response = tenantUserService.createTenantUser(tenantId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TenantUserResponse>> getTenantUsers(@PathVariable UUID tenantId) {
        List<TenantUserResponse> users = tenantUserService.getTenantUsersByTenantId(tenantId);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<TenantUserResponse> getTenantUserById(@PathVariable UUID userId) {
        TenantUserResponse response = tenantUserService.getTenantUserById(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<TenantUserResponse> updateTenantUser(
        @PathVariable UUID tenantId,
        @PathVariable UUID userId,
        @Valid @RequestBody UpdateTenantUserRequest request
    ) {
        TenantUserResponse response = tenantUserService.updateTenantUser(userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteTenantUser(
        @PathVariable UUID tenantId,
        @PathVariable UUID userId
    ) {
        tenantUserService.deleteTenantUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countTenantUsers(@PathVariable UUID tenantId) {
        long count = tenantUserService.countUsersByTenant(tenantId);
        return ResponseEntity.ok(count);
    }

    @ExceptionHandler(TenantUserService.TenantUserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleTenantUserNotFound(TenantUserService.TenantUserNotFoundException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(TenantUserService.TenantUserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleTenantUserAlreadyExists(TenantUserService.TenantUserAlreadyExistsException ex) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(TenantUserService.TenantNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleTenantNotFound(TenantUserService.TenantNotFoundException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }

    public record ErrorResponse(String message) {}
}