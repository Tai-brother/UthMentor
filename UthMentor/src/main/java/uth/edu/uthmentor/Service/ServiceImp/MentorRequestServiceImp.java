package uth.edu.uthmentor.Service.ServiceImp;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import uth.edu.uthmentor.Dto.MentorRequestDto;
import uth.edu.uthmentor.Dto.UserInfoDto;
import uth.edu.uthmentor.Dto.FieldInfoDto;
import uth.edu.uthmentor.Model.*;
import uth.edu.uthmentor.Repository.FieldRepository;
import uth.edu.uthmentor.Repository.MentorRequestRepository;
import uth.edu.uthmentor.Service.MentorRequestService;

import java.io.IOException;
import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MentorRequestServiceImp implements MentorRequestService {

    private final FieldRepository fieldRepository;
    private final MentorRequestRepository mentorRequestRepository;
    private final Cloudinary cloudinary;

    @Override
    public MentorRequestDto createMentorRequest(MentorRequestDto mentorRequestDto, User user, MultipartFile file) {
        validateRequest(mentorRequestDto);



        Field field = fieldRepository.findById(mentorRequestDto.getFieldId()).orElseThrow(()-> new IllegalArgumentException("This Field not exist"));

        Set<DayOfWeek> days = mentorRequestDto.getDaysOfWeek()
                .stream()
                .map(String::toUpperCase)
                .map(DayOfWeek::valueOf)
                .collect(Collectors.toSet());

        String imageUrl = uploadFile(file);

        MentorRequest mentorRequest =  MentorRequest.builder()
                .startTime(mentorRequestDto.getStartTime())
                .endTime(mentorRequestDto.getEndTime())
                .status(Status.PENDING)
                .user(user)
                .field(field)
                .daysOfWeek(days)
                .fee(mentorRequestDto.getFee())
                .description(mentorRequestDto.getDescription())
                .imageUrl(imageUrl)
                .build();

        MentorRequest savedMenRequest = mentorRequestRepository.save(mentorRequest);

        mentorRequestDto.setStatus(savedMenRequest.getStatus().name());
        mentorRequestDto.setId(savedMenRequest.getId());
        return mentorRequestDto;
    }

    @Override
    public List<MentorRequestDto> getAllMentorRequests() {
        List<MentorRequest> mentorRequests = mentorRequestRepository.findAll();
        List<MentorRequestDto> mentorRequestDtos = mentorRequests.stream().map(this::menRequestToDto).collect(Collectors.toList());
        return mentorRequestDtos;
    }

    public void validateRequest(MentorRequestDto mentorRequestDto){

        for(String day : mentorRequestDto.getDaysOfWeek()){
            try {
                DayOfWeek.valueOf(day.toUpperCase());
            }catch (IllegalArgumentException e){
                throw new IllegalArgumentException("Invalid day of week: " + day);
            }
        }

        if(mentorRequestDto.getStartTime() == null || mentorRequestDto.getEndTime() == null){
            throw new IllegalArgumentException("Start time and end time cannot be null");
        }

        if(mentorRequestDto.getStartTime().isAfter(mentorRequestDto.getEndTime())){
            throw new IllegalArgumentException("Start time must be before end time");
        }

        if(mentorRequestDto.getFee() == null  || mentorRequestDto.getFee() <= 100000){
            throw new IllegalArgumentException("Invalid fee");
        }
    }

    private String uploadFile(MultipartFile file){
        try{
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
            return uploadResult.get("secure_url").toString();
        }catch (IOException e){
            throw new RuntimeException("Lỗi khi upload file: " + e.getMessage());
        }
    }

    private MentorRequestDto menRequestToDto(MentorRequest mentorRequest){
        MentorRequestDto dto = new MentorRequestDto();
        dto.setId(mentorRequest.getId());
        dto.setStatus(mentorRequest.getStatus().name());
        dto.setDaysOfWeek(mentorRequest.getDaysOfWeek().stream().map(DayOfWeek::name).collect(Collectors.toList()));
        dto.setFieldId(mentorRequest.getField().getId());
        
        // Populate field info
        dto.setField(FieldInfoDto.builder()
                .id(mentorRequest.getField().getId())
                .name(mentorRequest.getField().getName())
                .description(mentorRequest.getField().getDescription())
                .build());
        
        // Populate user info
        dto.setUser(UserInfoDto.builder()
                .id(mentorRequest.getUser().getId())
                .firstName(mentorRequest.getUser().getFirstName())
                .lastName(mentorRequest.getUser().getLastName())
                .email(mentorRequest.getUser().getEmail())
                .build());
        
        dto.setStartTime(mentorRequest.getStartTime());
        dto.setEndTime(mentorRequest.getEndTime());
        dto.setFee(mentorRequest.getFee());
        dto.setDescription(mentorRequest.getDescription());
        dto.setCreatedAt(mentorRequest.getCreatedAt());
        return dto;
    }
}
