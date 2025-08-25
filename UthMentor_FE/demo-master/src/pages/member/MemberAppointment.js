"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap"
import { appointmentAPI } from "../../services/api"

const MemberAppointment = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentAPI.getMyAppointments()
        setAppointments(response.data || [])
      } catch (error) {
        console.error("Error fetching appointments:", error)
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { variant: "warning", text: "Chờ xác nhận" },
      APPROVED: { variant: "success", text: "Đã xác nhận" },
      COMPLETED: { variant: "info", text: "Hoàn thành" },
      CANCELLED: { variant: "danger", text: "Đã hủy" },
      REJECTED: { variant: "secondary", text: "Đã từ chối" },
    }

    const statusInfo = statusMap[status] || { variant: "secondary", text: status }
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Lịch tư vấn của tôi</h2>

          {appointments.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <i className="bi bi-calendar-x text-muted" style={{ fontSize: "3rem" }}></i>
                <h5 className="mt-3">Chưa có lịch tư vấn nào</h5>
                <p className="text-muted">Bạn chưa đặt lịch tư vấn nào. Hãy tìm mentor và đặt lịch ngay!</p>
                <Button variant="primary" href="/mentors">
                  Tìm Mentor
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {appointments.map((appointment) => (
                <Col md={6} lg={4} key={appointment.id} className="mb-4">
                  <Card>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="card-title mb-0">{appointment.mentorName}</h6>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <p className="text-muted small mb-2">
                        <i className="bi bi-calendar me-2"></i>
                        {new Date(appointment.appointmentDate).toLocaleDateString("vi-VN")}
                      </p>

                      <p className="text-muted small mb-2">
                        <i className="bi bi-clock me-2"></i>
                        {appointment.appointmentTime}
                      </p>

                      <p className="text-muted small mb-3">
                        <i className="bi bi-building me-2"></i>
                        {appointment.fieldName || appointment.mentorSpecialty}
                      </p>

                      {appointment.note && (
                        <p className="small mb-3">
                          <strong>Ghi chú:</strong> {appointment.note}
                        </p>
                      )}

                      <div className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary">
                          Chi tiết
                        </Button>
                        {appointment.status === "PENDING" && (
                          <Button size="sm" variant="outline-danger">
                            Hủy lịch
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default MemberAppointment

