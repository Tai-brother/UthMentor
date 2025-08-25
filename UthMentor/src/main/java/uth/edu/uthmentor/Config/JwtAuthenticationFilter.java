package uth.edu.uthmentor.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import uth.edu.uthmentor.Service.ServiceImp.JwtService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        // Allow public endpoints without authentication
        if(path.startsWith("/user/register") || path.startsWith("/user/login")){
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = request.getHeader("Authorization");

        // Check if Authorization header exists and has proper format
        if(jwtToken == null || jwtToken.isEmpty() || !jwtToken.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extract token (remove "Bearer " prefix)
            jwtToken = jwtToken.substring(7);

            // Check if token is not empty after removing prefix
            if(jwtToken.isEmpty() || jwtToken.trim().isEmpty()){
                filterChain.doFilter(request, response);
                return;
            }

            // Validate token
            if(!jwtService.isTokenValid(jwtToken)){
                filterChain.doFilter(request, response);
                return;
            }

            // Load user and set authentication
            var user = userDetailsService.loadUserByUsername(jwtService.extractSubject(jwtToken));
            if(SecurityContextHolder.getContext().getAuthentication() == null) {
                var authenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authenticationToken.setDetails(request);
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        } catch (Exception e) {
            // Log the error but don't throw it to prevent breaking the application
            System.err.println("JWT Token validation error: " + e.getMessage());
            // Continue with the filter chain without authentication
        }

        filterChain.doFilter(request, response);
    }
}
