package uth.edu.uthmentor.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import uth.edu.uthmentor.Dto.MemberDto;
import uth.edu.uthmentor.Model.User;
import uth.edu.uthmentor.Service.MemberService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member")

public class MemberController {

    private final MemberService memberService;


    @GetMapping("/get-all")
    public ResponseEntity<List<MemberDto>> getAllMembers(){
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    @PutMapping("update/{memberId}")
    public ResponseEntity<String> updateMember(@PathVariable Long memberId, @RequestBody MemberDto memberDto, Authentication authentication){
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(memberService.updateMember(user ,memberId, memberDto));
    }

    @DeleteMapping("delete/{memberId}")
    public ResponseEntity<String> deleteMember(@PathVariable Long memberId){
        return ResponseEntity.ok(memberService.deleteMember(memberId));
    }

    @GetMapping("/me")
    public ResponseEntity<MemberDto> getMemberProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(memberService.getMemberProfile(user));
    }
}
