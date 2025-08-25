package uth.edu.uthmentor.Service.ServiceImp;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import uth.edu.uthmentor.Dto.AppointmentDto;
import uth.edu.uthmentor.Model.*;
import uth.edu.uthmentor.Repository.*;
import uth.edu.uthmentor.Service.AppointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImp implements AppointmentService {

    private final MentorRepository mentorRepository;
    private final ScheduleRepository scheduleRepository;
    private final AppointmentRepository appointmentRepository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final ReviewRepository reviewRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public List<LocalTime> getAvailableSlots(Long mentorId, LocalDate date) {
        Mentor menDB = mentorRepository.findById(mentorId).orElseThrow(() -> new IllegalArgumentException("Mentor not found"));
        Schedule schedDB = scheduleRepository.findByMentorAndDaysOfWeekContaining(menDB, date.getDayOfWeek())
                .orElseThrow(() -> new IllegalArgumentException("No schedule found for mentor on " + date.getDayOfWeek()));

        List<LocalTime> availableSlots = new ArrayList<>();
        LocalTime startTime = schedDB.getStartTime();

        while (startTime.isBefore(schedDB.getEndTime().minusMinutes(30))) {
            boolean bookedAppoint = appointmentRepository.existsByMentorAndAppointmentDateAndAppointmentTime(menDB, date, startTime);

            if (!bookedAppoint) {
                availableSlots.add(startTime);
            }
            startTime = startTime.plusMinutes(30);
        }
        return availableSlots;
    }

    @Override
    public AppointmentDto bookAppointment(AppointmentDto appointmentDto, User user) {
        if (!user.getRole().equals("MEMBER")) {
            if (user.getRole().equals("ADMIN") || user.getRole().equals("MENTOR")) {
                throw new RuntimeException("Access denied");
            }
        }

        Member memberDB = memberRepository.findByUser(user);
        if (memberDB == null) {
            memberDB = mapToMember(user);
            memberRepository.save(memberDB);
            user.setRole(Role.MEMBER);
            userRepository.save(user);
        }

        Mentor menDB = mentorRepository.findById(appointmentDto.getMentorId()).orElseThrow(() -> new IllegalArgumentException("Mentor not found"));

        boolean booked = appointmentRepository.existsByMentorAndAppointmentDateAndAppointmentTime(
                menDB, appointmentDto.getAppointmentDate(), appointmentDto.getAppointmentTime());

        if (booked) {
            throw new RuntimeException("This slot has been booked");
        }

        PaymentMethod paymentMethod = PaymentMethod.valueOf(appointmentDto.getPaymentMethod().name().toUpperCase());

        Appointment appointment = mapToAppointment(appointmentDto, menDB, memberDB, paymentMethod);
        Appointment saved = appointmentRepository.save(appointment);

        String VNPayUrl = createVnPayUrl(saved);

        sendEmail(memberDB.getEmail(), appointment, VNPayUrl);

        return mapToAppointmentDto(saved);
    }

    @Override
    public List<AppointmentDto> getAllByMen(User user) {
        if (!user.getRole().equals(Role.MENTOR)) {
            throw new RuntimeException("You are not a mentor");
        }

        Mentor menDB = mentorRepository.findByUser(user).orElseThrow(() -> new IllegalArgumentException("Mentor not found"));
        List<Appointment> appointments = appointmentRepository.findAllByMentor(menDB);

        return appointments.stream().map(this::mapToAppointmentDto).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByUser(User user) {
        Member memberDB = memberRepository.findByUserWithAppointments(user).orElseThrow(() -> new RuntimeException("Member not found"));

        List<Appointment> appointments = memberDB.getAppointments();
        return appointments.stream().map(this::mapToAppointmentDto).collect(Collectors.toList());
    }

    @Override
    public String createVnPayUrl(Appointment appointment) {
        String baseUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        String returnUrl = "http://localhost:8080/api/payment/vnpay-return";

        return baseUrl
                + "?vnp_Amount=1000000"
                + "&vnp_TxnRef=" + appointment.getId()
                + "&vnp_OrderInfo=Thanh+toan+lich+hen"
                + "&vnp_ReturnUrl=" + returnUrl;
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
    }

    @Override
    public List<AppointmentDto> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream()
                .map(this::mapToAppointmentDto)
                .collect(Collectors.toList());
    }

    private Member mapToMember(User user) {
        return Member.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .address(user.getAddress())
                .user(user)
                .password(user.getPassword())
                .dob(user.getDob())
                .email(user.getEmail())
                .role(Role.MEMBER)
                .phoneNumber(user.getPhoneNumber())
                .build();
    }

    private Appointment mapToAppointment(AppointmentDto appointmentDto, Mentor menDB, Member memberDB, PaymentMethod paymentMethod) {
        return Appointment.builder()
                .appointmentDate(appointmentDto.getAppointmentDate())
                .appointmentTime(appointmentDto.getAppointmentTime())
                .mentor(menDB)
                .member(memberDB)
                .note(appointmentDto.getNote())
                .reason(appointmentDto.getReason())
                .status(Status.PENDING)
                .paymentMethod(paymentMethod)
                .build();
    }

    private AppointmentDto mapToAppointmentDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setMentorId(appointment.getMentor().getId());
        dto.setMemberId(appointment.getMember().getId());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setNote(appointment.getNote());
        dto.setReason(appointment.getReason());
        dto.setStatus(appointment.getStatus());
        dto.setPaymentMethod(appointment.getPaymentMethod());

        Member member = appointment.getMember();
        dto.setMemberName(member.getFirstName() + " " + member.getLastName());
        dto.setMemberPhone(member.getPhoneNumber() != null ? member.getPhoneNumber().toString() : "");
        dto.setMemberEmail(member.getEmail());

        if (member.getDob() != null) {
            java.time.LocalDate dobLocalDate = member.getDob().toInstant()
                    .atZone(java.time.ZoneId.systemDefault())
                    .toLocalDate();
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.Period period = java.time.Period.between(dobLocalDate, today);
            dto.setMemberAge(period.getYears());
        }

        Mentor mentor = appointment.getMentor();
        dto.setMentorName(mentor.getUser().getFirstName() + " " + mentor.getUser().getLastName());
        dto.setFieldName(mentor.getField() != null ? mentor.getField().getName() : "");

        boolean hasReview = reviewRepository.existsByMemberAndMentor(member, mentor);
        dto.setHasReview(hasReview);

        return dto;
    }

    public void sendEmail(String email, Appointment appointment, String paymentUrl) {
        String mentorName = appointment.getMentor().getUser().getFirstName() + " " +
                appointment.getMentor().getUser().getLastName();
        String date = appointment.getAppointmentDate().toString();
        String time = appointment.getAppointmentTime().toString();

        StringBuilder content = new StringBuilder();
        content.append("Dear Member,\n\n")
                .append("You have booked an appointment with:\n")
                .append("Mentor: ").append(mentorName).append("\n")
                .append("Date: ").append(date).append("\n")
                .append("Time: ").append(time).append("\n\n");

        if (appointment.getPaymentMethod() == PaymentMethod.ONLINE) {
            content.append("To complete your booking, please pay online via the link below:\n")
                    .append(paymentUrl).append("\n\n");
        } else {
            content.append("Please pay for our session on the day of your appointment.\n\n");
        }

        content.append("Thank you for choosing UthMentor.\nBest regards,\nUthMentor - GuideBook");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Appointment Confirmation - UthMentor");
        message.setText(content.toString());
        message.setFrom(fromEmail);

        mailSender.send(message);
    }
}
