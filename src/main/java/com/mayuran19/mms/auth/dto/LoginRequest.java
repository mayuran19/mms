package com.mayuran19.mms.auth.dto;

public record LoginRequest(
        String username,
        String password
) {}