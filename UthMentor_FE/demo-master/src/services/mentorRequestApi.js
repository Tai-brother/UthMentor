import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const mentorRequestAPI = {
  // Tạo mentor request mới
  create: async (mentorRequestData) => {
    try {
      const formData = new FormData();
      
      // Thêm các trường dữ liệu theo MentorRequestDto
      formData.append('startTime', mentorRequestData.startTime);
      formData.append('endTime', mentorRequestData.endTime);
      formData.append('fieldId', mentorRequestData.field); // Backend cần fieldId
      formData.append('fee', mentorRequestData.fee || '');
      formData.append('description', mentorRequestData.description || '');
      
      // Thêm file hình ảnh nếu có
      if (mentorRequestData.imageFile) {
        formData.append('file', mentorRequestData.imageFile); // Backend cần 'file'
      }
      
      // Thêm các ngày trong tuần
      mentorRequestData.daysOfWeek.forEach(day => {
        formData.append('daysOfWeek', day);
      });

      console.log('Sending form data:', Object.fromEntries(formData.entries()));

      const response = await axios.post(`${API_BASE_URL}/mentor/request`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả mentor requests (cho admin)
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mentor/get-all-requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy mentor request theo ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mentor/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật trạng thái mentor request (duyệt/từ chối)
  updateStatus: async (id, status) => {
    try {
      const requestData = { 
        mentorRequestId: id,
        status: status 
      };
      console.log('Updating mentor request status:', requestData);
      
      const response = await axios.put(`${API_BASE_URL}/mentor/decide-request`, 
        requestData, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log('Update status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
      throw error;
    }
  },

  // Xóa mentor request
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/mentor/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default mentorRequestAPI;
