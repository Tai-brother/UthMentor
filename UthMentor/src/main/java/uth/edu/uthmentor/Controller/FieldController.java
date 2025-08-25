package uth.edu.uthmentor.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uth.edu.uthmentor.Model.Field;
import uth.edu.uthmentor.Service.FieldService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/field")

public class FieldController {

    private final FieldService fieldService;

    @PostMapping("/createField")
    public ResponseEntity<Field> createField(@RequestParam String name, @RequestParam String description){
        return ResponseEntity.status(HttpStatus.CREATED).body(fieldService.createField(name, description));
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<Field>> getAll() {
        return ResponseEntity.ok(fieldService.getAll());
    }

}
