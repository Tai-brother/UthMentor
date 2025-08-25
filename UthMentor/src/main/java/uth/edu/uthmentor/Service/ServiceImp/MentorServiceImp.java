package uth.edu.uthmentor.Service.ServiceImp;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import uth.edu.uthmentor.Dto.MentorDecisionDto;
import uth.edu.uthmentor.Dto.MentorDto;
import uth.edu.uthmentor.Dto.MentorRequestDto;
import uth.edu.uthmentor.Model.*;
import uth.edu.uthmentor.Repository.*;
import uth.edu.uthmentor.Service.MentorService;

import java.time.DayOfWeek;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MentorServiceImp implements MentorService {

    private final MentorRequestRepository mentorRequestRepository;
    private final MentorRepository mentorRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final FieldRepository fieldRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public String decideMentorRequest(MentorDecisionDto decisionDto) {
        MentorRequest mentorRequest = mentorRequestRepository.findById(decisionDto.getMentorRequestId()).orElseThrow(()-> new RuntimeException("Can't find this mentor request"));
        Status seekStatus;
        try{
            seekStatus = Status.valueOf(decisionDto.getStatus());
        }catch (IllegalArgumentException e){
            throw new IllegalArgumentException("Invalid status");
        }

        if(seekStatus.equals(Status.APPROVED)){
            boolean checkExistedMen = mentorRepository.existsByUserId(mentorRequest.getUser().getId());
            if(checkExistedMen){
                throw new IllegalStateException("User is already a mentor");
            }

            Mentor createMentor = Mentor.builder()
                    .fullName(mentorRequest.getUser().getFirstName() + " "+mentorRequest.getUser().getLastName())
                    .role(Role.MENTOR)
                    .field(mentorRequest.getField())
                    .user(mentorRequest.getUser())
                    .fee(mentorRequest.getFee())
                    .description(mentorRequest.getDescription())
                    .imageUrl(mentorRequest.getImageUrl())
                    .build();
            mentorRepository.save(createMentor);

            mentorRequest.setStatus(Status.APPROVED);
            mentorRequestRepository.save(mentorRequest);

            User user = userRepository.findById(mentorRequest.getUser().getId()).orElseThrow();
            user.setRole(createMentor.getRole());
            userRepository.save(user);

            Schedule createSchedule = Schedule.builder()
                    .mentor(createMentor)
                    .daysOfWeek(new HashSet<>(mentorRequest.getDaysOfWeek()))
                    .startTime(mentorRequest.getStartTime())
                    .endTime(mentorRequest.getEndTime())
                    .build();

            scheduleRepository.save(createSchedule);
            return "Mentor request approved successfully";
        }
        else if(seekStatus == Status.PENDING){
            return "Mentor request is still pending";
        }
        else{
            mentorRequest.setStatus(Status.REJECTED);
            mentorRequestRepository.save(mentorRequest);
            return "Mentor request rejected.";
        }
    }

    @Override
    public String updateMentor(Long mentorId, MentorRequestDto mentorRequestDto) {
        Mentor menDB = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new IllegalArgumentException("Mentor with this id not found: " + mentorId));

        Field field = fieldRepository.findById(mentorRequestDto.getFieldId())
                .orElseThrow(() -> new RuntimeException("Field not found"));

        Schedule sche = scheduleRepository.findById(menDB.getId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));



        if (mentorRequestDto.getDaysOfWeek() != null) {
            Set<DayOfWeek> days = mentorRequestDto.getDaysOfWeek().stream()
                    .map(String::toUpperCase)
                    .map(day -> {
                        try {
                            return DayOfWeek.valueOf(day);
                        } catch (IllegalArgumentException e) {
                            throw new IllegalArgumentException("Invalid day of week: " + day);
                        }
                    })
                    .collect(Collectors.toSet());

            sche.setDaysOfWeek(days);
        }

        if (mentorRequestDto.getFieldId() != null) {
            menDB.setField(field);
        }

        if (mentorRequestDto.getStartTime() != null && mentorRequestDto.getEndTime() != null) {
            if (mentorRequestDto.getStartTime().isAfter(mentorRequestDto.getEndTime())) {
                throw new IllegalArgumentException("Start time must be before end time");
            }
            sche.setStartTime(mentorRequestDto.getStartTime());
            sche.setEndTime(mentorRequestDto.getEndTime());
        }

        mentorRepository.save(menDB);
        sche.setMentor(menDB);
        scheduleRepository.save(sche);

        return "Update mentor successfully";
    }

    @Override
    public List<MentorDto> findByMentorNameOrField(String name, String field, String page) {
        if(name != null && !name.trim().toLowerCase().isEmpty()){
            name = name.trim().toLowerCase();
        }else {
            name = null;
        }
        if(field != null && !field.trim().isEmpty()){
            field = field.trim();
        }else {
            field = null;
        }
        Pageable pageable = PageRequest.of(Integer.parseInt(page), 10, Sort.by("fullName").ascending());

        List<Mentor> mentors = mentorRepository.searchMentors(name, field, pageable).getContent();

        return mentors.stream().map(this::mapToMenDto).collect(Collectors.toList());
    }

    @Override
    public MentorDto getMentorProfile(User user) {
        return mapToMenDto(user.getMentor());
    }

    @Override
    public MentorDto getMentorById(Long id) {
        return mapToMenDto(mentorRepository.findById(id).orElseThrow(()-> new IllegalArgumentException("Mentor not found")));
    }

    @Override
    public List<MentorDto> getAllMentor() {
        List<Mentor> mensDB = mentorRepository.findAll();
        return mensDB.stream().map(this::mapToMenDto).collect(Collectors.toList());
    }

    private MentorDto mapToMenDto(Mentor mentor) {
        MentorDto dto = new MentorDto();
        dto.setId(mentor.getId());
        dto.setFullName(mentor.getFullName());
        dto.setFirstName(mentor.getUser().getFirstName());
        dto.setLastName(mentor.getUser().getLastName());
        dto.setField(mentor.getField());
        dto.setFieldName(mentor.getField() != null ? mentor.getField().getName() : null);
        dto.setEmail(mentor.getUser().getEmail());
        dto.setImageUrl(mentor.getImageUrl());
        dto.setFee(mentor.getFee());
        dto.setDescription(mentor.getDescription());
        dto.setAddress(mentor.getUser().getAddress());
        dto.setRole(mentor.getRole().name());
        Double avgRating = reviewRepository.findAverageRatingByMentorId(mentor.getId());
        dto.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        dto.setPhoneNumber(mentor.getUser().getPhoneNumber());
        dto.setDob(mentor.getUser().getDob());
        
        // Thêm thông tin schedule
        Schedule schedule = scheduleRepository.findByMentor(mentor).orElse(null);
        if (schedule != null) {
            dto.setStartTime(schedule.getStartTime());
            dto.setEndTime(schedule.getEndTime());
            dto.setDaysOfWeek(schedule.getDaysOfWeek());
        }
        
        return dto;
    }
}
