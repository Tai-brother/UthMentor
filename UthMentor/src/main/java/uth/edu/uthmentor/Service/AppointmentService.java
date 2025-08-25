package uth.edu.uthmentor.Service;

import uth.edu.uthmentor.Dto.AppointmentDto;
import uth.edu.uthmentor.Model.Appointment;
import uth.edu.uthmentor.Model.User;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentService {
    List<LocalTime> getAvailableSlots(Long mentorId, LocalDate date);

    AppointmentDto bookAppointment(AppointmentDto appointmentDto, User user);


    List<AppointmentDto> getAllByMen(User user);

    List<AppointmentDto> getAppointmentsByUser(User user);

    String createVnPayUrl(Appointment appointment);

    Appointment getAppointmentById(Long id);

    List<AppointmentDto> getAllAppointments();
}
