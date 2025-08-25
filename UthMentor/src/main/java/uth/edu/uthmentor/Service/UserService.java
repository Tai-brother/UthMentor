package uth.edu.uthmentor.Service;

import uth.edu.uthmentor.Dto.UserDto;
import uth.edu.uthmentor.Model.User;

import java.util.Map;

public interface UserService {
    User register(UserDto userDto);

    Map<String, Object> authenticateUser(UserDto userDto);



}
