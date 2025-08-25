package uth.edu.uthmentor.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MemberDto {

    private String firstName;

    private String lastName;

    private String email;

    private String username;

    private String phoneNumber;

    private String address;

    private Date dob;

}
