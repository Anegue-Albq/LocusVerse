package com.example.locusverse.dto;

public record TokenResponseDto (
    String token,
    Long expiresIn) {
}
