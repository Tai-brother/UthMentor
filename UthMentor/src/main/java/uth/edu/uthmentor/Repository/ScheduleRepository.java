package uth.edu.uthmentor.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uth.edu.uthmentor.Model.Schedule;
import uth.edu.uthmentor.Model.Mentor;

import java.time.DayOfWeek;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    Optional<Schedule> findByMentor(Mentor mentor);
    Optional<Schedule> findByMentorAndDaysOfWeekContaining(Mentor mentor, DayOfWeek dayOfWeek);
}
