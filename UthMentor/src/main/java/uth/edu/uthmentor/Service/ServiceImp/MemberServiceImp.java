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
    public String updateMember(User user, Long memberId, MemberDto memberDto) {
        Member memberDB = memberRepository.findById(memberId).orElseThrow(()-> new IllegalArgumentException("Member can not found with this id " + memberId));
        if(!user.getRole().name().equals("ADMIN") && !user.getMember().getId().equals(memberDB.getId())){
            throw new RuntimeException("You don't have permission to update other information");
        }
        memberDB.setFirstName(memberDto.getFirstName());
        memberDB.setLastName(memberDto.getLastName());
        memberDB.setEmail(memberDto.getEmail());
        memberDB.setUsername(memberDto.getUsername());
        memberDB.setPhoneNumber(memberDto.getPhoneNumber());
        memberDB.setAddress(memberDto.getAddress());
        memberDB.setDob(memberDto.getDob());

        memberRepository.save(memberDB);
        return "Update Member successfully";
    }

    @Override
    public String deleteMember(Long memberId) {
        Member memberDB = memberRepository.findById(memberId).orElseThrow(()-> new IllegalArgumentException("Can not found member with this id " + memberId));
        memberRepository.delete(memberDB);
        return "Delete member successfully";
    }

    @Override
    public MemberDto getMemberProfile(User user) {
        return memberToDto(user.getMember());
    }

    private MemberDto memberToDto(Member member) {
        return new MemberDto(member.getFirstName(), member.getLastName(), member.getEmail(), member.getUsername(), member.getPhoneNumber(), member.getAddress(), member.getDob());
    }

}
