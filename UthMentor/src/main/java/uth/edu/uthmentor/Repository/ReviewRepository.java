package uth.edu.uthmentor.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uth.edu.uthmentor.Model.Member;
import uth.edu.uthmentor.Model.Mentor;
import uth.edu.uthmentor.Model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByMemberAndMentor(Member member, Mentor mentor);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.mentor.id = :mentorId")
    Double findAverageRatingByMentorId(@Param("mentorId") Long mentorId);
}
