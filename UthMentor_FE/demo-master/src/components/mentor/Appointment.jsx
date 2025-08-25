import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import { appointmentAPI } from '../../services/api';
import { toast } from 'react-toastify';

const MentorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getByMentor();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentAPI.update(appointmentId, newStatus);
      toast.success(`Đã cập nhật trạng thái lịch hẹn thành ${newStatus}`);
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Không thể cập nhật trạng thái lịch hẹn');
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setNote(appointment.note || '');
    setShowModal(true);
  };

  const handleSaveNote = async () => {
    try {
      await appointmentAPI.update(selectedAppointment.id, selectedAppointment.status, { note });
      toast.success('Đã lưu ghi chú thành công');
      setShowModal(false);
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Không thể lưu ghi chú');
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
      case 'CANCELLED':
        return <Badge bg="secondary">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="mt-3">Đang tải danh sách lịch hẹn...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">
        <i className="bi bi-calendar-check me-2"></i>
        Danh sách lịch hẹn
      </h2>

      {appointments.length === 0 ? (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          Bạn chưa có lịch hẹn nào.
        </Alert>
      ) : (
        <Card>
          <Card.Header>
            <h5 className="mb-0">Tất cả lịch hẹn ({appointments.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <Table striped hover responsive>
              <thead className="table-light">
                <tr>
                  <th>Ngày</th>
                  <th>Thời gian</th>
                  <th>Thành viên</th>
                  <th>Số điện thoại</th>
                  <th>Lý do tư vấn</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    <td>{formatTime(appointment.appointmentTime)}</td>
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
                      <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>
                        {appointment.reason || 'Tư vấn tổng quát'}
                      </span>
                    </td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        {appointment.status === 'PENDING' && (
                          <>
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => handleStatusUpdate(appointment.id, 'APPROVED')}
                              title="Xác nhận"
                            >
                              <i className="bi bi-check-lg"></i>
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => handleStatusUpdate(appointment.id, 'REJECTED')}
                              title="Từ chối"
                            >
                              <i className="bi bi-x-lg"></i>
                            </Button>
                          </>
                        )}
                        {appointment.status === 'APPROVED' && (
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
                            title="Hoàn thành"
                          >
                            <i className="bi bi-check-all"></i>
                          </Button>
                        )}
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => handleViewDetails(appointment)}
                          title="Xem chi tiết"
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Appointment Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
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
                  <p><strong>Ngày:</strong> {formatDate(selectedAppointment.appointmentDate)}</p>
                  <p><strong>Thời gian:</strong> {formatTime(selectedAppointment.appointmentTime)}</p>
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
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú về lịch hẹn..."
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
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

export default MentorAppointments;