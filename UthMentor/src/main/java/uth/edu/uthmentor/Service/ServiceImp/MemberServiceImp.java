package uth.edu.uthmentor.Service.ServiceImp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uth.edu.uthmentor.Dto.MemberDto;
import uth.edu.uthmentor.Model.Member;
import uth.edu.uthmentor.Model.User;
import uth.edu.uthmentor.Repository.MemberRepository;
import uth.edu.uthmentor.Service.MemberService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberServiceImp implements MemberService {

    private final MemberRepository memberRepository;

    @Override
    public List<MemberDto> getAllMembers() {
        List<Member> membersDB = memberRepository.findAll();
        return membersDB.stream().map(this::memberToDto).collect(Collectors.toList());
    }

    @Override
    public MemberDto getMemberProfile(User user) {
        return memberToDto(user.getMember());
    }

    private MemberDto memberToDto(Member member) {
        return new MemberDto(member.getFirstName(), member.getLastName(), member.getEmail(), member.getUsername(), member.getPhoneNumber(), member.getAddress(), member.getDob());
    }

}
