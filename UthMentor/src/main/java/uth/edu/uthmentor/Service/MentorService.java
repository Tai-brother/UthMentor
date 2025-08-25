package uth.edu.uthmentor.Service;

import uth.edu.uthmentor.Dto.MentorDecisionDto;
import uth.edu.uthmentor.Dto.MentorDto;
import uth.edu.uthmentor.Dto.MentorRequestDto;
import uth.edu.uthmentor.Model.User;

import java.util.List;

public interface MentorService {
    String decideMentorRequest(MentorDecisionDto decisionDto);

    String updateMentor(Long mentorId, MentorRequestDto mentorRequestDto);

    List<MentorDto> findByMentorNameOrField(String name, String field, String page);

    MentorDto getMentorProfile(User user);

    MentorDto getMentorById(Long id);

    List<MentorDto> getAllMentor();
}
