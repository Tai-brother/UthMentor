import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaGraduationCap, FaClock, FaMoneyBill, FaImage, FaFileAlt } from 'react-icons/fa';
import mentorRequestAPI from '../../services/mentorRequestApi';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const BecomeMentor = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    imageFile: null,
    daysOfWeek: [],
    field: '',
    fee: '',
    description: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fields, setFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(true);

  const daysOfWeek = [
    { value: 'MONDAY', label: 'Thứ 2' },
    { value: 'TUESDAY', label: 'Thứ 3' },
    { value: 'WEDNESDAY', label: 'Thứ 4' },
    { value: 'THURSDAY', label: 'Thứ 5' },
    { value: 'FRIDAY', label: 'Thứ 6' },
    { value: 'SATURDAY', label: 'Thứ 7' },
    { value: 'SUNDAY', label: 'Chủ nhật' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      imageFile: file
    });
  };

  const handleDaysChange = (dayValue) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayValue)
        ? prev.daysOfWeek.filter(day => day !== dayValue)
        : [...prev.daysOfWeek, dayValue]
    }));
  };

  // Fetch fields from backend
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
        const response = await axios.get(`${API_BASE_URL}/field/get-all`);
        setFields(response.data);
      } catch (error) {
        console.error('Error fetching fields:', error);
        // Fallback fields nếu API không hoạt động
        setFields([
          { id: 1, name: 'Công nghệ thông tin' },
          { id: 2, name: 'Kinh doanh & Marketing' },
          { id: 3, name: 'Tài chính & Kế toán' },
          { id: 4, name: 'Y tế & Sức khỏe' },
          { id: 5, name: 'Giáo dục & Đào tạo' },
          { id: 6, name: 'Nghệ thuật & Thiết kế' },
          { id: 7, name: 'Kỹ thuật & Xây dựng' },
          { id: 8, name: 'Luật & Chính sách' },
          { id: 9, name: 'Khác' }
        ]);
      } finally {
        setLoadingFields(false);
      }
    };

    fetchFields();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra đăng nhập
    if (!currentUser) {
      setAlertType('danger');
      setAlertMessage('Vui lòng đăng nhập để gửi yêu cầu trở thành mentor.');
      setShowAlert(true);
      return;
    }
    
    // Validate form
    if (!formData.startTime || !formData.endTime || !formData.field || formData.daysOfWeek.length === 0) {
      setAlertType('danger');
      setAlertMessage('Vui lòng điền đầy đủ thông tin bắt buộc.');
      setShowAlert(true);
      return;
    }

    // Validate time
    if (formData.startTime >= formData.endTime) {
      setAlertType('danger');
      setAlertMessage('Giờ kết thúc phải sau giờ bắt đầu.');
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await mentorRequestAPI.create(formData);
      
      setAlertType('success');
      setAlertMessage('Gửi yêu cầu thành công! Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.');
      setShowAlert(true);
      
      // Reset form
      setFormData({
        startTime: '',
        endTime: '',
        imageFile: null,
        daysOfWeek: [],
        field: '',
        fee: '',
        description: ''
      });

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }

      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting mentor request:', error);
      setAlertType('danger');
      setAlertMessage('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="become-mentor-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="border-2 shadow-lg" style={{borderColor: '#1EA599'}}>
              <Card.Header className="text-white text-center py-4" style={{backgroundColor: '#1EA599'}}>
                <h2 className="mb-0">
                  <FaGraduationCap className="me-3" />
                  Đăng ký trở thành Mentor
                </h2>
                <p className="mb-0 mt-2">Vui lòng điền thông tin bên dưới</p>
              </Card.Header>
              
              <Card.Body className="p-5">
                {showAlert && (
                  <Alert variant={alertType} onClose={() => setShowAlert(false)} dismissible className="mb-4">
                    {alertMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          <FaClock className="me-2" style={{color: '#1EA599'}} />
                          Giờ bắt đầu *
                        </Form.Label>
                        <Form.Control
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          required
                          style={{borderColor: '#1EA599'}}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          <FaClock className="me-2" style={{color: '#1EA599'}} />
                          Giờ kết thúc *
                        </Form.Label>
                        <Form.Control
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                          <FaImage className="me-2" style={{color: '#1EA599'}} />
                          Hình ảnh
                        </Form.Label>
                    <Form.Control
                      type="file"
                      name="imageFile"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="form-control-file"
                    />
                    <Form.Text className="text-muted">
                      Chọn file hình ảnh (JPG, PNG, GIF...)
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                          <FaClock className="me-2" style={{color: '#1EA599'}} />
                          Ngày trong tuần có thể làm việc *
                        </Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <Form.Check
                          key={day.value}
                          type="checkbox"
                          id={`day-${day.value}`}
                          label={day.label}
                          checked={formData.daysOfWeek.includes(day.value)}
                          onChange={() => handleDaysChange(day.value)}
                          className="me-3"
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                          <FaGraduationCap className="me-2" style={{color: '#1EA599'}} />
                          Lĩnh vực chuyên môn *
                        </Form.Label>
                    <Form.Select
                      name="field"
                      value={formData.field}
                      onChange={handleChange}
                      required
                      disabled={loadingFields}
                    >
                      <option value="">{loadingFields ? 'Đang tải...' : 'Chọn lĩnh vực'}</option>
                      {fields.map((field) => (
                        <option key={field.id} value={field.id}>{field.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                          <FaMoneyBill className="me-2" style={{color: '#1EA599'}} />
                          Phí tư vấn (VNĐ/giờ)
                        </Form.Label>
                    <Form.Control
                      type="number"
                      name="fee"
                      value={formData.fee}
                      onChange={handleChange}
                      placeholder="Ví dụ: 500000"
                      min="0"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">
                          <FaFileAlt className="me-2" style={{color: '#1EA599'}} />
                          Mô tả
                        </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Mô tả về kinh nghiệm, chuyên môn, lý do muốn trở thành mentor..."
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="px-5"
                      disabled={isSubmitting}
                      style={{backgroundColor: '#1EA599', borderColor: '#1EA599'}}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <FaGraduationCap className="me-2" />
                          Gửi yêu cầu
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BecomeMentor;
