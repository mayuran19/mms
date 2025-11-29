package com.mayuran19.mms.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to inject the current tenant user principal into a controller method parameter.
 * The annotated parameter must be of type {@link TenantUserPrincipal}.
 *
 * <pre>
 * {@code
 * @GetMapping("/profile")
 * public ResponseEntity<UserProfile> getProfile(@CurrentTenantUser TenantUserPrincipal user) {
 *     // user.id() will contain the current tenant user's ID
 *     // user.tenantId() will contain the tenant ID
 *     return ResponseEntity.ok(userService.getProfile(user.id()));
 * }
 * }
 * </pre>
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentTenantUser {
}