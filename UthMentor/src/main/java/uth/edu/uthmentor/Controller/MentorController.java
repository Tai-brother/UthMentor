package uth.edu.uthmentor.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uth.edu.uthmentor.Dto.MentorDecisionDto;
import uth.edu.uthmentor.Dto.MentorDto;
import uth.edu.uthmentor.Dto.MentorRequestDto;
import uth.edu.uthmentor.Model.User;
import uth.edu.uthmentor.Service.MentorRequestService;
import uth.edu.uthmentor.Service.MentorService;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mentor")

public class MentorController {

    private final MentorService mentorService;
    private final MentorRequestService mentorRequestService;

    @PostMapping("/request")
    public ResponseEntity<MentorRequestDto> createMentorRequest(
            @RequestParam List<String> daysOfWeek,
            @RequestParam Long fieldId,
            @RequestParam String startTime,
            @RequestParam String endTime,
            @RequestParam Double fee,
            @RequestParam String description,
            @RequestParam MultipartFile file,
            Authentication authentication){

        User user = (User) authentication.getPrincipal();

        MentorRequestDto mentorRequestDto = MentorRequestDto.builder()
                .daysOfWeek(daysOfWeek)
                .fieldId(fieldId)
                .fee(fee)
                .description(description)
                .startTime(LocalTime.parse(startTime.replace("\"", "")))
                .endTime(LocalTime.parse(endTime.replace("\"", "")))
                .build();

        return ResponseEntity.ok(mentorRequestService.createMentorRequest(mentorRequestDto, user, file));
    }

    @GetMapping("/get-all-requests")
    public ResponseEntity<List<MentorRequestDto>> getAllMentorRequests(){
        return ResponseEntity.status(HttpStatus.OK).body(mentorRequestService.getAllMentorRequests());
    }

    @PutMapping("/decide-request")
    public ResponseEntity<String> decideMentorRequest(@RequestBody MentorDecisionDto decisionDto){
        return ResponseEntity.ok(mentorService.decideMentorRequest(decisionDto));
    }

    @PutMapping("/update/{mentorId}")
    public ResponseEntity<String> updateMentor(@RequestBody MentorRequestDto mentorRequestDto, @PathVariable(name = "mentorId") Long mentorId){
        return ResponseEntity.ok(mentorService.updateMentor(mentorId, mentorRequestDto));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MentorDto>> findByMentorNameOrField(@RequestParam(required = false) String name, @RequestParam(required = false) String field, @RequestParam(defaultValue = "0") String page){
        return ResponseEntity.ok(mentorService.findByMentorNameOrField(name, field, page));
    }

    @GetMapping("/me")
    public ResponseEntity<MentorDto> getMentorProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(mentorService.getMentorProfile(user));
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<MentorDto>> getAllMentor(){
        return ResponseEntity.ok(mentorService.getAllMentor());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MentorDto> getMentorById(@PathVariable Long id) {
        return ResponseEntity.ok(mentorService.getMentorById(id));
    }

}
