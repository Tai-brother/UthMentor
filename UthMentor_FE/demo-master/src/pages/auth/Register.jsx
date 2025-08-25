import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username:'',
    email: '',
    address:'',
    dob:'',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      setFormError('Mật khẩu nhập lại không khớp');
      return;
    }
    
    // Kiểm tra độ dài mật khẩu
    if (formData.password.length < 6) {
      setFormError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    // Gọi API đăng ký
    const result = await register({
     firstName: formData.firstName,
     lastName: formData.lastName,
     username: formData.username,
     email: formData.email,
     address: formData.address,
     dob: formData.dob,
     password: formData.password,
     phoneNumber: formData.phoneNumber
    });

    
    if (result.success) {
      setSuccess(true);
      // Chuyển hướng đến trang đăng nhập sau 3 giây
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="form-container">
            <h4 className="form-title">ĐĂNG KÝ TÀI KHOẢN</h4>
            
            {formError && <Alert variant="danger">{formError}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
              <Alert variant="success">
                Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập sau một vài giây...
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Họ</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-person"></i>
                      </span>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Nhập họ của bạn"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Tên</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-person"></i>
                      </span>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Nhập tên của bạn"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
               <Form.Group className="mb-4">
                <Form.Label>Tên đăng nhập</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-person-badge"></i>
                  </span>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Nhập tên đăng nhập"
                    required
                  />
                </div>
                </Form.Group>

               <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>
              </Form.Group>
   
              <Form.Group className="mb-4">
                <Form.Label>Số điện thoại</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại của bạn"
                    required
                  />
                </div>
              </Form.Group>
              <Row>
              <Col md={6}>
               <Form.Group className="mb-4">
                <Form.Label>Địa chỉ</Form.Label>
                <div className="input-group">
                 <span className="input-group-text bg-light">
                 <i className="bi bi-geo-alt"></i>
                 </span>
               <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ của bạn"
                  required
                />
                </div>
               </Form.Group>
              </Col>
  <Col md={6}>
    <Form.Group className="mb-4">
      <Form.Label>Ngày sinh</Form.Label>
      <div className="input-group">
        <span className="input-group-text bg-light">
          <i className="bi bi-calendar"></i>
        </span>
        <Form.Control
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
      </div>
    </Form.Group>
  </Col>
</Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Mật khẩu</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock"></i>
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu của bạn"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock"></i>
                      </span>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Nhập lại mật khẩu của bạn"
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-2 mb-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || success}
                  className="py-2"
                >
                  {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
              </div>
              
              <div className="text-center">
                Bạn đã có tài khoản? <Link to="/login" className="text-decoration-none">Đăng nhập</Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;