package uth.edu.uthmentor.Service;

import org.springframework.web.multipart.MultipartFile;
import uth.edu.uthmentor.Dto.MentorRequestDto;
import uth.edu.uthmentor.Model.User;

import java.util.List;

public interface MentorRequestService {
    MentorRequestDto createMentorRequest(MentorRequestDto mentorRequestDto, User user, MultipartFile file);

    List<MentorRequestDto> getAllMentorRequests();
}
