package uth.edu.uthmentor.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewDto {

    @NotBlank
    private String comment;

    @NotNull
    private Integer rating;

    @NotNull
    private Long mentorId;

    private java.util.Date createdAt;

    private String memberName;

}
