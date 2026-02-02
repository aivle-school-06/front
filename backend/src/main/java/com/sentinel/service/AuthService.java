package com.sentinel.service;

import com.sentinel.common.CustomException;
import com.sentinel.common.ErrorCode;
import com.sentinel.domain.User;
import com.sentinel.domain.UserRole;
import com.sentinel.dto.request.LoginRequest;
import com.sentinel.dto.request.SignupRequest;
import com.sentinel.dto.response.AuthResponse;
import com.sentinel.dto.response.UserResponse;
import com.sentinel.repository.UserRepository;
import com.sentinel.security.JwtProvider;
import com.sentinel.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.INVALID_REQUEST, "Email already exists");
        }

        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .role(UserRole.USER)
            .build();

        return UserResponse.from(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtProvider.generateToken(user);
        return AuthResponse.builder()
            .accessToken(token)
            .tokenType("Bearer")
            .user(UserResponse.from(user))
            .build();
    }

    public UserResponse me(UserPrincipal principal) {
        return UserResponse.from(principal.getUser());
    }
}
