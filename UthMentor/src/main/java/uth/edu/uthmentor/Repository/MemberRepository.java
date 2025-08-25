package uth.edu.uthmentor.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uth.edu.uthmentor.Model.Member;
import uth.edu.uthmentor.Model.User;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByUser(User user);

    @Query("SELECT p FROM Member p JOIN FETCH p.appointments WHERE p.user = :user")
    Optional<Member> findByUserWithAppointments(@Param("user") User user);
}
