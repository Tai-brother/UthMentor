import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope, FaFacebook, FaYoutube, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const hospitalLocations = [
    {
      id: 1,
      name: 'UthMentor - Cơ sở Long Biên',
      address: '108 Phố Hoàng Như Tiếp, P. Bồ Đề, Q. Long Biên, Hà Nội',
      phone: '024 3872 1234',
      email: 'longbien@uthmentor.vn',
      hours: 'Thứ 2 - Chủ nhật: 7:00 - 20:00',
      services: [],
      isMain: true
    },
    {
      id: 2,
      name: 'UthMentor - Cơ sở Hà Đông',
      address: '28 Phố Quang Trung, P. Quang Trung, Q. Hà Đông, Hà Nội',
      phone: '024 3355 6789',
      email: 'hadong@uthmentor.vn',
      hours: 'Thứ 2 - Thứ 7: 7:30 - 19:30',
      services: [],
      isMain: false
    },
    {
      id: 3,
      name: 'UthMentor - Cơ sở TP.HCM',
      address: '316C Phạm Hùng, P. 5, Q. 8, TP. Hồ Chí Minh',
      phone: '028 3999 8888',
      email: 'hcm@uthmentor.vn',
      hours: 'Thứ 2 - Chủ nhật: 6:30 - 21:00',
      services: [],
      isMain: false
    }
  ];

  const contactReasons = [
    'Đặt lịch khám bệnh',
    'Hỏi về dịch vụ y tế',
    'Khiếu nại/Góp ý',
    'Hợp tác kinh doanh',
    'Báo chí/Truyền thông',
    'Khác'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setAlertType('danger');
      setAlertMessage('Vui lòng điền đầy đủ thông tin bắt buộc.');
      setShowAlert(true);
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      setAlertType('success');
      setAlertMessage('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
      setShowAlert(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }, 1000);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center">
              <h1 className="hero-title">LIÊN HỆ VỚI CHÚNG TÔI</h1>
              <p className="hero-subtitle">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với UthMentor 
                để được tư vấn tốt nhất.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Contact Information */}
      <section className="feature-section">
        <Container>
          <h2 className="section-title">THÔNG TIN LIÊN HỆ</h2>
          
          <Row>
            {hospitalLocations.map((location) => (
              <Col lg={4} md={6} className="mb-4" key={location.id}>
                <Card className={`h-100 shadow-sm border-0 ${location.isMain ? 'border-primary' : ''}`}>
                  {location.isMain && (
                    <div className="bg-primary text-white text-center py-2">
                      <small><strong>CƠ SỞ CHÍNH</strong></small>
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title className="h5 mb-3">{location.name}</Card.Title>
                    
                    <div className="mb-3">
                      <p className="mb-2">
                        <FaMapMarkerAlt className="text-primary me-2" />
                        {location.address}
                      </p>
                      <p className="mb-2">
                        <FaPhone className="text-primary me-2" />
                        <a href={`tel:${location.phone}`} className="text-decoration-none">
                          {location.phone}
                        </a>
                      </p>
                      <p className="mb-2">
                        <FaEnvelope className="text-primary me-2" />
                        <a href={`mailto:${location.email}`} className="text-decoration-none">
                          {location.email}
                        </a>
                      </p>
                      <p className="mb-3">
                        <FaClock className="text-primary me-2" />
                        {location.hours}
                      </p>
                    </div>
                    
                    <div>
                      <h6 className="mb-2">Dịch vụ:</h6>
                      <ul className="list-unstyled">
                        {location.services.map((service, index) => (
                          <li key={index} className="mb-1">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="shadow border-0">
                <Card.Body className="p-5">
                  <h3 className="text-center mb-4">GỬI TIN NHẮN CHO CHÚNG TÔI</h3>
                  
                  {showAlert && (
                    <Alert variant={alertType} className="mb-4">
                      {alertMessage}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên của bạn"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email của bạn"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Số điện thoại</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Lý do liên hệ</Form.Label>
                          <Form.Select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                          >
                            <option value="">Chọn lý do liên hệ</option>
                            {contactReasons.map((reason, index) => (
                              <option key={index} value={reason}>{reason}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Nội dung tin nhắn <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Nhập nội dung tin nhắn của bạn"
                        required
                      />
                    </Form.Group>
                    
                    <div className="text-center">
                      <Button type="submit" variant="primary" size="lg">
                        <i className="bi bi-send me-2"></i>
                        Gửi tin nhắn
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Emergency Contact */}
      <section className="feature-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <Card className="border-danger shadow">
                <Card.Body className="p-4">
                  <h3 className="text-danger mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    LIÊN HỆ KHẨN CẤP
                  </h3>
                  <p className="lead mb-3">
                    Trong trường hợp khẩn cấp, vui lòng gọi ngay:
                  </p>
                  <h2 className="text-danger mb-3">
                    <FaPhone className="me-2" />
                    <a href="tel:1900-1080" className="text-decoration-none text-danger">
                      1900 1080
                    </a>
                  </h2>
                  <p className="text-muted">
                    Đường dây nóng 24/7 - Luôn sẵn sàng hỗ trợ bạn
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Social Media */}
      <section className="stats-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
              <p className="lead mt-3 mb-4">
                Theo dõi UthMentor trên các mạng xã hội để cập nhật tin tức mới nhất
              </p>
              
              <div className="d-flex justify-content-center gap-3">
                <a href="#" className="btn btn-outline-primary btn-lg">
                  <FaFacebook className="me-2" />
                  Facebook
                </a>
                <a href="#" className="btn btn-outline-danger btn-lg">
                  <FaYoutube className="me-2" />
                  YouTube
                </a>
                <a href="#" className="btn btn-outline-info btn-lg">
                  <FaTwitter className="me-2" />
                  Twitter
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;