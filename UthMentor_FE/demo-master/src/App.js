import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { ToastContainer } from 'react-toastify';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import "./style/booking.css";
import "./style/dashboard.css";

// Context Providers
import { AuthProvider } from "./context/AuthContext";

// Layout components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Common component
import ProtectedRoute from "./components/common/ProtectedRoute";

// Lazy load components for better performance
// Public pages
const HomePage = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/auth/Login"));
const RegisterPage = lazy(() => import("./pages/auth/Register"));
const Contact = lazy(() => import("./pages/public/Contact"));
const BecomeMentor = lazy(() => import("./pages/public/BecomeMentor"));


// Member pages (formerly Patient pages)
const MentorSearch = lazy(() => import("./pages/member/MentorSearch"));
const MentorDetails = lazy(() => import("./pages/member/MentorDetail"));
const BookAppointment = lazy(() => import("./pages/member/BookAppointment"));
const MemberAppointments = lazy(() => import("./pages/member/MemberAppointments"));
const MemberDashboard = lazy(() => import("./pages/member/MemberDashboard"));
const MemberProfile = lazy(() => import("./pages/member/MemberProfile"));

// Mentor pages (formerly Doctor pages)
const MentorAppointments = lazy(() => import("./pages/mentor/MentorAppointment"));
const MentorProfile = lazy(() => import("./pages/mentor/MentorProfile"));
const MentorDashboard = lazy(() => import("./pages/mentor/MentorDashboard"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const DepartmentManager = lazy(() => import("./pages/admin/field"));
const ManageMentorRequests = lazy(() => import("./pages/admin/ManageMentorRequests"));

// Loading component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Đang tải...</span>
    </Spinner>
  </div>
);

// Utility Components
const AppointmentConfirmation = () => {
  return (
    <Container className="py-5">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-check-circle-fill display-1 text-success"></i>
        </div>
        <h2 className="mb-3">Xác nhận đặt lịch thành công!</h2>
        <p className="text-muted mb-4">
          Lịch hẹn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ với bạn để xác nhận thời gian cụ thể.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/member/appointments" className="btn btn-primary">
            <i className="bi bi-calendar-check me-1"></i>
            Xem lịch hẹn
          </Link>
          <Link to="/mentors" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i>
            Đặt lịch khác
          </Link>
        </div>
      </div>
    </Container>
  );
};

const UnauthorizedPage = () => {
  return (
    <Container className="py-5">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-shield-exclamation display-1 text-warning"></i>
        </div>
        <h2 className="mb-3">Không có quyền truy cập</h2>
        <p className="text-muted mb-4">
          Bạn không có quyền để truy cập trang này. Vui lòng đăng nhập với tài khoản phù hợp.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house me-1"></i>
            Về trang chủ
          </Link>
          <Link to="/login" className="btn btn-outline-secondary">
            <i className="bi bi-person me-1"></i>
            Đăng nhập
          </Link>
        </div>
      </div>
    </Container>
  );
};

const NotFoundPage = () => {
  return (
    <Container className="py-5">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-question-circle display-1 text-muted"></i>
        </div>
        <h2 className="mb-3">Trang không tồn tại</h2>
        <p className="text-muted mb-4">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house me-1"></i>
          Về trang chủ
        </Link>
      </div>
    </Container>
  );
};

// APP COMPONENT
function AppWithRouter() {
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Header />
      <main className="main-content flex-grow-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Information pages */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/become-mentor" element={<BecomeMentor />} />

            {/* Mentor Search routes */}
            <Route path="/mentors" element={<MentorSearch />} />
            <Route path="/mentors/:id" element={
              <ProtectedRoute allowedRoles={["USER", "MEMBER", "ADMIN"]}>
                <MentorDetails />
              </ProtectedRoute>
            } />

            {/* Appointment routes */}
            <Route path="/appointments/confirmation" element={
              <ProtectedRoute allowedRoles={["USER", "MEMBER", "ADMIN"]}>
                <AppointmentConfirmation />
              </ProtectedRoute>
            } />

            {/* Admin Routes Group */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/managefields" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <DepartmentManager />
              </ProtectedRoute>
            } />
            <Route path="/admin/mentor-requests" element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ManageMentorRequests />
              </ProtectedRoute>
            } />

            {/* Member Routes Group (formerly Patient Routes) */}
            <Route path="/member" element={
              <ProtectedRoute allowedRoles={["USER", "MEMBER", "ADMIN"]}>
                <MemberDashboard />
              </ProtectedRoute>
            } />
            <Route path="/member/dashboard" element={
              <ProtectedRoute allowedRoles={["USER", "MEMBER", "ADMIN"]}>
                <MemberDashboard />
              </ProtectedRoute>
            } />
            <Route path="/member/appointments" element={
              <ProtectedRoute allowedRoles={["USER", "MEMBER", "ADMIN"]}>
                <MemberAppointments />
              </ProtectedRoute>
            } />
            <Route path="/member/profile" element={
              <ProtectedRoute allowedRoles={["USER", "MEMBER", "ADMIN"]}>
                <MemberProfile />
              </ProtectedRoute>
            } />

            <Route path="/book-appointment/:id" element={
              <ProtectedRoute allowedRoles={["USER", "MEMBER", "ADMIN"]}>
                <BookAppointment />
              </ProtectedRoute>
            } />

            {/* Mentor Routes Group (formerly Doctor Routes) */}
            <Route path="/mentor" element={
              <ProtectedRoute allowedRoles={["MENTOR", "ADMIN"]}>
                <MentorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/mentor/dashboard" element={
              <ProtectedRoute allowedRoles={["MENTOR", "ADMIN"]}>
                <MentorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/mentor/appointments" element={
              <ProtectedRoute allowedRoles={["MENTOR", "ADMIN"]}>
                <MentorAppointments />
              </ProtectedRoute>
            } />
            <Route path="/mentor/profile" element={
              <ProtectedRoute allowedRoles={["MENTOR", "ADMIN"]}>
                <MentorProfile />
              </ProtectedRoute>
            } />

            {/* Error pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppWithRouter />
      </AuthProvider>
    </Router>
  );
}

export default App;