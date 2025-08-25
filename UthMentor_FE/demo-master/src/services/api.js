import axios from "axios"

// Fix the process.env issue by providing a fallback
const getApiUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Try to get from window.env first (if set by build process)
    if (window.env && window.env.REACT_APP_API_URL) {
      return window.env.REACT_APP_API_URL
    }
    // Try to get from process.env (if available)
    if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL
    }
  }
  // Default fallback
  return "http://localhost:8080"
}

// Cấu hình axios
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Reduced timeout for faster error detection
})

// Interceptor cho request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    
    // Only add Authorization header if token exists and is not empty
    if (token && token.trim() !== "" && token !== "null" && token !== "undefined") {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    
    console.log("API Request:", config.method?.toUpperCase(), config.url, config.baseURL)
    return config
  },
  (error) => {
    console.error("API Request Error:", error)
    return Promise.reject(error)
  },
)

// Interceptor cho response
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url)
    return response
  },
  (error) => {
    console.error("API Response Error:", error.response?.status, error.config?.url, error.message)

    if (error.response && error.response.status === 401) {
      // Xóa token và chuyển hướng đến trang đăng nhập khi token hết hạn
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Enhanced API functions with fallback
const createApiFunction = (apiCall) => {
  return async (...args) => {
    return await apiCall(...args)
  }
}

// ===== USER CONTROLLER APIs =====
export const authAPI = {
  // POST /user/register
  register: (userData) => api.post("/user/register", userData),

  // POST /user/login
  login: (credentials) => api.post("/user/login", credentials),


}

// ===== MENTOR CONTROLLER APIs =====
export const mentorAPI = {


  // PUT /mentor/update/{mentorId}
  updateMentor: (mentorId, mentorData) => api.put(`/mentor/update/${mentorId}`, mentorData),

  // GET /mentor/search?name=&field=&page=
  search: createApiFunction((params) => api.get("/mentor/search", { params })),

  // GET /mentor/me
  getProfile: () => api.get("/mentor/me"),

  // GET /mentor/{id}
  getById: createApiFunction(
    (id) => api.get(`/mentor/${id}`),
    null, // Will be handled specially
  ),

  // GET /mentor/get-all
  getAll: () => api.get("/mentor/get-all"),
}

// Special function for getting mentor by ID with mock fallback
export const getMentorById = (id) => api.get(`/mentor/${id}`)

// ===== MEMBER CONTROLLER APIs =====
export const memberAPI = {
  // GET /member/get-all
  getAll: () => api.get("/member/get-all"),

  // PUT /member/update/{memberId}
  update: (memberId, memberData) => api.put(`/member/update/${memberId}`, memberData),

  // DELETE /member/delete/{memberId}
  delete: (memberId) => api.delete(`/member/delete/${memberId}`),

  // GET /member/me
  getProfile: () => api.get("/member/me"),
}

// ===== APPOINTMENT CONTROLLER APIs =====
export const appointmentAPI = {
  // GET /appointment/available-slots?mentorId=&date=
  getAvailableSlots: createApiFunction(
    (mentorId, date) =>
      api.get("/appointment/available-slots", {
        params: { mentorId, date }, // Changed from doctorId to mentorId
      }),
  ),

  // POST /appointment/book
  book: (appointmentData) => {
    const token = localStorage.getItem("token");
    return api.post("/appointment/book", appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // PUT /appointment/update/{appointmentId}?status=
  update: (appointmentId, status, additionalData = {}) => {
    const params = { status };
    if (additionalData.note) {
      params.note = additionalData.note;
    }
    return api.put(`/appointment/update/${appointmentId}`, null, { params });
  },

  // GET /appointment/getBy-mentor
  getByMentor: () => api.get("/appointment/getBy-mentor"), // Changed from getBy-doctor

  // GET /appointment/me
  getMyAppointments: () => api.get("/appointment/me"),

  // GET /appointment/get-all (Admin only)
  getAll: () => api.get("/appointment/get-all"),
}

// ===== REVIEW CONTROLLER APIs =====
export const reviewAPI = {
  // POST /review/evaluate
  create: (reviewData) => api.post("/review/evaluate", reviewData),

  // GET /review/get-all/{mentorId}
  getByMentor: createApiFunction((mentorId) => api.get(`/review/get-all/${mentorId}`)), // Changed from doctorId to mentorId
}

// ===== FIELD CONTROLLER APIs =====
export const fieldAPI = {
  // POST /field/createField?name=&description=
  create: (name, description) =>
    api.post("/field/createField", null, {
      params: { name, description },
    }),

  // GET /field/get-all
  getAll: createApiFunction(() => api.get("/field/get-all")),

  // PUT /field/update/{fieldId}
  update: (fieldId, fieldData) =>
    api.put(`/field/update/${fieldId}`, fieldData),

  // DELETE /field/delete/{fieldId}
  delete: (fieldId) =>
    api.delete(`/field/delete/${fieldId}`),
}

// ===== CHATBOT CONTROLLER APIs =====
export const chatBotAPI = {
  // POST /bot/chat?prompt=
  chat: (prompt) =>
    api.post("/bot/chat", null, {
      params: { prompt },
    }),
}

// Legacy exports for backward compatibility
// (keeping old names for existing components)
export { mentorAPI as doctorAPI }
export { memberAPI as patientAPI }
export { mentorAPI as doctorService }
export { memberAPI as patientService }
export { appointmentAPI as appointmentService }
export { reviewAPI as reviewService }
export { fieldAPI as departmentAPI }
export { fieldAPI as departmentService }


export { mentorAPI as mentorService }
export { memberAPI as memberService }
export { fieldAPI as fieldService }

export default api
