package uth.edu.uthmentor.Dto;

import lombok.*;

import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorRequestDto {
    private Long id;

    private String status;



    private List<String> daysOfWeek;

    private Long fieldId;
    
    // Thông tin đầy đủ của field và user
    private FieldInfoDto field;
    private UserInfoDto user;

    private LocalTime startTime;

    private LocalTime endTime;

    private Double fee;

    private String description;
    
    private LocalDateTime createdAt;
}
