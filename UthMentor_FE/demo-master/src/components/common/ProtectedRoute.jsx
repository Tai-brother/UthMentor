"use client"

import { useAuth } from "../../context/AuthContext"
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, hasRole } = useAuth()

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Đang tải thông tin người dùng...</p>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="warning" className="text-center p-4">
              <h5 className="mb-3">⚠️ Truy cập bị giới hạn</h5>
              <p>Vui lòng <strong>đăng nhập</strong> để truy cập trang này.</p>
            </Alert>
          </Col>
        </Row>
      </Container>
    )
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => hasRole(role))
    if (!hasAllowedRole) {
      return (
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6}>
              <Alert variant="danger" className="text-center p-4">
                <h5 className="mb-3">🚫 Không có quyền truy cập</h5>
                <p>Tài khoản của bạn không đủ quyền để xem trang này.</p>
                <p className="small text-muted">
                  Yêu cầu quyền: {allowedRoles.join(', ')}
                </p>
              </Alert>
            </Col>
          </Row>
        </Container>
      )
    }
  }

  return children
}

export default ProtectedRoute
