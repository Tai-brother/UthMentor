package uth.edu.uthmentor.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uth.edu.uthmentor.Model.Field;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MentorDto {
    private Long id;

    private String fullName;

    private Field field;

    private String fieldName;

    private String email;

    private String imageUrl;

    private Double fee;

    private String description;

    private String role;

    private Double rating;

    private String phoneNumber;

    private java.util.Date dob;

    private String firstName;
    private String lastName;
    private String address;
    
    // Thêm thông tin schedule
    private LocalTime startTime;
    private LocalTime endTime;
    private Set<DayOfWeek> daysOfWeek;
}
