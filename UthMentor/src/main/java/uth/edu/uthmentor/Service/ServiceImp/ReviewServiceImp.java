package uth.edu.uthmentor.Service.ServiceImp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uth.edu.uthmentor.Dto.ReviewDto;
import uth.edu.uthmentor.Model.*;
import uth.edu.uthmentor.Repository.MemberRepository;
import uth.edu.uthmentor.Repository.MentorRepository;
import uth.edu.uthmentor.Repository.ReviewRepository;
import uth.edu.uthmentor.Service.ReviewService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImp implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final MentorRepository mentorRepository;
    private final MemberRepository memberRepository;

    @Override
    public String evaluateMen(User user, ReviewDto reviewDto) {
        if(!user.getRole().equals(Role.MEMBER)){
            throw new IllegalArgumentException("Only members can submit reviews");
        }

        Mentor menDB = mentorRepository.findById(reviewDto.getMentorId()).orElseThrow(() -> new IllegalArgumentException("Mentor not found"));
        Member memberDB = user.getMember();

        Review review = mapToReview(reviewDto, memberDB, menDB);
        reviewRepository.save(review);

        return "Review submitted successfully";
    }

    private Review mapToReview(ReviewDto reviewDto, Member memberDB, Mentor menDB) {
        return Review.builder()
                .comment(reviewDto.getComment())
                .rating(reviewDto.getRating())
                .member(memberDB)
                .mentor(menDB)
                .build();
    }

    @Override
    public List<ReviewDto> getAllById(Long mentorId) {
        Mentor menDB = mentorRepository.findById(mentorId).orElseThrow(() -> new IllegalArgumentException("Mentor not found"));

        List<Review> reviews = menDB.getReviews();

        return reviews.stream()
                .map(this::mapToReviewDto)
                .collect(Collectors.toList());
    }

    private ReviewDto mapToReviewDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setComment(review.getComment());
        dto.setRating(review.getRating());
        dto.setMentorId(review.getMentor().getId());
        dto.setCreatedAt(java.sql.Timestamp.valueOf(review.getCreatedAt()));
        dto.setMemberName(review.getMember().getFirstName() + " " + review.getMember().getLastName());
        return dto;
    }

}
