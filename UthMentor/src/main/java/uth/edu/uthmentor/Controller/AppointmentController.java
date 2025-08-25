package uth.edu.uthmentor.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import uth.edu.uthmentor.Dto.AppointmentDto;
import uth.edu.uthmentor.Model.User;
import uth.edu.uthmentor.Service.AppointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/appointment")
@RequiredArgsConstructor

public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/available-slots")
    public ResponseEntity<List<LocalTime>> getAvailableSlots(@RequestParam Long mentorId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(mentorId, date));
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentDto appointmentDto, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        AppointmentDto saved = appointmentService.bookAppointment(appointmentDto, user);

        // Nếu là thanh toán ONLINE, trả về paymentUrl
        if (saved.getPaymentMethod() != null && saved.getPaymentMethod().name().equalsIgnoreCase("ONLINE")) {
            // Tạo lại link VNPAY (hoặc lấy từ service nếu đã tạo)
            String paymentUrl = appointmentService.createVnPayUrl(
                    appointmentService.getAppointmentById(saved.getId()) // Bạn cần có hàm này hoặc lấy Appointment từ repo
            );
            Map<String, Object> response = new HashMap<>();
            response.put("appointment", saved);
            response.put("paymentUrl", paymentUrl);
            response.put("user", user);
            return ResponseEntity.ok(response);
        }

        // Nếu là thanh toán tiền mặt, trả về appointment và user
        Map<String, Object> response = new HashMap<>();
        response.put("appointment", saved);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getBy-mentor")
    public ResponseEntity<List<AppointmentDto>> getAllByMen(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(appointmentService.getAllByMen(user));
    }

    @GetMapping("/me")
    public ResponseEntity<List<AppointmentDto>> getMyAppointments(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(appointmentService.getAppointmentsByUser(user));
    }

    @GetMapping("/get-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentDto>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
}
