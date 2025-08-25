package uth.edu.uthmentor.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private String firstName;

    private String lastName;

    private String username;

    private Date dob;

    private String email;

    private String password;

    private String phoneNumber;

    private String address;

}
