package com.sentinel.security;

import com.sentinel.common.CustomException;
import com.sentinel.common.ErrorCode;
import com.sentinel.domain.User;
import com.sentinel.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND, "User not found"));
        return new UserPrincipal(user);
    }
}
