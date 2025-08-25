package uth.edu.uthmentor.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth

                        // ko cần role
                        .requestMatchers(
                                "/user/register",
                                "/user/login",
                                "/mentor/search",
                                "/mentor/**",
                                "/field/get-all",
                                "/appointment/available-slots",
                                "/review/get-all/**",

                                "/mentor/get-all"
                        ).permitAll()

                        // role USER
                        .requestMatchers("/mentor/request").hasRole("USER")

                        // role ADMIN
                        .requestMatchers(
                                "/mentor/get-all-requests",
                                "/mentor/decide-request",
                                "/mentor/update/**",
                                "/field/createField",
                                "/member/delete/**"
                        ).hasRole("ADMIN")

                        // role MEMBER
                        .requestMatchers(
                                "/review/evaluate",
                                "/member/me",
                                "/appointment/me"
                        ).hasRole("MEMBER")

                        // role MENTOR
                        .requestMatchers("/mentor/me",
                                "/appointment/getBy-mentor" //getAllApointmentsByMen
                        ).hasRole("MENTOR")

                        // chung role
                        .requestMatchers("/member/update/**", "/appointment/update/**").hasAnyRole("ADMIN", "MEMBER", "MENTOR")
                        .requestMatchers("/appointment/book").hasAnyRole("USER", "MEMBER")
                        .requestMatchers("/member/get-all").hasAnyRole("ADMIN", "MENTOR")

                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
