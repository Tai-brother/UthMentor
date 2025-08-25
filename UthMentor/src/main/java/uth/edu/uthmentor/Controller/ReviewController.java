package uth.edu.uthmentor.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import uth.edu.uthmentor.Dto.ReviewDto;
import uth.edu.uthmentor.Model.User;
import uth.edu.uthmentor.Service.ReviewService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/evaluate")
    public ResponseEntity<String> evaluateMen(@RequestBody ReviewDto reviewDto, Authentication authentication){
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(reviewService.evaluateMen(user, reviewDto));
    }

    @GetMapping("/get-all/{mentorId}")
    public ResponseEntity<List<ReviewDto>> getAllById(@PathVariable Long mentorId){
        return ResponseEntity.ok(reviewService.getAllById(mentorId));
    }


}
