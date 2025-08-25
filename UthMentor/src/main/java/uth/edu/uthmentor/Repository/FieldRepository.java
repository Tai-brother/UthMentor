package uth.edu.uthmentor.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uth.edu.uthmentor.Model.Field;

@Repository
public interface FieldRepository extends JpaRepository<Field, Long> {
    boolean existsByNameAndDescription(String name, String description);
}
