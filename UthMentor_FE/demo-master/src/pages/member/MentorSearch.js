import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Spinner } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { mentorAPI, fieldAPI } from '../../services/api';

function MentorSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [searchParams] = useSearchParams();

  // Load danh sách lĩnh vực từ backend
useEffect(() => {
  const loadFields = async () => {
    try {
      const response = await fieldAPI.getAll();
      setFields(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách lĩnh vực:", error);
      // Fallback nếu không load được từ backend
      setFields([
        { id: 1, name: 'Công nghệ thông tin' },
        { id: 2, name: 'Kinh doanh' },
        { id: 3, name: 'Marketing' },
        { id: 4, name: 'Thiết kế' },
        { id: 5, name: 'Giáo dục' },
      ]);
    }
  };
  
  loadFields();
}, []);

// Đọc tham số lĩnh vực từ URL và tự động tìm kiếm
useEffect(() => {
  const fieldFromUrl = searchParams.get('field');
  if (fieldFromUrl && fields.length > 0) {
    // Tìm lĩnh vực tương ứng với tên
    const field = fields.find(f => f.name === fieldFromUrl);
    if (field) {
      setSelectedField(field.name);
    }
  }
}, [searchParams, fields]);

// Tự động tìm kiếm khi selectedField thay đổi
useEffect(() => {
  if (selectedField && searchParams.get('field')) {
    handleSearch();
  }
}, [selectedField]);

// Tự động load tất cả mentor khi vào trang lần đầu
useEffect(() => {
  handleSearch();
  // eslint-disable-next-line
}, []);

const handleSearch = async (e = null) => {
  if (e) e.preventDefault();
  setLoading(true);

  try {
    let response;
    if (!searchTerm.trim() && !selectedField) {
      // Không có filter, lấy tất cả mentor
      response = await mentorAPI.getAll();
    } else {
      // Có filter, tìm kiếm
      response = await mentorAPI.search({
        name: searchTerm?.trim() || "",
        field: selectedField || "",
        page: 0,
      });
    }
    setMentors(response.data);
  } catch (error) {
    console.error("Lỗi khi tìm mentor:", error);
    setMentors([]);
  } finally {
    setLoading(false);
  }
};


  return (
    <Container className="py-5">
      <h2>Tìm kiếm mentor</h2>

      {searchParams.get('field') && (
        <div className="alert alert-info mb-4 d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-info-circle me-2"></i>
            Đang hiển thị mentor lĩnh vực: <strong>{searchParams.get('field')}</strong>
          </div>
          <Link to="/mentors" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-x-circle me-1"></i>
            Xóa bộ lọc
          </Link>
        </div>
      )}
      
      <Form onSubmit={handleSearch} className="my-4">
        <Row>
          <Col md={6} className="mb-3">
            <Form.Control
              type="text"
              placeholder="Nhập tên mentor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={4} className="mb-3">
            <Form.Select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
            <option value="">Tất cả lĩnh vực</option> {/* gửi rỗng */}
            {fields.map((field) => (
              <option key={field.id} value={field.name}>
                {field.name}
              </option>
            ))}
            </Form.Select>

          </Col>
          <Col md={2} className="mb-3">
            <Button variant="primary" type="submit" className="w-100">
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-2">Đang tìm kiếm mentor...</p>
        </div>
      ) : (
        <Row>
          {mentors.length > 0 ? (
            mentors.map((mentor) => (
              <Col md={4} className="mb-4" key={mentor.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={mentor.imageUrl || 'https://via.placeholder.com/400x200'}
                    style={{ height: '200px', objectFit: 'cover', objectPosition: 'top center' }}
                  />
                  <Card.Body>
                    <Card.Title>
                      {mentor.fullName}
                    </Card.Title>

                    <div className="mb-2">
                      {mentor.field?.name && (
                        <Badge bg="info" className="me-1">
                          {mentor.field.name}
                        </Badge>
                      )}
                    </div>

                    <Card.Text>
                      {mentor.rating > 0 ? (
                        <>
                          <i className="bi bi-star-fill me-2 text-warning"></i> {mentor.rating}/5.0<br />
                        </>
                      ) : (
                        <>
                          <i className="bi bi-star me-2 text-muted"></i> Chưa có đánh giá<br />
                        </>
                      )}
                      {mentor.fee && (
                        <strong>
                          <i className="bi bi-cash me-2"></i> {mentor.fee.toLocaleString('vi-VN')}đ / lần tư vấn
                        </strong>
                      )}
                    </Card.Text>

                    <Link to={`/mentors/${mentor.id}`} className="btn btn-primary w-100">
                      Xem chi tiết
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <div className="text-center py-5">
                <i className="bi bi-search" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3">Không tìm thấy mentor phù hợp. Vui lòng thử từ khóa khác.</p>
              </div>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
}



export default MentorSearch;
