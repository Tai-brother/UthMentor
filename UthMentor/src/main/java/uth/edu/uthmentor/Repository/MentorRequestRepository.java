package uth.edu.uthmentor.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uth.edu.uthmentor.Model.MentorRequest;

@Repository
public interface MentorRequestRepository extends JpaRepository<MentorRequest, Long> {
}
