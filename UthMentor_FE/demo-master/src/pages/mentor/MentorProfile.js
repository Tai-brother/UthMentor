"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, Badge, ListGroup } from "react-bootstrap"
import { mentorAPI } from "../../services/api"

const MentorProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialty: "",
    address: "",
    description: "",
    Fee: 0,
    dob: ""
  })

  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [availabilityInputs, setAvailabilityInputs] = useState([])

  const weekdays = [
    { value: "monday", label: "Thứ 2" },
    { value: "tuesday", label: "Thứ 3" },
    { value: "wednesday", label: "Thứ 4" },
    { value: "thursday", label: "Thứ 5" },
    { value: "friday", label: "Thứ 6" },
    { value: "saturday", label: "Thứ 7" },
    { value: "sunday", label: "Chủ nhật" },
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await mentorAPI.getProfile()
        const data = response.data

        setMentor(data)
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          specialty: data.specialty || "",
          address: data.address || "",
          description: data.description || "",
          Fee: data.fee || 0,
          dob: data.dob || ""
        })

        setAvailabilityInputs(data.availability || [])
      } catch (error) {
        console.error("Lỗi khi tải thông tin hồ sơ:", error)
        setErrorMessage("Không thể tải hồ sơ mentor từ máy chủ.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])



  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...availabilityInputs]
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: value,
    }
    setAvailabilityInputs(newAvailability)
  }

  const addAvailabilitySlot = () => {
    setAvailabilityInputs([...availabilityInputs, { day: "monday", start: "08:00", end: "12:00" }])
  }

  const removeAvailabilitySlot = (index) => {
    const newAvailability = availabilityInputs.filter((_, i) => i !== index)
    setAvailabilityInputs(newAvailability)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage("")
    setErrorMessage("")

    try {
      // Update mentor data with form data
      const updatedMentor = {
        ...mentor,
        firstName: formData.firstName,
        lastName: formData.lastName,
        title: formData.title,
        email: formData.email,
        phone: formData.phoneNumber,
        specialties: formData.specialties.split(",").map((s) => s.trim()),
        hospital: formData.hospital,
        address: formData.address,
        experience: formData.experience,
        bio: formData.bio,
        consultationFee: formData.consultationFee,
        availability: availabilityInputs,
      }

      setMentor(updatedMentor)
      setSuccessMessage("Cập nhật thông tin thành công!")
      setEditMode(false)

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (error) {
      setErrorMessage("Đã có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.")
    }
  }

  const translateDay = (day) => {
    const dayMap = {
      monday: "Thứ 2",
      tuesday: "Thứ 3",
      wednesday: "Thứ 4",
      thursday: "Thứ 5",
      friday: "Thứ 6",
      saturday: "Thứ 7",
      sunday: "Chủ nhật",
    }
    return dayMap[day] || day
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải thông tin mentor...</p>
      </Container>
    )
  }
  if (!mentor) {
  return (
    <Container className="py-5 text-center">
      <Alert variant="danger">Không thể hiển thị thông tin mentor.</Alert>
    </Container>
  )
  }
  return (
    <Container className="py-5">
      <h2 className="mb-4">Hồ sơ Mentor</h2>

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

      <Row className="mb-4">
        <Col md={3} className="text-center mb-3 mb-md-0">
          <Card className="border-0">
            <Card.Body>
              <img
                src={mentor.profilePicture || mentor.imageUrl || mentor.avatar || "/placeholder.svg?height=200&width=200"}
                alt={`${mentor.firstName} ${mentor.lastName}`}
                className="rounded-circle img-thumbnail"
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
                onError={(e) => {
                  if (!e.target.src.includes('/placeholder.svg')) {
                    e.target.src = "/placeholder.svg?height=200&width=200"
                  }
                }}
              />
              <div className="mt-3">
                <h4>
                  {mentor.title} {mentor.firstName} {mentor.lastName}
                </h4>
                <div className="mb-2">
                  {(mentor.specialties || []).map((specialty, index) => (
                    <Badge bg="info" className="me-1" key={index}>
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <p className="mb-1">
                  <i className="bi bi-building me-2"></i>
                  {mentor.fieldName || mentor.hospital}
                </p>
                <p className="mb-1">
                  {mentor.rating > 0 ? (
                    <>
                      <i className="bi bi-star-fill text-warning me-2"></i>
                      {mentor.rating}/5.0
                    </>
                  ) : (
                    <>
                      <i className="bi bi-star text-muted me-2"></i>
                      Chưa có đánh giá
                    </>
                  )}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Tabs defaultActiveKey="personal" className="mb-3">
            {/* Tab thông tin cá nhân */}
            <Tab
              eventKey="personal"
              title={
                <span>
                  <i className="bi bi-person me-2"></i>Thông tin cá nhân
                </span>
              }
            >
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
                        <Col md={3} className="fw-bold">
                          Họ và tên:
                        </Col>
                        <Col md={9}>
                          {mentor.lastName} {mentor.firstName}
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={3} className="fw-bold">
                          Chuyên môn:
                        </Col>
                        <Col md={9}>{mentor.specialtyName || mentor.specialty || 'Chưa cập nhật'}</Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={3} className="fw-bold">
                          Email:
                        </Col>
                        <Col md={9}>{mentor.email}</Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={3} className="fw-bold">
                          Số điện thoại:
                        </Col>
                        <Col md={9}>{mentor.phoneNumber || 'Chưa cập nhật'}</Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={3} className="fw-bold">
                          Ngày sinh:
                        </Col>
                        <Col md={9}>{mentor.dob ? (new Date(mentor.dob).toString() !== 'Invalid Date' ? new Date(mentor.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật') : 'Chưa cập nhật'}</Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={3} className="fw-bold">
                          Địa chỉ:
                        </Col>
                        <Col md={9}>{mentor.address}</Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={3} className="fw-bold">
                          Phí tư vấn:
                        </Col>
                        <Col md={9}>{mentor.fee ? mentor.fee.toLocaleString("vi-VN") + "đ" : "Chưa cập nhật"}</Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={3} className="fw-bold">
                          Giới thiệu:
                        </Col>
                        <Col md={9}>{mentor.description || 'Chưa cập nhật'}</Col>
                      </Row>
                    </>
                  ) : (
                    <Form onSubmit={handleSubmit}>
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

                      <Form.Group className="mb-3" controlId="specialties">
                        <Form.Label>Chuyên môn (ngăn cách bởi dấu phẩy)</Form.Label>
                        <Form.Control
                          type="text"
                          name="specialties"
                          value={formData.specialties}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

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
                          <Form.Group controlId="phoneNumber">
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

                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group controlId="dob">
                            <Form.Label>Ngày sinh</Form.Label>
                            <Form.Control
                              type="date"
                              name="dob"
                              value={formData.dob}
                              onChange={handleChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="address">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group controlId="experience">
                            <Form.Label>Số năm kinh nghiệm</Form.Label>
                            <Form.Control
                              type="number"
                              name="experience"
                              value={formData.experience}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="consultationFee">
                            <Form.Label>Phí tư vấn (VND)</Form.Label>
                            <Form.Control
                              type="number"
                              name="consultationFee"
                              value={formData.consultationFee}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3" controlId="bio">
                        <Form.Label>Giới thiệu</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" className="me-2" onClick={() => setEditMode(false)}>
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

            {/* Tab lịch làm việc */}
            <Tab
              eventKey="availability"
              title={
                <span>
                  <i className="bi bi-calendar3 me-2"></i>Lịch tư vấn
                </span>
              }
            >
              <Card className="shadow-sm">
                <Card.Body>
                  {!editMode ? (
                    <>
                      <div className="d-flex justify-content-end mb-3">
                        <Button variant="outline-primary" onClick={() => setEditMode(true)}>
                          <i className="bi bi-pencil me-2"></i> Chỉnh sửa
                        </Button>
                      </div>

                      <h5 className="mb-3">Lịch tư vấn hiện tại</h5>

                      <ListGroup className="mb-4">
                        {(mentor.availability || []).map((slot, index) => (
                          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                            <div>
                              <i className="bi bi-calendar-day me-2"></i>
                              <strong>{translateDay(slot.day)}</strong>: {slot.start} - {slot.end}
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                  ) : (
                    <Form onSubmit={handleSubmit}>
                      <h5 className="mb-3">Lịch tư vấn</h5>

                      {availabilityInputs.map((slot, index) => (
                        <Row key={index} className="mb-3 align-items-end">
                          <Col md={4}>
                            <Form.Group controlId={`day-${index}`}>
                              <Form.Label>Ngày trong tuần</Form.Label>
                              <Form.Select
                                value={slot.day}
                                onChange={(e) => handleAvailabilityChange(index, "day", e.target.value)}
                              >
                                {weekdays.map((day) => (
                                  <option key={day.value} value={day.value}>
                                    {day.label}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group controlId={`start-${index}`}>
                              <Form.Label>Giờ bắt đầu</Form.Label>
                              <Form.Control
                                type="time"
                                value={slot.start}
                                onChange={(e) => handleAvailabilityChange(index, "start", e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group controlId={`end-${index}`}>
                              <Form.Label>Giờ kết thúc</Form.Label>
                              <Form.Control
                                type="time"
                                value={slot.end}
                                onChange={(e) => handleAvailabilityChange(index, "end", e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={2}>
                            <Button
                              variant="outline-danger"
                              onClick={() => removeAvailabilitySlot(index)}
                              className="w-100"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </Col>
                        </Row>
                      ))}

                      <div className="mb-4">
                        <Button variant="outline-success" onClick={addAvailabilitySlot} className="w-100">
                          <i className="bi bi-plus-circle me-2"></i> Thêm khung giờ
                        </Button>
                      </div>

                      <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" className="me-2" onClick={() => setEditMode(false)}>
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

            {/* Tab bảo mật */}
            <Tab
              eventKey="security"
              title={
                <span>
                  <i className="bi bi-shield-lock me-2"></i>Bảo mật
                </span>
              }
            >
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="mb-4">Đổi mật khẩu</h5>

                  <Form>
                    <Form.Group className="mb-3" controlId="currentPassword">
                      <Form.Label>Mật khẩu hiện tại</Form.Label>
                      <Form.Control type="password" placeholder="Nhập mật khẩu hiện tại" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="newPassword">
                      <Form.Label>Mật khẩu mới</Form.Label>
                      <Form.Control type="password" placeholder="Nhập mật khẩu mới" />
                      <Form.Text className="text-muted">
                        Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                      <Form.Control type="password" placeholder="Nhập lại mật khẩu mới" />
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
        </Col>
      </Row>
    </Container>
  )
}

export default MentorProfile
