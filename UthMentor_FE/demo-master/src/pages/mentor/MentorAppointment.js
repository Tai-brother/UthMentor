"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Modal, Form, Alert } from "react-bootstrap"
import { appointmentAPI } from "../../services/api"
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const MentorAppointment = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [appointmentNote, setAppointmentNote] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentAPI.getByMentor()
        setAppointments(response.data || [])
      } catch (error) {
        console.error("Error fetching appointments:", error)
        toast.error('Không thể tải danh sách lịch hẹn. Vui lòng thử lại.');
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.update(appointmentId, 'APPROVED');
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'APPROVED' }
            : apt
        )
      );
      
      toast.success('Đã xác nhận lịch hẹn thành công!');
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Không thể xác nhận lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.update(appointmentId, 'COMPLETED');
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'COMPLETED' }
            : apt
        )
      );
      
      toast.success('Đã hoàn thành lịch hẹn!');
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast.error('Không thể hoàn thành lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.update(appointmentId, 'CANCELLED');
      setAppointments(prev => 
        prev.filter(apt => apt.id !== appointmentId)
      );
      toast.success('Đã hủy lịch hẹn thành công!');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Không thể hủy lịch hẹn. Vui lòng thử lại.');
    }
  };

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentNote(appointment.note || '');
    setShowDetailModal(true);
  };

  const handleSaveNote = async () => {
    try {
      await appointmentAPI.update(selectedAppointment.id, selectedAppointment.status, { note: appointmentNote });
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, note: appointmentNote }
            : apt
        )
      );
      
      setShowDetailModal(false);
      toast.success('Đã lưu ghi chú thành công!');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Không thể lưu ghi chú. Vui lòng thử lại.');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { variant: "warning", text: "Chờ xác nhận" },
      APPROVED: { variant: "success", text: "Đã xác nhận" },
      COMPLETED: { variant: "info", text: "Hoàn thành" },
      REJECTED: { variant: "danger", text: "Đã từ chối" },
      NOT_APPROVED: { variant: "secondary", text: "Chưa duyệt" },
    }

    const statusInfo = statusMap[status] || { variant: "secondary", text: status }
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>
  }

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === 'ALL') return true;
    return appointment.status === filterStatus;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === 'PENDING').length,
    approved: appointments.filter(apt => apt.status === 'APPROVED').length,
    completed: appointments.filter(apt => apt.status === 'COMPLETED').length,
    cancelled: appointments.filter(apt => apt.status === 'CANCELLED').length,
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center dashboard-loading">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="mt-3">Đang tải danh sách lịch hẹn...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary mb-3">
            <i className="bi bi-calendar-check me-2"></i>
            Quản lý lịch hẹn
          </h2>
          <Alert variant="info" className="border-0 shadow-sm dashboard-alert">
            <i className="bi bi-info-circle me-2"></i>
            Chào mừng mentor <strong>{user?.firstName} {user?.lastName}</strong>! 
            Bạn có tổng cộng {stats.total} lịch hẹn.
          </Alert>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Card className="text-center border-primary shadow-sm dashboard-stats-card flex-grow-1" style={{minWidth: 180, maxWidth: 220}}>
              <Card.Body className="p-3">
                <div className="display-6 text-primary mb-2 dashboard-stats-icon">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <div className="h4 fw-bold text-primary mb-1 dashboard-stats-number">{stats.total}</div>
                <Card.Title className="h6 text-muted dashboard-stats-label">Tổng lịch hẹn</Card.Title>
              </Card.Body>
            </Card>
            <Card className="text-center border-warning shadow-sm dashboard-stats-card flex-grow-1" style={{minWidth: 180, maxWidth: 220}}>
              <Card.Body className="p-3">
                <div className="display-6 text-warning mb-2 dashboard-stats-icon">
                  <i className="bi bi-clock"></i>
                </div>
                <div className="h4 fw-bold text-warning mb-1 dashboard-stats-number">{stats.pending}</div>
                <Card.Title className="h6 text-muted dashboard-stats-label">Chờ xác nhận</Card.Title>
              </Card.Body>
            </Card>
            <Card className="text-center border-success shadow-sm dashboard-stats-card flex-grow-1" style={{minWidth: 180, maxWidth: 220}}>
              <Card.Body className="p-3">
                <div className="display-6 text-success mb-2 dashboard-stats-icon">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div className="h4 fw-bold text-success mb-1 dashboard-stats-number">{stats.approved}</div>
                <Card.Title className="h6 text-muted dashboard-stats-label">Đã xác nhận</Card.Title>
              </Card.Body>
            </Card>
            <Card className="text-center border-info shadow-sm dashboard-stats-card flex-grow-1" style={{minWidth: 180, maxWidth: 220}}>
              <Card.Body className="p-3">
                <div className="display-6 text-info mb-2 dashboard-stats-icon">
                  <i className="bi bi-check-all"></i>
                </div>
                <div className="h4 fw-bold text-info mb-1 dashboard-stats-number">{stats.completed}</div>
                <Card.Title className="h6 text-muted dashboard-stats-label">Hoàn thành</Card.Title>
              </Card.Body>
            </Card>
            <Card className="text-center border-danger shadow-sm dashboard-stats-card flex-grow-1" style={{minWidth: 180, maxWidth: 220}}>
              <Card.Body className="p-3">
                <div className="display-6 text-danger mb-2 dashboard-stats-icon">
                  <i className="bi bi-x-circle"></i>
                </div>
                <div className="h4 fw-bold text-danger mb-1 dashboard-stats-number">{stats.cancelled}</div>
                <Card.Title className="h6 text-muted dashboard-stats-label">Đã hủy</Card.Title>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Filter */}
      <Row className="mb-3">
        <Col>
          <Card className="shadow-sm dashboard-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <span className="me-3 fw-bold">Lọc theo trạng thái:</span>
                <div className="btn-group filter-btn-group" role="group">
                  <Button 
                    variant={filterStatus === 'ALL' ? 'primary' : 'outline-primary'} 
                    size="sm"
                    onClick={() => setFilterStatus('ALL')}
                  >
                    Tất cả
                  </Button>
                  <Button 
                    variant={filterStatus === 'PENDING' ? 'warning' : 'outline-warning'} 
                    size="sm"
                    onClick={() => setFilterStatus('PENDING')}
                  >
                    Chờ xác nhận
                  </Button>
                  <Button 
                    variant={filterStatus === 'APPROVED' ? 'success' : 'outline-success'} 
                    size="sm"
                    onClick={() => setFilterStatus('APPROVED')}
                  >
                    Đã xác nhận
                  </Button>
                  <Button 
                    variant={filterStatus === 'COMPLETED' ? 'info' : 'outline-info'} 
                    size="sm"
                    onClick={() => setFilterStatus('COMPLETED')}
                  >
                    Hoàn thành
                  </Button>
                  <Button 
                    variant={filterStatus === 'CANCELLED' ? 'danger' : 'outline-danger'} 
                    size="sm"
                    onClick={() => setFilterStatus('CANCELLED')}
                  >
                    Đã hủy
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Appointments Table */}
      <Card className="shadow-sm dashboard-card">
        <Card.Header className="bg-primary text-white dashboard-card-header">
          <h5 className="mb-0">
            <i className="bi bi-calendar-day me-2"></i>
            Danh sách lịch hẹn ({filteredAppointments.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-5 dashboard-loading">
              <i className="bi bi-calendar-x display-1 text-muted"></i>
              <p className="text-muted mt-3">
                {filterStatus === 'ALL' ? 'Chưa có lịch hẹn nào.' : `Không có lịch hẹn nào ở trạng thái "${filterStatus}".`}
              </p>
            </div>
          ) : (
            <Table striped hover responsive className="mb-0 dashboard-table">
              <thead className="table-light">
                <tr>
                  <th>Thành viên</th>
                  <th>Ngày tư vấn</th>
                  <th>Giờ tư vấn</th>
                  <th>Lý do tư vấn</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div>
                        <strong>{appointment.memberName}</strong>
                        {appointment.memberAge && (
                          <small className="text-muted d-block">Tuổi: {appointment.memberAge}</small>
                        )}
                      </div>
                    </td>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    <td>{formatTime(appointment.appointmentTime)}</td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{maxWidth: '150px'}}>
                        {appointment.reason || 'Tư vấn tổng quát'}
                      </span>
                    </td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{maxWidth: '100px'}}>
                        {appointment.note || '-'}
                      </span>
                    </td>
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
                          onClick={() => handleViewDetail(appointment)}
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

      {/* Appointment Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" className="dashboard-modal">
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
                  <p><strong>Email:</strong> {selectedAppointment.memberEmail}</p>
                  <p><strong>Tuổi:</strong> {selectedAppointment.memberAge || 'Chưa cập nhật'}</p>
                </Col>
                <Col md={6}>
                  <h6>Thông tin lịch hẹn</h6>
                  <p><strong>Thời gian:</strong> {formatTime(selectedAppointment.appointmentTime)}</p>
                  <p><strong>Ngày:</strong> {formatDate(selectedAppointment.appointmentDate)}</p>
                  <p><strong>Trạng thái:</strong> {getStatusBadge(selectedAppointment.status)}</p>
                  <p><strong>Phương thức thanh toán:</strong> {selectedAppointment.paymentMethod}</p>
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
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSaveNote}>
            Lưu ghi chú
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default MentorAppointment
