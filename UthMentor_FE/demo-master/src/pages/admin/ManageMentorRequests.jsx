import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FaEye, FaCheck, FaTimes, FaTrash, FaClock, FaUser, FaGraduationCap } from 'react-icons/fa';
import mentorRequestAPI from '../../services/mentorRequestApi';

const ManageMentorRequests = () => {
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Custom styles for the new color scheme
  const customStyles = `
    <style>
      .manage-mentor-requests .btn-outline-primary:hover {
        background-color: #1EA599 !important;
        border-color: #1EA599 !important;
        color: white !important;
      }
      .manage-mentor-requests .btn-outline-primary:focus {
        background-color: #1EA599 !important;
        border-color: #1EA599 !important;
        color: white !important;
        box-shadow: 0 0 0 0.2rem rgba(30, 165, 153, 0.25) !important;
      }
      .manage-mentor-requests .btn-primary {
        background-color: #1EA599 !important;
        border-color: #1EA599 !important;
      }
      .manage-mentor-requests .btn-primary:hover {
        background-color: #1a8f85 !important;
        border-color: #1a8f85 !important;
      }
    </style>
  `;

  useEffect(() => {
    fetchMentorRequests();
  }, []);

  const fetchMentorRequests = async () => {
    try {
      setLoading(true);
      const data = await mentorRequestAPI.getAll();
      console.log('Fetched mentor requests:', data);
      setMentorRequests(data);
    } catch (error) {
      console.error('Error fetching mentor requests:', error);
      setAlertType('danger');
      setAlertMessage('Không thể tải danh sách yêu cầu mentor.');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      console.log('Updating status for request:', requestId, 'to status:', newStatus);
      
      const result = await mentorRequestAPI.updateStatus(requestId, newStatus);
      console.log('Status update result:', result);
      
      // Cập nhật local state
      setMentorRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: newStatus }
            : req
        )
      );

      setAlertType('success');
      setAlertMessage(`Đã ${newStatus === 'APPROVED' ? 'duyệt' : 'từ chối'} yêu cầu thành công!`);
      setShowAlert(true);

      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      setAlertType('danger');
      setAlertMessage('Không thể cập nhật trạng thái. Vui lòng thử lại.');
      setShowAlert(true);
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa yêu cầu này?')) {
      try {
        await mentorRequestAPI.delete(requestId);
        
        // Cập nhật local state
        setMentorRequests(prev => prev.filter(req => req.id !== requestId));
        
        setAlertType('success');
        setAlertMessage('Đã xóa yêu cầu thành công!');
        setShowAlert(true);
        
        setTimeout(() => setShowAlert(false), 3000);
      } catch (error) {
        console.error('Error deleting request:', error);
        setAlertType('danger');
        setAlertMessage('Không thể xóa yêu cầu. Vui lòng thử lại.');
        setShowAlert(true);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { variant: 'warning', text: 'Chờ duyệt' },
      'APPROVED': { variant: 'success', text: 'Đã duyệt' },
      'REJECTED': { variant: 'danger', text: 'Từ chối' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return time.substring(0, 5); // Lấy HH:mm từ HH:mm:ss
  };

  const formatDays = (days) => {
    if (!days || days.length === 0) return 'N/A';
    
    const dayLabels = {
      'MONDAY': 'T2',
      'TUESDAY': 'T3', 
      'WEDNESDAY': 'T4',
      'THURSDAY': 'T5',
      'FRIDAY': 'T6',
      'SATURDAY': 'T7',
      'SUNDAY': 'CN'
    };
    
    return days.map(day => dayLabels[day] || day).join(', ');
  };

  const filteredMentorRequests = mentorRequests.filter(request => {
    if (filterStatus === 'ALL') return true;
    return request.status === filterStatus;
  });

  const stats = {
    total: mentorRequests.length,
    pending: mentorRequests.filter(req => req.status === 'PENDING').length,
    approved: mentorRequests.filter(req => req.status === 'APPROVED').length,
    rejected: mentorRequests.filter(req => req.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="mt-3">Đang tải danh sách yêu cầu mentor...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="manage-mentor-requests" style={{ '--custom-primary': '#1EA599' }}>
        <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-3">
              <FaGraduationCap className="me-2" style={{ color: '#1EA599' }} />
              Quản lý yêu cầu trở thành Mentor
            </h2>
            <p className="text-muted">
              Duyệt và quản lý các yêu cầu trở thành mentor từ người dùng
            </p>
          </Col>
        </Row>

        {showAlert && (
          <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible className="mb-4">
            {alertMessage}
          </Alert>
        )}

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
                      style={filterStatus === 'ALL' ? { backgroundColor: '#1EA599', borderColor: '#1EA599' } : { color: '#1EA599', borderColor: '#1EA599' }}
                    >
                      Tất cả ({stats.total})
                    </Button>
                    <Button 
                      variant={filterStatus === 'PENDING' ? 'warning' : 'outline-warning'}
                      size="sm"
                      onClick={() => setFilterStatus('PENDING')}
                    >
                      Chờ duyệt ({stats.pending})
                    </Button>
                    <Button 
                      variant={filterStatus === 'APPROVED' ? 'success' : 'outline-success'}
                      size="sm"
                      onClick={() => setFilterStatus('APPROVED')}
                    >
                      Đã duyệt ({stats.approved})
                    </Button>
                    <Button 
                      variant={filterStatus === 'REJECTED' ? 'danger' : 'outline-danger'}
                      size="sm"
                      onClick={() => setFilterStatus('REJECTED')}
                    >
                      Từ chối ({stats.rejected})
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm">
          <Card.Header style={{ backgroundColor: '#1EA599' }} className="text-white">
            <h5 className="mb-0">
              <FaClock className="me-2" />
              Danh sách yêu cầu ({filteredMentorRequests.length})
            </h5>
          </Card.Header>
          <Card.Body className="p-0">
            {filteredMentorRequests.length === 0 ? (
              <div className="text-center py-5">
                <FaGraduationCap className="display-4 text-muted mb-3" />
                <h5 className="text-muted">
                  {filterStatus === 'ALL' 
                    ? 'Chưa có yêu cầu nào'
                    : `Không có yêu cầu nào với trạng thái "${filterStatus}"`
                  }
                </h5>
                <p className="text-muted">
                  {filterStatus === 'ALL' 
                    ? 'Khi có người gửi yêu cầu trở thành mentor, họ sẽ xuất hiện ở đây.'
                    : 'Hãy thử chọn trạng thái khác hoặc xem tất cả yêu cầu.'
                  }
                </p>
              </div>
            ) : (
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Người dùng</th>
                    <th>Lĩnh vực</th>
                    <th>Thời gian</th>
                    <th>Ngày làm việc</th>
                    <th>Phí tư vấn</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMentorRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm me-2">
                            <FaUser style={{ color: '#1EA599' }} />
                          </div>
                          <div>
                            <div className="fw-bold">
                              {request.user?.firstName} {request.user?.lastName}
                            </div>
                            <small className="text-muted">{request.user?.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info" className="text-white">
                          {request.field?.name || 'Chưa cập nhật'}
                        </Badge>
                      </td>
                      <td>
                        <small>
                          {formatTime(request.startTime)} - {formatTime(request.endTime)}
                        </small>
                      </td>
                      <td>
                        <small>{formatDays(request.daysOfWeek)}</small>
                      </td>
                      <td>
                        {request.fee ? (
                          <span className="text-success fw-bold">
                            {request.fee.toLocaleString('vi-VN')}đ/giờ
                          </span>
                        ) : (
                          <span className="text-muted">Chưa cập nhật</span>
                        )}
                      </td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>
                        <small>
                          {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                            title="Xem chi tiết"
                            style={{ color: '#1EA599', borderColor: '#1EA599' }}
                          >
                            <FaEye />
                          </Button>
                          
                          {request.status === 'PENDING' && (
                            <>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                                title="Duyệt"
                              >
                                <FaCheck />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                                title="Từ chối"
                              >
                                <FaTimes />
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(request.id)}
                            title="Xóa"
                          >
                            <FaTrash />
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
      </Container>

      {/* Modal xem chi tiết */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEye className="me-2" style={{ color: '#1EA599' }} />
            Chi tiết yêu cầu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              <Row>
                <Col md={6}>
                  <h6 className="fw-bold">Thông tin người dùng</h6>
                  <p><strong>Họ tên:</strong> {selectedRequest.user?.firstName} {selectedRequest.user?.lastName}</p>
                  <p><strong>Email:</strong> {selectedRequest.user?.email}</p>
                  <p><strong>Trạng thái:</strong> {getStatusBadge(selectedRequest.status)}</p>
                </Col>
                <Col md={6}>
                  <h6 className="fw-bold">Thông tin chuyên môn</h6>
                  <p><strong>Lĩnh vực:</strong> {selectedRequest.field?.name || selectedRequest.field}</p>
                  <p><strong>Thời gian:</strong> {formatTime(selectedRequest.startTime)} - {formatTime(selectedRequest.endTime)}</p>
                  <p><strong>Ngày làm việc:</strong> {formatDays(selectedRequest.daysOfWeek)}</p>
                  {selectedRequest.fee && (
                    <p><strong>Phí tư vấn:</strong> {selectedRequest.fee.toLocaleString('vi-VN')}đ/giờ</p>
                  )}
                </Col>
              </Row>
              
              {selectedRequest.description && (
                <div className="mt-3">
                  <h6 className="fw-bold">Mô tả</h6>
                  <p className="text-muted">{selectedRequest.description}</p>
                </div>
              )}
              
              {selectedRequest.imageUrl && (
                <div className="mt-3">
                  <h6 className="fw-bold">Hình ảnh</h6>
                  <img 
                    src={selectedRequest.imageUrl} 
                    alt="Mentor" 
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
  );
};

export default ManageMentorRequests;
