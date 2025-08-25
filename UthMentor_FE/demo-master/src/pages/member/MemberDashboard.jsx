import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { memberAPI, appointmentAPI, reviewAPI } from '../../services/api';
import { toast } from 'react-toastify';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    completedAppointments: 0,
    totalMentorsVisited: 0,
    pendingReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [memberProfile, setMemberProfile] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  // Fetch member data from backend
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        
        // Fetch member profile
        const profileResponse = await memberAPI.getProfile();
        setMemberProfile(profileResponse.data);
        
        // Fetch all appointments
        const appointmentsResponse = await appointmentAPI.getMyAppointments();
        const allAppointments = appointmentsResponse.data;
        
        // Filter upcoming appointments (today and future)
        const today = new Date().toISOString().split('T')[0];
        const upcoming = allAppointments.filter(apt => 
          apt.appointmentDate >= today && apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED'
        );
        
        // Filter recent appointments (completed)
        const recent = allAppointments.filter(apt => 
          apt.status === 'COMPLETED'
        ).slice(0, 5); // Get last 5 completed appointments
        
        setUpcomingAppointments(upcoming);
        setRecentAppointments(recent);
        
        // Calculate stats
        const completedCount = allAppointments.filter(apt => apt.status === 'COMPLETED').length;
        const pendingReviewsCount = recent.filter(apt => !apt.hasReview).length;
        const uniqueMentors = new Set(allAppointments.map(apt => apt.mentorId)).size;
        
        setStats({
          upcomingAppointments: upcoming.length,
          completedAppointments: completedCount,
          totalMentorsVisited: uniqueMentors,
          pendingReviews: pendingReviewsCount
        });
        
      } catch (error) {
        console.error('Error fetching member data:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.update(appointmentId, 'CANCELLED');
      
      setUpcomingAppointments(prev => 
        prev.filter(apt => apt.id !== appointmentId)
      );
      
      setStats(prev => ({
        ...prev,
        upcomingAppointments: prev.upcomingAppointments - 1
      }));
      
      toast.success('Đã hủy lịch hẹn thành công!');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Không thể hủy lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleReviewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    try {
      await reviewAPI.create({
        mentorId: selectedAppointment.mentorId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });

      // Update appointment to mark as reviewed
      setRecentAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, hasReview: true }
            : apt
        )
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        pendingReviews: Math.max(0, prev.pendingReviews - 1)
      }));

      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
      toast.success('Đánh giá đã được gửi thành công!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Không thể gửi đánh giá. Vui lòng thử lại.');
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
      case 'CANCELLED':
        return <Badge bg="danger">Đã hủy</Badge>;
      case 'REJECTED':
        return <Badge bg="secondary">Đã từ chối</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
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
            Bảng điều khiển Thành viên
          </h2>
          <Alert variant="info" className="border-0 shadow-sm dashboard-alert">
            <i className="bi bi-heart me-2"></i>
            Xin chào <strong>{user?.firstName} {user?.lastName}</strong>! 
            Hôm nay là {new Date().toLocaleDateString('vi-VN')} - Bạn có {stats.upcomingAppointments} lịch hẹn sắp tới.
          </Alert>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 border-primary shadow-sm dashboard-stats-card">
            <Card.Body className="p-4">
              <div className="display-6 text-primary mb-3 dashboard-stats-icon">
                <i className="bi bi-calendar-event"></i>
              </div>
              <div className="display-4 fw-bold text-primary mb-2 dashboard-stats-number">{stats.upcomingAppointments}</div>
              <Card.Title className="h6 text-muted dashboard-stats-label">Lịch hẹn sắp tới</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 border-success shadow-sm dashboard-stats-card">
            <Card.Body className="p-4">
              <div className="display-6 text-success mb-3 dashboard-stats-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="display-4 fw-bold text-success mb-2 dashboard-stats-number">{stats.completedAppointments}</div>
              <Card.Title className="h6 text-muted dashboard-stats-label">Đã tư vấn</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 border-info shadow-sm dashboard-stats-card">
            <Card.Body className="p-4">
              <div className="display-6 text-info mb-3 dashboard-stats-icon">
                <i className="bi bi-person-badge"></i>
              </div>
              <div className="display-4 fw-bold text-info mb-2 dashboard-stats-number">{stats.totalMentorsVisited}</div>
              <Card.Title className="h6 text-muted dashboard-stats-label">Mentor đã tư vấn</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center h-100 border-warning shadow-sm dashboard-stats-card">
            <Card.Body className="p-4">
              <div className="display-6 text-warning mb-3 dashboard-stats-icon">
                <i className="bi bi-star"></i>
              </div>
              <div className="display-4 fw-bold text-warning mb-2 dashboard-stats-number">{stats.pendingReviews}</div>
              <Card.Title className="h6 text-muted dashboard-stats-label">Chờ đánh giá</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Upcoming Appointments */}
      <Card className="mb-4 shadow-sm dashboard-card">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center dashboard-card-header">
          <h5 className="mb-0">
            <i className="bi bi-calendar-check me-2"></i>
            Lịch hẹn sắp tới
          </h5>
          <Button variant="light" size="sm" as={Link} to="/member/appointments">
            <i className="bi bi-calendar-plus me-1"></i>
            Xem tất cả lịch
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-5 dashboard-loading">
              <i className="bi bi-calendar-x display-1 text-muted"></i>
              <p className="text-muted mt-3">Bạn chưa có lịch hẹn nào</p>
              <Button variant="primary" as={Link} to="/mentors">
                <i className="bi bi-search me-2"></i>
                Tìm kiếm Mentor
              </Button>
            </div>
          ) : (
            <Table striped hover responsive className="mb-0 dashboard-table">
              <thead className="table-light">
                <tr>
                  <th>Ngày & Giờ</th>
                  <th>Mentor</th>
                  <th>Chuyên môn</th>
                  <th>Lý do tư vấn</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>
                      <div>
                        <strong>{formatDate(appointment.appointmentDate)}</strong>
                        <br />
                        <small className="text-muted">{formatTime(appointment.appointmentTime)}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{appointment.mentorName}</strong>
                                        {appointment.fieldName && (
                  <small className="text-muted d-block">{appointment.fieldName}</small>
                )}
                      </div>
                    </td>
                                          <td>{appointment.fieldName || 'Tư vấn tổng quát'}</td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{maxWidth: '150px'}}>
                        {appointment.reason || 'Tư vấn tổng quát'}
                      </span>
                    </td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => handleViewAppointment(appointment)}
                          title="Xem chi tiết"
                          className="action-btn"
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        {appointment.status === 'PENDING' && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            title="Hủy lịch hẹn"
                            className="action-btn"
                          >
                            <i className="bi bi-x-lg"></i>
                          </Button>
                        )}
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
                <Button variant="outline-primary" as={Link} to="/mentors" className="action-btn">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Đặt lịch tư vấn mới
                </Button>
                <Button variant="outline-info" as={Link} to="/mentors" className="action-btn">
                  <i className="bi bi-search me-2"></i>
                  Tìm kiếm Mentor
                </Button>
                <Button variant="outline-success" as={Link} to="/member/profile" className="action-btn">
                  <i className="bi bi-person-circle me-2"></i>
                  Cập nhật hồ sơ
                </Button>


              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-3">
          <Card className="shadow-sm dashboard-card">
            <Card.Header className="bg-light">
              <h6 className="mb-0">
                <i className="bi bi-clock-history me-2 text-success"></i>
                Lịch sử tư vấn gần đây
              </h6>
            </Card.Header>
            <Card.Body>
              {recentAppointments.length === 0 ? (
                <p className="text-muted text-center py-3">Chưa có lịch sử tư vấn</p>
              ) : (
                <div className="list-group list-group-flush">
                  {recentAppointments.map(appointment => (
                    <div key={appointment.id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{appointment.mentorName}</h6>
                          <p className="mb-1 text-muted small">{appointment.fieldName || 'Tư vấn tổng quát'}</p>
                          <small className="text-muted">
                            {formatDate(appointment.appointmentDate)} - {formatTime(appointment.appointmentTime)}
                          </small>
                        </div>
                        <div className="text-end">
                          {getStatusBadge(appointment.status)}
                          {!appointment.hasReview && (
                            <div className="mt-1">
                              <Button 
                                variant="outline-warning" 
                                size="sm"
                                onClick={() => handleReviewAppointment(appointment)}
                              >
                                <i className="bi bi-star me-1"></i>
                                Đánh giá
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  <h6>Thông tin Mentor</h6>
                  <p><strong>Tên:</strong> {selectedAppointment.mentorName}</p>
                  <p><strong>Lĩnh vực:</strong> {selectedAppointment.fieldName || 'Tư vấn tổng quát'}</p>
                  <p><strong>Lĩnh vực:</strong> {selectedAppointment.fieldName || 'Chưa cập nhật'}</p>
                </Col>
                <Col md={6}>
                  <h6>Thông tin lịch hẹn</h6>
                  <p><strong>Ngày:</strong> {formatDate(selectedAppointment.appointmentDate)}</p>
                  <p><strong>Giờ:</strong> {formatTime(selectedAppointment.appointmentTime)}</p>
                  <p><strong>Trạng thái:</strong> {getStatusBadge(selectedAppointment.status)}</p>
                </Col>
              </Row>
              <hr />
              <div>
                <h6>Lý do tư vấn</h6>
                <p>{selectedAppointment.reason || 'Không có thông tin'}</p>
              </div>
              {selectedAppointment.note && (
                <div>
                  <h6>Ghi chú của mentor</h6>
                  <p>{selectedAppointment.note}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
            Đóng
          </Button>
          {selectedAppointment?.status === 'PENDING' && (
            <Button 
              variant="danger" 
              onClick={() => {
                handleCancelAppointment(selectedAppointment.id);
                setShowAppointmentModal(false);
              }}
            >
              Hủy lịch hẹn
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đánh giá Mentor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <h6>Mentor: {selectedAppointment.mentorName}</h6>
              <p className="text-muted">Ngày tư vấn: {formatDate(selectedAppointment.appointmentDate)}</p>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Đánh giá sao</Form.Label>
                  <div>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Button
                        key={star}
                        variant={star <= reviewData.rating ? 'warning' : 'outline-warning'}
                        size="sm"
                        className="me-1"
                        onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      >
                        <i className="bi bi-star-fill"></i>
                      </Button>
                    ))}
                    <span className="ms-2">({reviewData.rating}/5)</span>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Nhận xét</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={reviewData.comment}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                  />
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="warning" 
            onClick={handleSubmitReview}
            disabled={!reviewData.comment.trim()}
          >
            Gửi đánh giá
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MemberDashboard;