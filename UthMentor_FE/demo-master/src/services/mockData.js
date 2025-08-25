// Dữ liệu mẫu cho tính năng đặt lịch
export const mockSpecialties = [
  { id: 'cardiology', name: 'Tim mạch' },
  { id: 'dermatology', name: 'Da liễu' },
  { id: 'neurology', name: 'Thần kinh' },
  { id: 'orthopedics', name: 'Cơ xương khớp' },
  { id: 'pediatrics', name: 'Nhi khoa' },
  { id: 'internal', name: 'Nội khoa' },
  { id: 'gynecology', name: 'Sản phụ khoa' },
  { id: 'ophthalmology', name: 'Mắt' },
];

export const mockDoctors = [
  {
    id: 1,
    firstName: 'Văn',
    lastName: 'Hoàng',
    title: 'Bác sĩ',
            email: 'hoang.van@uthmentor.com',
    phone: '0901234567',
    specialties: ['cardiology', 'internal'],
    specialtyNames: ['Tim mạch', 'Nội khoa'],
    hospital: 'Bệnh viện Đại học Y Dược',
    experience: 15,
    rating: 4.9,
    price: 500000,
    image: 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg'
  },
  {
    id: 2,
    firstName: 'Thị Hương',
    lastName: 'Nguyễn',
    title: 'Bác sĩ',
            email: 'huong.nguyen@uthmentor.com',
    phone: '0912345678',
    specialties: ['dermatology'],
    specialtyNames: ['Da liễu'],
    hospital: 'Bệnh viện Da liễu Trung ương',
    experience: 10,
    rating: 4.7,
    price: 450000,
    image: 'https://img.freepik.com/free-photo/front-view-covid-recovery-center-female-doctor-with-stethoscope_23-2148847899.jpg'
  },
  // Thêm dữ liệu bác sĩ khác từ thiết kế
];

// Tạo khung giờ khám
export const mockTimeSlots = [];

// Generate slots for today and next 5 days
for (let day = 0; day < 6; day++) {
  const date = new Date();
  date.setDate(date.getDate() + day);
  
  // For each mentor
  for (let mentorId = 1; mentorId <= 6; mentorId++) {
    // Morning slots
    for (let hour = 8; hour < 12; hour++) {
      if (Math.random() > 0.4) { // 60% chance to have this slot available
        mockTimeSlots.push({
          id: `${mentorId}-${date.toISOString()}-${hour}`,
          mentorId,
          date: new Date(date),
          time: `${hour}:00`,
          isAvailable: true
        });
      }
    }
    
    // Afternoon slots
    for (let hour = 13; hour < 17; hour++) {
      if (Math.random() > 0.3) { // 70% chance to have this slot available
        mockTimeSlots.push({
          id: `${mentorId}-${date.toISOString()}-${hour}`,
          mentorId,
          date: new Date(date),
          time: `${hour}:00`,
          isAvailable: true
        });
      }
    }
  }
}