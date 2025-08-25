package uth.edu.uthmentor.Service;

import uth.edu.uthmentor.Dto.ReviewDto;
import uth.edu.uthmentor.Model.User;

import java.util.List;

public interface ReviewService {
    String evaluateMen(User user, ReviewDto reviewDto);

    List<ReviewDto> getAllById(Long mentorId);
}
