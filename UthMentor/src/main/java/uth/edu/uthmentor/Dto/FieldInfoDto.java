package uth.edu.uthmentor.Dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FieldInfoDto {
    private Long id;
    private String name;
    private String description;
}


