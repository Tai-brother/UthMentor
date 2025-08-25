import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, ListGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { memberAPI } from '../../services/api';

const MemberProfile = () => {
  const { currentUser } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    setLoading(true);
    memberAPI.getProfile()
      .then((res) => {
        const data = res.data;
        setMember(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          dob: data.dob || '',
          gender: data.gender || '',
          address: data.address || '',
          bloodType: data.bloodType || '',
          allergies: Array.isArray(data.allergies) ? data.allergies.join(', ') : '',
          chronicConditions: Array.isArray(data.chronicConditions) ? data.chronicConditions.join(', ') : '',
          emergencyContactName: data.emergencyContact?.name || '',
          emergencyContactRelationship: data.emergencyContact?.relationship || '',
          emergencyContactPhone: data.emergencyContact?.phone || '',
          insuranceProvider: data.insurance?.provider || '',
          insurancePolicyNumber: data.insurance?.policyNumber || '',
          insuranceExpiryDate: data.insurance?.expiryDate || ''
        });
        setLoading(false);
      })
      .catch((err) => {
        setErrorMessage('Không thể tải thông tin thành viên.');
        setLoading(false);
      });
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    // Giả lập API call để cập nhật thông tin
    try {
      // Trong thực tế, chúng ta sẽ gửi formData đến API
      console.log('Updating profile with data:', formData);
      
      // Giả lập thành công
      setTimeout(() => {
        const updatedMember = {
          ...member,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phoneNumber,
          dateOfBirth: formData.dob,
          gender: formData.gender,
          address: formData.address,
          bloodType: formData.bloodType,
          allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()) : [],
          chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(item => item.trim()) : [],
          emergencyContact: {
            name: formData.emergencyContactName,
            relationship: formData.emergencyContactRelationship,
            phone: formData.emergencyContactPhone
          },
          insurance: {
            ...member.insurance,
            provider: formData.insuranceProvider,
            policyNumber: formData.insurancePolicyNumber,
            expiryDate: formData.insuranceExpiryDate
          }
        };
        
        setMember(updatedMember);
        setSuccessMessage('Cập nhật thông tin thành công!');
        setEditMode(false);
        
        // Tự động ẩn thông báo sau 3 giây
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }, 800);
    } catch (error) {
      setErrorMessage('Đã có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.');
    }
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải thông tin thành viên...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <h2 className="mb-4">Hồ sơ thành viên</h2>
      
      {successMessage && (
        <Alert variant="success" className="mb-4">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorMessage}
        </Alert>
      )}
      
      <Tabs defaultActiveKey="personal" className="mb-4">
        {/* Tab thông tin cá nhân */}
        <Tab eventKey="personal" title={<span><i className="bi bi-person me-2"></i>Thông tin cá nhân</span>}>
          <Card className="shadow-sm">
            <Card.Body>
              {!editMode ? (
                <>
                  <div className="d-flex justify-content-end mb-3">
                    <Button variant="outline-primary" onClick={() => setEditMode(true)}>
                      <i className="bi bi-pencil me-2"></i> Chỉnh sửa
                    </Button>
                  </div>
                  
                  <Row className="mb-3">
                    <Col md={3} className="fw-bold">Họ và tên:</Col>
                    <Col md={9}>{member.lastName} {member.firstName}</Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={3} className="fw-bold">Ngày sinh:</Col>
                    <Col md={9}>{member.dob ? (new Date(member.dob).toString() !== 'Invalid Date' ? new Date(member.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật') : 'Chưa cập nhật'}</Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={3} className="fw-bold">Email:</Col>
                    <Col md={9}>{member.email}</Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={3} className="fw-bold">Số điện thoại:</Col>
                    <Col md={9}>{member.phoneNumber || 'Chưa cập nhật'}</Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={3} className="fw-bold">Địa chỉ:</Col>
                    <Col md={9}>{member.address}</Col>
                  </Row>
                </>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <h5 className="mb-3">Thông tin cá nhân</h5>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="lastName">
                        <Form.Label>Họ</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="lastName" 
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="firstName">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control 
                          type="text" 
                          name="firstName" 
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="dateOfBirth">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Form.Control 
                          type="date" 
                          name="dob" 
                          value={formData.dob}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                          type="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="phone">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control 
                          type="tel" 
                          name="phoneNumber" 
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="address" 
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <Button 
                      variant="secondary" 
                      className="me-2" 
                      onClick={() => setEditMode(false)}
                    >
                      Hủy
                    </Button>
                    <Button variant="primary" type="submit">
                      Lưu thay đổi
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        {/* Tab lịch sử tư vấn */}
        <Tab eventKey="history" title={<span><i className="bi bi-clipboard2-pulse me-2"></i>Lịch sử tư vấn</span>}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Lịch sử tư vấn</h5>
              
              {Array.isArray(member.consultationHistory) && member.consultationHistory.length > 0 ? (
                <ListGroup>
                  {(member.consultationHistory || []).map((record) => (
                    <ListGroup.Item key={record.id} className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <h6 className="mb-0">
                          <i className="bi bi-calendar3 me-2"></i>
                          {new Date(record.date).toLocaleDateString('vi-VN')}
                        </h6>
                        <Badge bg="info" className="ms-3">{record.mentorName}</Badge>
                      </div>
                      <Row>
                        <Col md={3} className="fw-bold">Chủ đề tư vấn:</Col>
                        <Col md={9}>{record.topic}</Col>
                      </Row>
                      <Row>
                        <Col md={3} className="fw-bold">Nội dung tư vấn:</Col>
                        <Col md={9}>{record.content}</Col>
                      </Row>
                      {record.notes && (
                        <Row>
                          <Col md={3} className="fw-bold">Ghi chú:</Col>
                          <Col md={9}>{record.notes}</Col>
                        </Row>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-clipboard-x" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                  <p className="mt-3">Chưa có lịch sử tư vấn nào.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        {/* Tab bảo mật */}
        <Tab eventKey="security" title={<span><i className="bi bi-shield-lock me-2"></i>Bảo mật</span>}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Đổi mật khẩu</h5>
              
              <Form>
                <Form.Group className="mb-3" controlId="currentPassword">
                  <Form.Label>Mật khẩu hiện tại</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Nhập mật khẩu mới"
                  />
                  <Form.Text className="text-muted">
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-end mt-4">
                  <Button variant="primary" type="submit">
                    Cập nhật mật khẩu
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default MemberProfile;