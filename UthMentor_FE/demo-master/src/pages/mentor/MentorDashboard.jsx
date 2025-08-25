import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mentorAPI, appointmentAPI, reviewAPI } from '../../services/api';
import { toast } from 'react-toastify';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    completedToday: 0,
    totalMembers: 0
  });
  const [loading, setLoading] = useState(true);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentNote, setAppointmentNote] = useState('');

  // Fetch mentor data from backend
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        
        // Fetch mentor profile
        const profileResponse = await mentorAPI.getProfile();
        setMentorProfile(profileResponse.data);
        
        // Fetch mentor's appointments
        const appointmentsResponse = await appointmentAPI.getByMentor();
        const allAppointments = appointmentsResponse.data;
        
        // Filter today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = allAppointments.filter(apt => 
          apt.appointmentDate === today
        );
        
        // Sort today's appointments by time in ascending order
        const sortedTodayAppts = todayAppts.sort((a, b) => {
          const timeA = a.appointmentTime || '';
          const timeB = b.appointmentTime || '';
          return timeA.localeCompare(timeB);
        });
        
        setTodayAppointments(sortedTodayAppts);
        
        // Calculate stats
        const pendingCount = allAppointments.filter(apt => apt.status === 'PENDING').length;
        const completedToday = sortedTodayAppts.filter(apt => apt.status === 'COMPLETED').length;
        const totalMembers = new Set(allAppointments.map(apt => apt.memberId)).size;
        
        setStats({
          todayAppointments: sortedTodayAppts.length,
          pendingAppointments: pendingCount,
          completedToday: completedToday,
          totalMembers: totalMembers
        });
        
        // Fetch reviews if mentor has ID
        if (profileResponse.data.id) {
          try {
            const reviewsResponse = await reviewAPI.getByMentor(profileResponse.data.id);
            setReviews(reviewsResponse.data);
          } catch (error) {
            console.log('No reviews found or error fetching reviews');
          }
        }
        
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.update(appointmentId, 'APPROVED');
      
      setTodayAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'APPROVED' }
            : apt
        )
      );
      
      setStats(prev => ({
        ...prev,
        pendingAppointments: prev.pendingAppointments - 1
      }));
      
      toast.success('Đã xác nhận lịch hẹn thành công!');
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Không thể xác nhận lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.update(appointmentId, 'COMPLETED');
      
      setTodayAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'COMPLETED' }
            : apt
        )
      );
      
      setStats(prev => ({
        ...prev,
        completedToday: prev.completedToday + 1,
        pendingAppointments: prev.pendingAppointments - 1
      }));
      
      toast.success('Đã hoàn thành lịch hẹn!');
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast.error('Không thể hoàn thành lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentNote(appointment.note || '');
    setShowAppointmentModal(true);
  };

  const handleSaveNote = async () => {
    try {
      // Update appointment with note
      await appointmentAPI.update(selectedAppointment.id, selectedAppointment.status, { note: appointmentNote });
      
      setTodayAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, note: appointmentNote }
            : apt
        )
      );
      
      setShowAppointmentModal(false);
      toast.success('Đã lưu ghi chú thành công!');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Không thể lưu ghi chú. Vui lòng thử lại.');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED':
        return <Badge bg="success">Đã xác nhận</Badge>;
      case 'PENDING':
        return <Badge bg="warning">Chờ xác nhận</Badge>;
      case 'COMPLETED':
        return <Badge bg="primary">Hoàn thành</Badge>;
      case 'REJECTED':
        return <Badge bg="danger">Đã từ chối</Badge>;
      case 'NOT_APPROVED':
        return <Badge bg="secondary">Chưa duyệt</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center dashboard-loading">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="mt-3">Đang tải dữ liệu...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3 text-primary">
            <i className="bi bi-speedometer2 me-2"></i>
            Bảng điều khiển Mentor
          </h2>
          <Alert variant="info" className="border-0 shadow-sm dashboard-alert">
            <i className="bi bi-info-circle me-2"></i>
            Chào mừng mentor <strong>{user?.firstName} {user?.lastName}</strong>! 
            Hôm nay là {new Date().toLocaleDateString('vi-VN')} - Bạn có {stats.todayAppointments} lịch hẹn.
          </Alert>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 border-primary shadow-sm dashboard-stats-card">
            <Card.Body className="p-4">
              <div className="display-6 text-primary mb-3 dashboard-stats-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div className="display-4 fw-bold text-primary mb-2 dashboard-stats-number">{stats.todayAppointments}</div>
              <Card.Title className="h6 text-muted dashboard-stats-label">Lịch hẹn hôm nay</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 border-warning shadow-sm dashboard-stats-card">
            <Card.Body className="p-4">
              <div className="display-6 text-warning mb-3 dashboard-stats-icon">
                <i className="bi bi-clock"></i>
              </div>
              <div className="display-4 fw-bold text-warning mb-2 dashboard-stats-number">{stats.pendingAppointments}</div>
              <Card.Title className="h6 text-muted dashboard-stats-label">Chờ xác nhận</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 border-success shadow-sm dashboard-stats-card">
            <Card.Body className="p-4">
              <div className="display-6 text-success mb-3 dashboard-stats-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="display-4 fw-bold text-success mb-2 dashboard-stats-number">{stats.completedToday}</div>
              <Card.Title className="h6 text-muted dashboard-stats-label">Hoàn thành hôm nay</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 border-info shadow-sm dashboard-stats-card">
            <Card.Body className="p-4">
              <div className="display-6 text-info mb-3 dashboard-stats-icon">
                <i className="bi bi-people"></i>
              </div>
              <div className="display-4 fw-bold text-info mb-2 dashboard-stats-number">{stats.totalMembers}</div>
              <Card.Title className="h6 text-muted dashboard-stats-label">Tổng thành viên</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Today's Appointments */}
      <Card className="mb-4 shadow-sm dashboard-card">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center dashboard-card-header">
          <h5 className="mb-0">
            <i className="bi bi-calendar-day me-2"></i>
            Lịch hẹn hôm nay ({new Date().toLocaleDateString('vi-VN')})
          </h5>
          <Button variant="light" size="sm" as={Link} to="/mentor/appointments">
            <i className="bi bi-calendar-plus me-1"></i>
            Xem tất cả lịch
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          {todayAppointments.length === 0 ? (
            <div className="text-center py-5 dashboard-loading">
              <i className="bi bi-calendar-x display-1 text-muted"></i>
              <p className="text-muted mt-3">Không có lịch hẹn nào hôm nay</p>
            </div>
          ) : (
            <Table striped hover responsive className="mb-0 dashboard-table">
              <thead className="table-light">
                <tr>
                  <th>Thời gian</th>
                  <th>Thành viên</th>
                  <th>Số điện thoại</th>
                  <th>Lý do tư vấn</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>
                      <strong>{formatTime(appointment.appointmentTime)}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{appointment.memberName}</strong>
                        {appointment.memberAge && (
                          <small className="text-muted d-block">Tuổi: {appointment.memberAge}</small>
                        )}
                      </div>
                    </td>
                    <td>{appointment.memberPhone}</td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{maxWidth: '150px'}}>
                        {appointment.reason || 'Tư vấn tổng quát'}
                      </span>
                    </td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        {appointment.status === 'PENDING' && (
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleConfirmAppointment(appointment.id)}
                            title="Xác nhận lịch hẹn"
                            className="action-btn"
                          >
                            <i className="bi bi-check-lg"></i>
                          </Button>
                        )}
                        {appointment.status === 'APPROVED' && (
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleCompleteAppointment(appointment.id)}
                            title="Hoàn thành tư vấn"
                            className="action-btn"
                          >
                            <i className="bi bi-check-all"></i>
                          </Button>
                        )}
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => handleViewAppointment(appointment)}
                          title="Xem chi tiết"
                          className="action-btn"
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Quick Actions and Info */}
      <Row>
        <Col md={6} className="mb-3">
          <Card className="shadow-sm dashboard-card">
            <Card.Header className="bg-light">
              <h6 className="mb-0">
                <i className="bi bi-lightning me-2 text-warning"></i>
                Hành động nhanh
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" as={Link} to="/mentor/appointments" className="action-btn">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Xem tất cả lịch hẹn
                </Button>
                <Button variant="outline-info" as={Link} to="/mentor/profile" className="action-btn">
                  <i className="bi bi-person-circle me-2"></i>
                  Cập nhật hồ sơ
                </Button>
                <Button variant="outline-success" className="action-btn">
                  <i className="bi bi-clock-history me-2"></i>
                  Lịch sử tư vấn
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-3">
          <Card className="shadow-sm dashboard-card">
            <Card.Header className="bg-light">
              <h6 className="mb-0">
                <i className="bi bi-graph-up me-2 text-success"></i>
                Thông tin cá nhân
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <small className="text-muted">Đánh giá trung bình</small>
                <div className="d-flex align-items-center">
                  {calculateAverageRating() > 0 ? (
                    <>
                      <div className="text-warning me-2">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`bi ${i < Math.floor(calculateAverageRating()) ? 'bi-star-fill' : 
                                       i < calculateAverageRating() ? 'bi-star-half' : 'bi-star'}`}
                          ></i>
                        ))}
                      </div>
                      <span className="fw-bold">{calculateAverageRating()}/5</span>
                      <small className="text-muted ms-2">({reviews.length} đánh giá)</small>
                    </>
                  ) : (
                    <>
                      <div className="text-muted me-2">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="bi bi-star"></i>
                        ))}
                      </div>
                      <span className="fw-bold text-muted">Chưa có đánh giá</span>
                      <small className="text-muted ms-2">(0 đánh giá)</small>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <small className="text-muted">Chuyên môn</small>
                <div className="fw-bold">{mentorProfile?.fieldName || 'Chưa cập nhật'}</div>
              </div>
              <div className="mb-3">
                <small className="text-muted">Lĩnh vực</small>
                <div className="fw-bold">{mentorProfile?.fieldName || 'Chưa cập nhật'}</div>
              </div>
              <div>
                <small className="text-muted">Phí tư vấn</small>
                <div className="fw-bold text-success">
                  {mentorProfile?.fee ? `${mentorProfile.fee.toLocaleString()} VNĐ` : 'Chưa cập nhật'}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Appointment Detail Modal */}
      <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} size="lg" className="dashboard-modal">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết lịch hẹn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Thông tin thành viên</h6>
                  <p><strong>Tên:</strong> {selectedAppointment.memberName}</p>
                  <p><strong>Số điện thoại:</strong> {selectedAppointment.memberPhone}</p>
                  <p><strong>Tuổi:</strong> {selectedAppointment.memberAge || 'Chưa cập nhật'}</p>
                </Col>
                <Col md={6}>
                  <h6>Thông tin lịch hẹn</h6>
                  <p><strong>Thời gian:</strong> {formatTime(selectedAppointment.appointmentTime)}</p>
                  <p><strong>Ngày:</strong> {selectedAppointment.appointmentDate}</p>
                  <p><strong>Trạng thái:</strong> {getStatusBadge(selectedAppointment.status)}</p>
                </Col>
              </Row>
              <hr />
              <div>
                <h6>Lý do tư vấn</h6>
                <p>{selectedAppointment.reason || 'Không có thông tin'}</p>
              </div>
              <div>
                <h6>Ghi chú</h6>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={appointmentNote}
                  onChange={(e) => setAppointmentNote(e.target.value)}
                  placeholder="Nhập ghi chú về lịch hẹn..."
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSaveNote}>
            Lưu ghi chú
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MentorDashboard;