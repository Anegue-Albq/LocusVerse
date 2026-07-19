package com.example.locusverse.controller;

import com.example.locusverse.dto.LoginRequestDto;
import com.example.locusverse.dto.RegisterRequestDto;
import com.example.locusverse.dto.TokenResponseDto;
import com.example.locusverse.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public void register(@RequestBody @Valid RegisterRequestDto dto) throws Exception {
        authenticationService.register(dto);
    }

    @PostMapping("/login")
    public TokenResponseDto login(@RequestBody @Valid LoginRequestDto dto) throws Exception {
        return authenticationService.login(dto);
    }
}
