package com.danielfreitassc.backend.infra.security;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfigurations {
    private final SecurityFilter securityFilter;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(customAuthenticationEntryPoint)
                    .accessDeniedHandler(customAccessDeniedHandler)
                )
                .authorizeHttpRequests(authorize -> authorize

                .requestMatchers(HttpMethod.POST,"/users").permitAll()
                .requestMatchers(HttpMethod.GET,"/users").hasAnyRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH,"/users/{id}/activate").hasAnyRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/users/inactives").hasAnyRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/users/{id}").hasAnyRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH,"/users/{id}").hasAnyRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/users/{id}").hasAnyRole("ADMIN")
                

                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                
                .requestMatchers("/error").anonymous()
                .anyRequest().denyAll()

                ).addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class).build();
    }

    @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            return new CorsConfigurationSource() {
                @Override
                public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                    CorsConfiguration configuration = new CorsConfiguration();
                    configuration.setAllowCredentials(true);

                    List<String> fixedAllowedOrigins = Arrays.asList(
                    "http://localhost:19000",
                        "http://localhost:19002",
                        "http://localhost:3000"
                    );
                    
                    String baseDomain = ".nextsyntax.com"; 

                    String originHeader = request.getHeader("Origin");
                    log.debug(">>> CORS - Origin Header recebido: {}", originHeader);

                    if (originHeader != null) {
                        if (fixedAllowedOrigins.contains(originHeader)) {
                            configuration.setAllowedOrigins(Collections.singletonList(originHeader));
                            log.debug(">>> CORS - Origin '{}' permitido por lista fixa.", originHeader);
                        } 
                        else if (originHeader.endsWith(baseDomain) || originHeader.endsWith(baseDomain + ":3000")) {
                            configuration.setAllowedOrigins(Collections.singletonList(originHeader));
                            log.debug(">>> CORS - Origin '{}' permitido por padrão de subdomínio.", originHeader);
                        } else {
                            configuration.setAllowedOrigins(Collections.emptyList()); 
                            log.warn(">>> CORS - Origin '{}' NÃO permitido por nenhuma regra.", originHeader);
                        }
                    } else {
                        configuration.setAllowedOrigins(Collections.emptyList()); 
                        log.warn(">>> CORS - Cabeçalho Origin ausente. Requisição será rejeitada por CORS.");
                    }

                    configuration.setAllowedMethods(Arrays.asList(
                        HttpMethod.POST.name(), 
                        HttpMethod.GET.name(), 
                        HttpMethod.PUT.name(), 
                        HttpMethod.PATCH.name(), 
                        HttpMethod.DELETE.name(),
                        HttpMethod.OPTIONS.name() 
                    ));
                    configuration.setAllowedHeaders(Collections.singletonList("*")); 
                    configuration.setMaxAge(3600L); 

                    return configuration;
                }
            };
        }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
