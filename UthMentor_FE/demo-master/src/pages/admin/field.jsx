import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

function DepartmentManager() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:8080/department/get-all', config);
      setDepartments(response.data);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải danh sách khoa.');
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setError('');
    setSuccess('');
    if (!name.trim()) {
      setError('Vui lòng nhập tên khoa.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:8080/department/createDepartment', {
        name: name.trim(),
        description: description.trim(),
      }, config);
      setSuccess('Đã thêm khoa mới thành công.');
      setName('');
      setDescription('');
      fetchDepartments();
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Khoa đã tồn tại hoặc dữ liệu không hợp lệ.');
      } else {
        setError('Đã xảy ra lỗi khi thêm khoa.');
      }
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <Container className="py-5">
      <h2 className="mb-4">Quản lý Khoa</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Row>
          <Col md={6}>
            <h4>Danh sách khoa</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên khoa</th>
                  <th>Mô tả</th>
                </tr>
              </thead>
              <tbody>
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">Chưa có khoa nào.</td>
                  </tr>
                ) : (
                  departments.map((dept, index) => (
                    <tr key={dept.id}>
                      <td>{index + 1}</td>
                      <td>{dept.name}</td>
                      <td>{dept.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <h4>Thêm khoa mới</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Tên khoa</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên khoa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleCreate}>
                Thêm khoa
              </Button>
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default DepartmentManager;