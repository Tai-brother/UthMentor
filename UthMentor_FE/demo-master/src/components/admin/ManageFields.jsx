import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Alert, Spinner, Modal, Row, Col } from 'react-bootstrap';
import { fieldAPI } from '../../services/api';

const ManageFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Load fields on component mount
  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      const response = await fieldAPI.getAll();
      setFields(response.data);
    } catch (err) {
      console.error('Error loading fields:', err);
      setError('Không thể tải danh sách lĩnh vực. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingField) {
        // Update existing field
        await fieldAPI.update(editingField.id, formData);
        setSuccess('Cập nhật lĩnh vực thành công!');
      } else {
        // Create new field
        await fieldAPI.create(formData.name, formData.description);
        setSuccess('Tạo lĩnh vực mới thành công!');
      }
      
      // Reset form and reload fields
      setFormData({ name: '', description: '' });
      setEditingField(null);
      setShowModal(false);
      loadFields();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving field:', err);
      setError('Không thể lưu lĩnh vực. Vui lòng thử lại.');
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      description: field.description
    });
    setShowModal(true);
  };

  const handleDelete = async (fieldId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lĩnh vực này?')) {
      try {
        await fieldAPI.delete(fieldId);
        setSuccess('Xóa lĩnh vực thành công!');
        loadFields();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error('Error deleting field:', err);
        setError('Không thể xóa lĩnh vực. Vui lòng thử lại.');
      }
    }
  };

  const openCreateModal = () => {
    setEditingField(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingField(null);
    setFormData({ name: '', description: '' });
    setError(null);
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-2">Đang tải danh sách lĩnh vực...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý Lĩnh vực</h2>
        <Button variant="primary" onClick={openCreateModal}>
          <i className="bi bi-plus-circle me-2"></i>
          Thêm lĩnh vực mới
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <Card.Body>
          {fields.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-folder text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3 text-muted">Chưa có lĩnh vực nào được tạo.</p>
              <Button variant="outline-primary" onClick={openCreateModal}>
                Tạo lĩnh vực đầu tiên
              </Button>
            </div>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên lĩnh vực</th>
                  <th>Mô tả</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {fields.map(field => (
                  <tr key={field.id}>
                    <td>{field.id}</td>
                    <td>
                      <strong>{field.name}</strong>
                    </td>
                    <td>{field.description || 'Không có mô tả'}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(field)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(field.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal for creating/editing fields */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingField ? 'Chỉnh sửa lĩnh vực' : 'Thêm lĩnh vực mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên lĩnh vực *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên lĩnh vực..."
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về lĩnh vực..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingField ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageFields;