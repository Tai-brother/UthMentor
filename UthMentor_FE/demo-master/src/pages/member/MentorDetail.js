"use client"

import { useState, useEffect, useRef } from "react"
import { Container, Row, Col, Card, Button, Badge, Tab, Tabs, Spinner, Alert } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { getMentorById, reviewAPI, fieldAPI } from "../../services/api"

function MentorDetails() {
  const { id } = useParams()
  const [mentor, setMentor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fieldDescriptions, setFieldDescriptions] = useState({})

  // Use ref to prevent duplicate API calls
  const hasFetched = useRef(false)
  const effectCleanedUp = useRef(false)

useEffect(() => {
  let isMounted = true;

  const loadMentorData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading mentor with ID:", id);

      // Load fields first to get descriptions
      try {
        const fieldsResponse = await fieldAPI.getAll();
        const fieldsData = fieldsResponse.data || [];
        const descriptions = {};
        fieldsData.forEach(field => {
          descriptions[field.name] = field.description;
        });
        setFieldDescriptions(descriptions);
      } catch (fieldError) {
        console.error("Error loading fields:", fieldError);
      }

      const mentorResponse = await getMentorById(id);
      if (!isMounted) return;

      const mentorData = mentorResponse.data;
      console.log("Mentor data:", mentorData);

      const transformedMentor = {
        id: mentorData.id,
        fullName: mentorData.fullName,
        field: mentorData.field,
        email: mentorData.email,
        imageUrl: mentorData.imageUrl,
        fee: mentorData.fee || 0,
        description: mentorData.description,
        role: mentorData.role || "Mentor",
        experience: mentorData.experience || 5,
        rating: mentorData.rating !== null && mentorData.rating !== undefined ? mentorData.rating : 0,
        hospital: mentorData.field?.name || mentorData.hospital || "Trung tâm tư vấn",
        address: mentorData.field?.address || mentorData.address || "Địa chỉ trung tâm",
      };

      setMentor(transformedMentor);
      await loadReviews(id, isMounted);
    } catch (err) {
      console.error("Error loading mentor:", err);
      let errorMessage = "Không thể tải thông tin mentor.";

      if (err.code === "ERR_NETWORK") {
        errorMessage = "Không thể kết nối đến server. Backend có thể chưa được khởi động.";
      } else if (err.response?.status === 404) {
        errorMessage = "Không tìm thấy thông tin mentor.";
      } else if (err.response?.status === 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau.";
      }

      setError(errorMessage);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  loadMentorData();

  return () => {
    isMounted = false;
  };
}, [id]);


  const loadReviews = async (mentorId, isMounted) => {
    try {
      if (!isMounted) return
      setReviewsLoading(true)
      console.log("Loading reviews for mentor:", mentorId)

      const reviewsResponse = await reviewAPI.getByMentor(mentorId)

      if (!isMounted) return
      console.log("Reviews response:", reviewsResponse)

      setReviews(reviewsResponse.data || [])
    } catch (err) {
      if (!isMounted) return
      console.error("Error loading reviews:", err)
      // Don't show error for reviews, just log it
      setReviews([])
    } finally {
      if (isMounted) {
        setReviewsLoading(false)
      }
    }
  }



  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-3">Đang tải thông tin mentor...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Có lỗi xảy ra</Alert.Heading>
          <p>{error}</p>

          <hr />
          <div className="d-flex justify-content-end">
            <Button
              variant="outline-danger"
              onClick={() => {
                hasFetched.current = false
                effectCleanedUp.current = false
                window.location.reload()
              }}
            >
              Thử lại
            </Button>
            <Link to="/mentors" className="btn btn-primary ms-2">
              Quay lại danh sách mentor
            </Link>
          </div>
        </Alert>
      </Container>
    )
  }

  if (!mentor) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <Alert.Heading>Không tìm thấy thông tin mentor</Alert.Heading>
          <p>Không thể tìm thấy thông tin của mentor với ID: {id}</p>
          <Link to="/mentors" className="btn btn-primary mt-3">
            Quay lại danh sách mentor
          </Link>
        </Alert>
      </Container>
    )
  }



  return (
    <Container className="py-5">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col lg={3} className="text-center mb-4 mb-lg-0">
              <img
                src={mentor.imageUrl || "/placeholder.svg?height=180&width=180"}
                alt={mentor.fullName}
                className="rounded-circle mb-3 shadow"
                style={{ width: "180px", height: "180px", objectFit: "cover", border: "4px solid #f8f9fa" }}
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=180&width=180"
                }}
              />
              <div className="d-flex justify-content-center align-items-center">
                <div className="bg-light p-1 px-2 rounded-pill d-inline-flex align-items-center">
                  {mentor.rating > 0 ? (
                    <>
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span className="fw-bold">{mentor.rating}</span>
                      <small className="text-muted ms-1">/5.0</small>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-star text-muted me-1"></i>
                      <span className="fw-bold text-muted">Chưa có đánh giá</span>
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Col lg={9}>
              <h2>{mentor.fullName}</h2>
              <div className="mb-3">
                <Badge bg="info" className="me-2">
                  {mentor.field?.name || mentor.specialty}
                </Badge>
                <Badge bg="secondary" className="me-2">
                  {mentor.role}
                </Badge>
              </div>
              <Row className="mb-3">
                <Col md={6}>
                  <p>
                    <i className="bi bi-envelope me-2"></i> {mentor.email}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <i className="bi bi-cash me-2"></i>{" "}
                    <strong className="text-primary">{(mentor.fee || 0).toLocaleString("vi-VN")}đ / lần tư vấn</strong>
                  </p>
                </Col>
              </Row>
              <Link to={`/book-appointment/${mentor.id}`} className="btn btn-lg btn-primary">
                <i className="bi bi-calendar2-plus me-2"></i> Đặt lịch tư vấn
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Tabs defaultActiveKey="about" className="mb-4">
        <Tab eventKey="about" title="Thông tin mentor">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Giới thiệu</h4>
              <p>{mentor.description || "Chưa có thông tin mô tả về mentor."}</p>

              <h4 className="mb-3 mt-4">Thông tin chuyên môn</h4>
              <ul>
                <li>
                  <strong>Lĩnh vực:</strong> {mentor.specialty}
                </li>
                <li>
                  <strong>Vai trò:</strong> {mentor.role}
                </li>
              </ul>

              {/* Thông tin lĩnh vực */}
              {fieldDescriptions[mentor.specialty] && (
                <>
                  <h4 className="mb-3 mt-4">Thông tin lĩnh vực</h4>
                  <p>
                    <strong>Mô tả:</strong> {fieldDescriptions[mentor.specialty]}
                  </p>
                </>
              )}
            </Card.Body>
          </Card>
        </Tab>



        <Tab eventKey="reviews" title="Đánh giá">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h4 className="mb-4">Đánh giá từ thành viên</h4>

              {reviewsLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" />
                  <p className="mt-2">Đang tải đánh giá...</p>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <h5>{review.memberName || "Thành viên"}</h5>
                        <div>
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                          ))}
                          {[...Array(5 - (review.rating || 5))].map((_, i) => (
                            <i key={i} className="bi bi-star text-muted me-1"></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted small">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString("vi-VN")
                          : "Ngày không xác định"}
                      </p>
                      <p>{review.comment || review.feedback || "Không có nhận xét"}</p>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-chat-square-text text-muted" style={{ fontSize: "3rem" }}></i>
                  <p className="mt-3 text-muted">Chưa có đánh giá nào cho mentor này.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  )
}

export default MentorDetails
