package uth.edu.uthmentor.Dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfoDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}


