package uth.edu.uthmentor.Service.ServiceImp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uth.edu.uthmentor.Model.Field;
import uth.edu.uthmentor.Repository.FieldRepository;
import uth.edu.uthmentor.Service.FieldService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FieldServiceImp implements FieldService {

    private final FieldRepository fieldRepository;

    @Override
    public Field createField(String name, String description) {
        if(fieldRepository.existsByNameAndDescription(name,description)){
            throw new IllegalArgumentException("Field with this information already exists");
        }

        Field newField = Field.builder()
                .name(name)
                .description(description)
                .build();

        return fieldRepository.save(newField);
    }

    @Override
    public List<Field> getAll() {
        return fieldRepository.findAll();
    }
}
