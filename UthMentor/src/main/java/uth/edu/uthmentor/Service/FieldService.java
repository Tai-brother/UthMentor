package uth.edu.uthmentor.Service;

import uth.edu.uthmentor.Model.Field;

import java.util.List;

public interface FieldService {
    Field createField(String name, String description);

    List<Field> getAll();
}
