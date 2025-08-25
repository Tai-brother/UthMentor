package uth.edu.uthmentor.Service;

import uth.edu.uthmentor.Dto.MemberDto;
import uth.edu.uthmentor.Model.User;

import java.util.List;

public interface MemberService {
    List<MemberDto> getAllMembers();

    MemberDto getMemberProfile(User user);
}
