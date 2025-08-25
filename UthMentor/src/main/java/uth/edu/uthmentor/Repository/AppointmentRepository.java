package uth.edu.uthmentor.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uth.edu.uthmentor.Model.Appointment;
import uth.edu.uthmentor.Model.Mentor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    boolean existsByMentorAndAppointmentDateAndAppointmentTime(Mentor menDB, LocalDate date, LocalTime startTime);

    List<Appointment> findAllByMentor(Mentor menDB);
}
