import { Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import Logo from "../../assets/logo/logo"
import { FaPhone, FaMapMarkerAlt, FaClock, FaEnvelope, FaFacebook, FaYoutube, FaTwitter } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <div className="mb-4">
              <Logo />
            </div>
            <p>
              Hệ thống mentoring UthMentor cung cấp dịch vụ tư vấn chất lượng cao với đội ngũ mentor chuyên nghiệp
              giàu kinh nghiệm.
            </p>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5>HỆ THỐNG TRUNG TÂM</h5>
            <ul>
              <li>
                <span className="footer-link">
                  <FaMapMarkerAlt className="me-2" />
                  108 Phố Hoàng Như Tiếp, P. Bồ Đề, Q. Long Biên, Hà Nội
                </span>
              </li>
              <li>
                <span className="footer-link">
                  <FaMapMarkerAlt className="me-2" />
                  28 Phố Quang Trung, P. Quang Trung, Q. Hà Đông, Hà Nội
                </span>
              </li>
              <li>
                <span className="footer-link">
                  <FaMapMarkerAlt className="me-2" />
                  316C Phạm Hùng, P. 5, Q. 8, TP. HCM
                </span>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5>ĐƯỜNG DẪN NHANH</h5>
            <ul>
              <li>
                <button className="footer-link btn btn-link p-0">Chuyên gia - Mentor</button>
              </li>
              <li>
                <button className="footer-link btn btn-link p-0">Lịch tư vấn</button>
              </li>
              <li>
                <Link to="/become-mentor" className="footer-link btn btn-link p-0">Trở thành Mentor</Link>
              </li>
              <li>
                <button className="footer-link btn btn-link p-0">Chính sách bảo mật</button>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5>LIÊN HỆ</h5>
            <ul>
              <li className="footer-link">
                <FaPhone className="me-2" /> 1900 1080
              </li>
              <li className="footer-link">
                <FaClock className="me-2" /> Giờ làm việc: 7:00 - 20:00
              </li>
              <li className="footer-link">
                <FaEnvelope className="me-2" /> cskh@uthmentor.vn
              </li>
              <div className="mt-3 d-flex">
                <button className="me-3 text-white btn btn-link p-0" aria-label="Facebook">
                  <FaFacebook size={24} />
                </button>
                <button className="me-3 text-white btn btn-link p-0" aria-label="YouTube">
                  <FaYoutube size={24} />
                </button>
                <button className="text-white btn btn-link p-0" aria-label="Twitter">
                  <FaTwitter size={24} />
                </button>
              </div>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} UthMentor. Bảo lưu mọi quyền.</p>
          <p>Công ty cổ phần UthMentor - Số ĐKKD: 0123456789</p>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
