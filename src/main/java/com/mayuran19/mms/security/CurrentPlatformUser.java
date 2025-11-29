package com.mayuran19.mms.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to inject the current platform user principal into a controller method parameter.
 * The annotated parameter must be of type {@link PlatformUserPrincipal}.
 *
 * <pre>
 * {@code
 * @GetMapping("/profile")
 * public ResponseEntity<UserProfile> getProfile(@CurrentPlatformUser PlatformUserPrincipal user) {
 *     // user.id() will contain the current platform user's ID
 *     return ResponseEntity.ok(userService.getProfile(user.id()));
 * }
 * }
 * </pre>
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentPlatformUser {
}