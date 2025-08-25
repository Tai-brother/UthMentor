package uth.edu.uthmentor.Model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
@Table(name = "mentor_request")
public class MentorRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalTime startTime;

    private LocalTime endTime;



    private String imageUrl;

    @ElementCollection(targetClass = DayOfWeek.class)
    @Enumerated(value = EnumType.STRING)
    private Set<DayOfWeek> daysOfWeek;

    @ManyToOne
    private Field field;

    @OneToOne
    private User user;

    @Enumerated(value = EnumType.STRING)
    private Status status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private Double fee;

    private String description;
}
