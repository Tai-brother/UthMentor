package uth.edu.uthmentor.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uth.edu.uthmentor.Model.Mentor;
import uth.edu.uthmentor.Model.User;

import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<Mentor, Long> {
    boolean existsByUserId(Long id);

    @Query("SELECT d FROM Mentor d " +
            "WHERE (:name IS NULL OR LOWER(d.fullName) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:field IS NULL OR LOWER(d.field.name) LIKE LOWER(CONCAT('%', :field, '%')))")
    Page<Mentor> searchMentors(@Param(value = "name") String name, @Param(value = "field") String field, Pageable pageable);

    Optional<Mentor> findByUser(User user);
}
