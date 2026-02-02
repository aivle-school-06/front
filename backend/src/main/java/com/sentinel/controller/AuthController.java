package com.sentinel.controller;

import com.sentinel.common.ApiResponse;
import com.sentinel.dto.request.LoginRequest;
import com.sentinel.dto.request.SignupRequest;
import com.sentinel.dto.response.AuthResponse;
import com.sentinel.dto.response.UserResponse;
import com.sentinel.security.UserPrincipal;
import com.sentinel.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Authentication API")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "회원가입")
    @PostMapping("/signup")
    public ApiResponse<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ApiResponse.success(authService.signup(request));
    }

    @Operation(summary = "로그인")
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    @Operation(summary = "내 정보 조회")
    @GetMapping("/me")
    public ApiResponse<UserResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(authService.me(principal));
    }
}
