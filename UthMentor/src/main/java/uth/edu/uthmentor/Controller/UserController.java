package uth.edu.uthmentor.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uth.edu.uthmentor.Dto.UserDto;
import uth.edu.uthmentor.Exception.DuplicateUserException;
import uth.edu.uthmentor.Model.User;
import uth.edu.uthmentor.Service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")

public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto){
        try {
            User user = userService.register(userDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (DuplicateUserException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto){
        var authenticatedUser = userService.authenticateUser(userDto);
        return ResponseEntity.ok(authenticatedUser);
    }


}
