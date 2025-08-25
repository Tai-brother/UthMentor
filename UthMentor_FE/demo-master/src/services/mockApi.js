// Mock data để giả lập database
let users = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'System',
    email: 'admin@example.com',
    password: 'admin123',
    phoneNumber: '0123456789',
    roles: ['ADMIN']
  },
  {
    id: 2,
    firstName: 'Bác Sĩ',
    lastName: 'Nguyễn',
    email: 'doctor@example.com',
    password: 'doctor123',
    phoneNumber: '0987654321',
    roles: ['DOCTOR']
  },
  {
    id: 3,
    firstName: 'Bệnh Nhân',
    lastName: 'Trần',
    email: 'patient@example.com',
    password: 'patient123',
    phoneNumber: '0369852147',
    roles: ['PATIENT']
  }, // Thêm dấu phẩy ở đây - đây là phần thiếu
  {
    id: 4,
    firstName: 'Nguyễn',
    lastName: 'Thông',
    email: 'ntthong1308@example.com',
    password: 'password123',
    phoneNumber: '0123456789',
    roles: ['PATIENT']
  }
];


// Helper để delay, giả lập delay của mạng
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data cho bác sĩ
let doctors = [
  {
    id: 1,
    firstName: 'Minh',
    lastName: 'Nguyễn',
    specialization: 'Tim mạch',
    education: 'Tiến sĩ Y khoa, Đại học Y Hà Nội',
    experience: '15 năm kinh nghiệm',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 4.9,
    phone: '0912345678',
    email: 'minhng@example.com',
    bio: 'Bác sĩ Minh là chuyên gia hàng đầu về tim mạch, có nhiều năm kinh nghiệm điều trị các bệnh lý tim mạch phức tạp.',
    workSchedule: {
      monday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      tuesday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      wednesday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      thursday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      friday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      saturday: ['08:00', '09:00', '10:00'],
      sunday: []
    }
  },
  {
    id: 2,
    firstName: 'Hương',
    lastName: 'Trần',
    specialization: 'Da liễu',
    education: 'Phó Giáo sư, Tiến sĩ Y khoa',
    experience: '12 năm kinh nghiệm',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    rating: 4.8,
    phone: '0923456789',
    email: 'huongtran@example.com',
    bio: 'Bác sĩ Hương là chuyên gia về da liễu, chuyên điều trị các bệnh về da và thẩm mỹ da.',
    workSchedule: {
      monday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      tuesday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      wednesday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      thursday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      friday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      saturday: ['08:00', '09:00', '10:00'],
      sunday: []
    }
  },
  {
    id: 3,
    firstName: 'Hoàng',
    lastName: 'Lê',
    specialization: 'Nhi khoa',
    education: 'Tiến sĩ Y khoa',
    experience: '10 năm kinh nghiệm',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    rating: 4.7,
    phone: '0934567890',
    email: 'hoangle@example.com',
    bio: 'Bác sĩ Hoàng có nhiều kinh nghiệm trong chẩn đoán và điều trị các bệnh lý ở trẻ em.',
    workSchedule: {
      monday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      tuesday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      wednesday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      thursday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      friday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      saturday: ['08:00', '09:00', '10:00'],
      sunday: []
    }
  },
  {
    id: 4,
    firstName: 'Linh',
    lastName: 'Phạm',
    specialization: 'Sản phụ khoa',
    education: 'Tiến sĩ Y khoa',
    experience: '8 năm kinh nghiệm',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    rating: 4.9,
    phone: '0945678901',
    email: 'linhpham@example.com',
    bio: 'Bác sĩ Linh chuyên khám và điều trị các bệnh phụ khoa, đồng thời có kinh nghiệm trong lĩnh vực sản khoa.',
    workSchedule: {
      monday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      tuesday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      wednesday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      thursday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      friday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      saturday: ['08:00', '09:00', '10:00'],
      sunday: []
    }
  },
  {
    id: 5,
    firstName: 'Tùng',
    lastName: 'Vũ',
    specialization: 'Tai Mũi Họng',
    education: 'Tiến sĩ Y khoa',
    experience: '11 năm kinh nghiệm',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    rating: 4.6,
    phone: '0956789012',
    email: 'tungvu@example.com',
    bio: 'Bác sĩ Tùng là chuyên gia về Tai Mũi Họng, có nhiều kinh nghiệm trong điều trị các bệnh lý phức tạp về tai, mũi, họng.',
    workSchedule: {
      monday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      tuesday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      wednesday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      thursday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      friday: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'],
      saturday: ['08:00', '09:00', '10:00'],
      sunday: []
    }
  }
];

// Mock data cho các chuyên khoa
let specializations = [
  { id: 1, name: 'Tim mạch', description: 'Khám và điều trị các bệnh lý liên quan đến tim mạch', icon: 'bi bi-heart-pulse' },
  { id: 2, name: 'Da liễu', description: 'Khám và điều trị các bệnh về da', icon: 'bi bi-bandaid' },
  { id: 3, name: 'Nhi khoa', description: 'Khám và điều trị các bệnh lý ở trẻ em', icon: 'bi bi-lightning' },
  { id: 4, name: 'Sản phụ khoa', description: 'Khám và điều trị các bệnh phụ khoa, theo dõi thai kỳ', icon: 'bi bi-gender-female' },
  { id: 5, name: 'Tai Mũi Họng', description: 'Khám và điều trị các bệnh lý về tai, mũi, họng', icon: 'bi bi-ear' },
  { id: 6, name: 'Mắt', description: 'Khám và điều trị các bệnh lý về mắt', icon: 'bi bi-eye' },
  { id: 7, name: 'Nội tiết', description: 'Khám và điều trị các bệnh lý liên quan đến nội tiết', icon: 'bi bi-droplet' },
  { id: 8, name: 'Thần kinh', description: 'Khám và điều trị các bệnh lý thần kinh', icon: 'bi bi-activity' }
];

// Mock data cho cuộc hẹn
let appointments = [
  {
    id: 1,
    mentorId: 1,
    memberId: 3,
    date: '2025-06-15',
    time: '09:00',
    status: 'confirmed',
    symptoms: 'Đau ngực, khó thở',
    notes: 'Bệnh nhân cần kiểm tra tim'
  },
  {
    id: 2,
    mentorId: 2,
    memberId: 3,
    date: '2025-06-20',
    time: '14:00',
    status: 'pending',
    symptoms: 'Nổi mẩn đỏ trên da',
    notes: ''
  }
];

// Mock API Service
const mockApi = {
  // Đăng ký
  register: async (userData) => {
    await delay(800); // Giả lập độ trễ mạng
    
    // Kiểm tra email đã tồn tại chưa
    if (users.find(user => user.email === userData.email)) {
      throw {
        response: {
          status: 400,
          data: {
            message: 'Email đã được sử dụng'
          }
        }
      };
    }
    
    // Thêm user mới
    const newUser = {
      id: users.length + 1,
      ...userData,
      roles: ['PATIENT'] // Mặc định là bệnh nhân
    };
    
    users.push(newUser);
    
    // Trả về user mới (không bao gồm mật khẩu)
    const { password, ...userWithoutPassword } = newUser;
    return {
      data: {
        user: userWithoutPassword,
        message: 'Đăng ký thành công'
      }
    };
  },
  
  // Đăng nhập
  login: async (email, password) => {
    await delay(800); // Giả lập độ trễ mạng
    
    // Tìm user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw {
        response: {
          status: 401,
          data: {
            message: 'Email hoặc mật khẩu không chính xác'
          }
        }
      };
    }
    
    // Tạo token giả
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    
    // Trả về user (không bao gồm mật khẩu) và token
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      data: {
        token,
        user: userWithoutPassword,
        message: 'Đăng nhập thành công'
      }
    };
  },
  
  // Quên mật khẩu
  forgotPassword: async (email) => {
    await delay(800);
    
    // Kiểm tra email có tồn tại không
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'Không tìm thấy tài khoản với email này'
          }
        }
      };
    }
    
    return {
      data: {
        message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn'
      }
    };
  },
  
  // Đặt lại mật khẩu
  resetPassword: async (token, newPassword) => {
    await delay(800);
    
    // Trong môi trường thật, sẽ xác thực token
    // Ở đây chúng ta chỉ giả lập thành công
    
    return {
      data: {
        message: 'Mật khẩu đã được đặt lại thành công'
      }
    };
  },
  
  // Lấy danh sách bác sĩ
  getDoctors: async (filters = {}) => {
    await delay(500);
    
    let filteredDoctors = [...doctors];
    
    // Lọc theo chuyên khoa nếu có
    if (filters.specialization) {
      filteredDoctors = filteredDoctors.filter(
        doctor => doctor.specialization.toLowerCase() === filters.specialization.toLowerCase()
      );
    }
    
    // Lọc theo tên nếu có
    if (filters.name) {
      const searchName = filters.name.toLowerCase();
      filteredDoctors = filteredDoctors.filter(
        doctor => 
          doctor.firstName.toLowerCase().includes(searchName) || 
          doctor.lastName.toLowerCase().includes(searchName)
      );
    }
    
    return {
      data: filteredDoctors
    };
  },
  
  // Lấy thông tin một bác sĩ
  getDoctor: async (id) => {
    await delay(300);
    
    const doctor = doctors.find(doc => doc.id === parseInt(id));
    
    if (!doctor) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'Không tìm thấy bác sĩ'
          }
        }
      };
    }
    
    return {
      data: doctor
    };
  },
  
  // Lấy danh sách chuyên khoa
  getSpecializations: async () => {
    await delay(300);
    
    return {
      data: specializations
    };
  },
  
  // Đặt lịch khám
  createAppointment: async (appointmentData) => {
    await delay(800);
    
    // Kiểm tra bác sĩ
    const doctor = doctors.find(doc => doc.id === appointmentData.mentorId);
    if (!doctor) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'Bác sĩ không tồn tại'
          }
        }
      };
    }
    
    // Kiểm tra thời gian làm việc của bác sĩ
    const dayOfWeek = new Date(appointmentData.date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    if (!doctor.workSchedule[dayOfWeek]?.includes(appointmentData.time)) {
      throw {
        response: {
          status: 400,
          data: {
            message: 'Bác sĩ không làm việc vào thời gian này'
          }
        }
      };
    }
    
    // Kiểm tra trùng lịch
    const isTimeSlotTaken = appointments.some(
      app => 
        app.mentorId === appointmentData.mentorId && 
        app.date === appointmentData.date && 
        app.time === appointmentData.time
    );
    
    if (isTimeSlotTaken) {
      throw {
        response: {
          status: 400,
          data: {
            message: 'Thời gian này đã có lịch hẹn, vui lòng chọn thời gian khác'
          }
        }
      };
    }
    
    // Tạo cuộc hẹn mới
    const newAppointment = {
      id: appointments.length + 1,
      ...appointmentData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    
    return {
      data: {
        appointment: newAppointment,
        message: 'Đặt lịch khám thành công'
      }
    };
  },
  
  // Lấy danh sách cuộc hẹn của bệnh nhân
  getPatientAppointments: async (patientId) => {
    await delay(500);
    
    const patientAppointments = appointments.filter(
      app => app.patientId === parseInt(patientId)
    );
    
    // Thêm thông tin bác sĩ vào kết quả
    const result = patientAppointments.map(app => {
      const doctor = doctors.find(doc => doc.id === app.mentorId);
      return {
        ...app,
        doctor: doctor 
          ? { 
              id: doctor.id, 
              name: `${doctor.firstName} ${doctor.lastName}`, 
              specialization: doctor.specialization,
              avatar: doctor.avatar
            }
          : null
      };
    });
    
    return {
      data: result
    };
  },
  
  // Lấy danh sách cuộc hẹn của mentor
  getMentorAppointments: async (mentorId) => {
    await delay(500);
    
    const mentorAppointments = appointments.filter(
      app => app.mentorId === parseInt(mentorId)
    );
    
    // Thêm thông tin thành viên vào kết quả
    const result = mentorAppointments.map(app => {
      const member = users.find(user => user.id === app.memberId);
      return {
        ...app,
        member: member 
          ? { 
              id: member.id, 
              name: `${member.firstName} ${member.lastName}`, 
              email: member.email,
              phoneNumber: member.phoneNumber
            }
          : null
      };
    });
    
    return {
      data: result
    };
  },
  
  // Cập nhật trạng thái cuộc hẹn (cho bác sĩ)
  updateAppointmentStatus: async (appointmentId, status) => {
    await delay(500);
    
    const appointment = appointments.find(app => app.id === parseInt(appointmentId));
    
    if (!appointment) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'Không tìm thấy cuộc hẹn'
          }
        }
      };
    }
    
    appointment.status = status;
    
    return {
      data: {
        appointment,
        message: 'Cập nhật trạng thái cuộc hẹn thành công'
      }
    };
  },
  
  // Hủy cuộc hẹn (cho thành viên)
  cancelAppointment: async (appointmentId, memberId) => {
    await delay(500);
    
    const appointment = appointments.find(
      app => app.id === parseInt(appointmentId) && app.memberId === parseInt(memberId)
    );
    
    if (!appointment) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'Không tìm thấy cuộc hẹn'
          }
        }
      };
    }
    
    appointment.status = 'cancelled';
    
    return {
      data: {
        message: 'Hủy cuộc hẹn thành công'
      }
    };
  }
};

export default mockApi;