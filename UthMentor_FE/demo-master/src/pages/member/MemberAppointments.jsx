import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Spinner, Modal, Form, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, reviewAPI } from '../../services/api';
import { toast } from 'react-toastify';

const MemberAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  // Fetch all appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentAPI.getMyAppointments();
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Không thể tải danh sách lịch hẹn. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.update(appointmentId, 'CANCELLED');
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'CANCELLED' }
            : apt
        )
      );
      
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
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, hasReview: true }
            : apt
        )
      );

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
    return timeString.substring(0, 5);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === 'ALL') return true;
    return appointment.status === filterStatus;
  });

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="mt-3">Đang tải danh sách lịch hẹn...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3 text-primary">
            <i className="bi bi-calendar3 me-2"></i>
            Tất cả lịch hẹn của tôi
          </h2>
          <Alert variant="info" className="border-0 shadow-sm">
            <i className="bi bi-info-circle me-2"></i>
            Quản lý tất cả lịch hẹn của bạn tại đây
          </Alert>
        </Col>
      </Row>

      {/* Filter Controls */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Lọc theo trạng thái:</h6>
                </div>
                <div className="d-flex gap-2">
                  <Button 
                    variant={filterStatus === 'ALL' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setFilterStatus('ALL')}
                  >
                    Tất cả ({appointments.length})
                  </Button>
                  <Button 
                    variant={filterStatus === 'PENDING' ? 'warning' : 'outline-warning'}
                    size="sm"
                    onClick={() => setFilterStatus('PENDING')}
                  >
                    Chờ xác nhận ({appointments.filter(a => a.status === 'PENDING').length})
                  </Button>
                  <Button 
                    variant={filterStatus === 'APPROVED' ? 'success' : 'outline-success'}
                    size="sm"
                    onClick={() => setFilterStatus('APPROVED')}
                  >
                    Đã xác nhận ({appointments.filter(a => a.status === 'APPROVED').length})
                  </Button>
                  <Button 
                    variant={filterStatus === 'COMPLETED' ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setFilterStatus('COMPLETED')}
                  >
                    Hoàn thành ({appointments.filter(a => a.status === 'COMPLETED').length})
                  </Button>
                  <Button 
                    variant={filterStatus === 'CANCELLED' ? 'danger' : 'outline-danger'}
                    size="sm"
                    onClick={() => setFilterStatus('CANCELLED')}
                  >
                    Đã hủy ({appointments.filter(a => a.status === 'CANCELLED').length})
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Appointments Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Danh sách lịch hẹn
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x display-1 text-muted"></i>
              <p className="text-muted mt-3">
                {filterStatus === 'ALL' 
                  ? 'Bạn chưa có lịch hẹn nào'
                  : `Không có lịch hẹn nào với trạng thái "${filterStatus}"`
                }
              </p>
              {filterStatus === 'ALL' && (
                <Button variant="primary" as={Link} to="/mentors">
                  <i className="bi bi-search me-2"></i>
                  Tìm kiếm Mentor
                </Button>
              )}
            </div>
          ) : (
            <Table striped hover responsive className="mb-0">
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
                {filteredAppointments.map(appointment => (
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
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        {appointment.status === 'PENDING' && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            title="Hủy lịch hẹn"
                          >
                            <i className="bi bi-x-lg"></i>
                          </Button>
                        )}
                        {appointment.status === 'COMPLETED' && !appointment.hasReview && (
                          <Button 
                            variant="outline-warning" 
                            size="sm"
                            onClick={() => handleReviewAppointment(appointment)}
                            title="Đánh giá"
                          >
                            <i className="bi bi-star"></i>
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

      {/* Appointment Detail Modal */}
      <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} size="lg">
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

export default MemberAppointments; 