package uth.edu.uthmentor.Dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uth.edu.uthmentor.Model.PaymentMethod;
import uth.edu.uthmentor.Model.Status;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {

    private Long id;
    private Long memberId;
    private Long mentorId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String note;
    private Status status;

    // Member information
    private String memberName;
    private String memberPhone;
    private String memberEmail;
    private Integer memberAge;

    // Mentor information
    private String mentorName;
    private String fieldName;

    // Appointment details
    private String reason;
    private Boolean hasReview;

    @NotNull
    private PaymentMethod paymentMethod;

}
