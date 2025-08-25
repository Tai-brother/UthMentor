package uth.edu.uthmentor.Service.ServiceImp;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uth.edu.uthmentor.Dto.UserDto;
import uth.edu.uthmentor.Exception.DuplicateUserException;
import uth.edu.uthmentor.Model.Role;
import uth.edu.uthmentor.Model.User;
import uth.edu.uthmentor.Repository.UserRepository;
import uth.edu.uthmentor.Service.UserService;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public User register(UserDto userDto) {
        // Check if username already exists
        if (userRepository.findByUsernameIgnoreCase(userDto.getUsername()).isPresent()) {
            throw new DuplicateUserException("Username already exists: " + userDto.getUsername());
        }
        
        // Check if email already exists
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new DuplicateUserException("Email already exists: " + userDto.getEmail());
        }
        
        User user = mapToUser(userDto);
        return userRepository.save(user);
    }

    @Override
    public Map<String, Object> authenticateUser(UserDto userDto) {
        Map<String, Object> authenticatedUser = new HashMap<>();
        User user =(User) userDetailsService.loadUserByUsername(userDto.getUsername());
        if(user == null){
            throw new UsernameNotFoundException("User not found");
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword()));
        authenticatedUser.put("token", jwtService.generateToken(userDto.getUsername()));
        authenticatedUser.put("user", user);
        return authenticatedUser;
    }

    

    private User mapToUser(UserDto userDto) {
        return User.builder()
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .username(userDto.getUsername())
                .address(userDto.getAddress())
                .dob(userDto.getDob())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .phoneNumber(userDto.getPhoneNumber())
                .role(Role.USER)
                .build();
    }

}
