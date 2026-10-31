package com.smartplanner.controller;

import com.smartplanner.dto.AuthRequest;
import com.smartplanner.dto.AuthResponse;
import com.smartplanner.dto.RegisterRequest;
import com.smartplanner.model.User;
import com.smartplanner.repository.UserRepository;
import com.smartplanner.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            String jwt = tokenProvider.generateToken(authentication);
            User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole(),
                    user.getMonthlyIncome(),
                    user.getFinancialGoalPref(),
                    user.getThemePreference()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password credentials."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email address is already registered!"));
        }

        User user = new User(
                registerRequest.getName(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                "ROLE_USER",
                registerRequest.getMonthlyIncome(),
                registerRequest.getFinancialGoalPref()
        );

        userRepository.save(user);

        String jwt = tokenProvider.generateTokenForEmail(user.getEmail());

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getMonthlyIncome(),
                user.getFinancialGoalPref(),
                user.getThemePreference()
        ));
    }
}
