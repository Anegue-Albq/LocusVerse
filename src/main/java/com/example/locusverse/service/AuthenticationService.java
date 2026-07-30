package com.example.locusverse.service;

import com.example.locusverse.config.TokenProvider;
import com.example.locusverse.database.model.RolesEntity;
import com.example.locusverse.database.model.UsuarioEntity;
import com.example.locusverse.database.repository.IRolesRepository;
import com.example.locusverse.database.repository.IUsuarioRepository;
import com.example.locusverse.dto.LoginRequestDto;
import com.example.locusverse.dto.RegisterRequestDto;
import com.example.locusverse.dto.TokenResponseDto;
import com.example.locusverse.enums.RoleTypeEnum;
import com.example.locusverse.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IUsuarioRepository usuarioRepository;
    private final IRolesRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    @Value("${JWT_EXPIRATION:900000}")
    private Long expirationTime;

    public void register(RegisterRequestDto dto) throws BadRequestException {
        Optional<UsuarioEntity> usuario = usuarioRepository.findByEmail(dto.email());

        if (usuario.isPresent()) {
            throw new BadRequestException("Usuário já cadastrado com este e-mail");
        }

        RolesEntity role = rolesRepository.findByNome(RoleTypeEnum.ROLE_CLIENTE.name())
                .orElseGet(() -> rolesRepository.save(RolesEntity.builder()
                        .nome(RoleTypeEnum.ROLE_CLIENTE.name())
                        .build())
                );

        usuarioRepository.save(UsuarioEntity.builder()
                .nome(dto.nome())
                .email(dto.email())
                .roles(Set.of(role))
                .senha(passwordEncoder.encode(dto.senha()))
                .build()
        );
    }


    public TokenResponseDto login(LoginRequestDto dto) throws Exception {
        try{
            // Authentication provider -> userDetailsService -> passwordEncoder.matcher() -> authenticated
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                dto.email(), dto.senha()
            ));
            String token = tokenProvider.generateToken(authentication);

            return new TokenResponseDto(token, expirationTime);
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Credenciais inválidas");
        }
    }
}
