import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { mentorAPI, memberAPI, fieldAPI, appointmentAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMentors: 0,
    totalMembers: 0,
    totalFields: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showMentorsModal, setShowMentorsModal] = useState(false);
  const [mentorsList, setMentorsList] = useState([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [showTodayAppointmentsModal, setShowTodayAppointmentsModal] = useState(false);
  const [todayAppointmentsList, setTodayAppointmentsList] = useState([]);
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [fieldsList, setFieldsList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {


        // Lấy tổng số mentor
        const mentorsRes = await mentorAPI.getAll();
        // Lấy tổng số member
        const membersRes = await memberAPI.getAll();
        // Lấy tổng số field
        const fieldsRes = await fieldAPI.getAll();
        // Lấy tất cả lịch hẹn
        const appointmentsRes = await appointmentAPI.getAll();

        // Thống kê số lịch hẹn hôm nay
        const today = new Date().toISOString().slice(0, 10);
        const todayAppointments = appointmentsRes.data.filter(app => app.appointmentDate && app.appointmentDate.startsWith(today)).length;

        setStats({
          totalMentors: mentorsRes.data.length,
          totalMembers: membersRes.data.length,
          totalFields: fieldsRes.data.length,
          todayAppointments,

        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        setStats({
          totalMentors: 0,
          totalMembers: 0,
          totalFields: 0,
          todayAppointments: 0,
        });
      }
    };
    fetchData();
  }, []);



  const fetchMentorsList = async () => {
    try {
      const res = await mentorAPI.getAll();
      setMentorsList(res.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setMentorsList([]);
    }
  };

  const fetchMembersList = async () => {
    try {
      const res = await memberAPI.getAll();
      setMembersList(res.data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembersList([]);
    }
  };

  const fetchTodayAppointmentsList = async () => {
    try {
      const res = await appointmentAPI.getAll();
      const today = new Date().toISOString().slice(0, 10);
      const filtered = res.data.filter(app => app.appointmentDate && app.appointmentDate.startsWith(today));
      setTodayAppointmentsList(filtered);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setTodayAppointmentsList([]);
    }
  };

  const fetchFieldsList = async () => {
    try {
      const res = await fieldAPI.getAll();
      setFieldsList(res.data);
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFieldsList([]);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Bảng điều khiển Quản trị viên</h2>
      <Row className="mb-4 justify-content-center gap-2">
        <Col xs={12} sm={6} md={4} lg={2} className="mb-3 d-flex align-items-stretch">
          <Card className="text-center h-100 w-100 border-primary">
            <Card.Body>
              <div className="display-6 text-primary mb-2"><i className="bi bi-person-badge"></i></div>
              <div className="display-6 mb-2">{stats.totalMentors}</div>
              <Card.Title className="h6">Mentor</Card.Title>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  fetchMentorsList();
                  setShowMentorsModal(true);
                }}
              >
                Quản lý
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={2} className="mb-3 d-flex align-items-stretch">
          <Card className="text-center h-100 w-100 border-success">
            <Card.Body>
              <div className="display-6 text-success mb-2"><i className="bi bi-people"></i></div>
              <div className="display-6 mb-2">{stats.totalMembers}</div>
              <Card.Title className="h6">Thành viên</Card.Title>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => {
                  fetchMembersList();
                  setShowMembersModal(true);
                }}
              >
                Quản lý
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={2} className="mb-3 d-flex align-items-stretch">
          <Card className="text-center h-100 w-100 border-info">
            <Card.Body>
              <div className="display-6 text-info mb-2"><i className="bi bi-building"></i></div>
              <div className="display-6 mb-2">{stats.totalFields}</div>
              <Card.Title className="h6">Lĩnh vực</Card.Title>
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => {
                  fetchFieldsList();
                  setShowFieldsModal(true);
                }}
              >
                Quản lý
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={2} className="mb-3 d-flex align-items-stretch">
          <Card className="text-center h-100 w-100 border-warning">
            <Card.Body>
              <div className="display-6 text-warning mb-2"><i className="bi bi-calendar-check"></i></div>
              <div className="display-6 mb-2">{stats.todayAppointments}</div>
              <Card.Title className="h6">Hẹn hôm nay</Card.Title>
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => {
                  fetchTodayAppointmentsList();
                  setShowTodayAppointmentsModal(true);
                }}
              >
                Xem chi tiết
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={2} className="mb-3 d-flex align-items-stretch">
          <Card className="text-center h-100 w-100 border-success">
            <Card.Body>
              <div className="display-6 text-success mb-2"><i className="bi bi-graduation-cap"></i></div>
              <div className="display-6 mb-2">Mentor</div>
              <Card.Title className="h6">Yêu cầu</Card.Title>
              <Button
                variant="outline-success"
                size="sm"
                as={Link}
                to="/admin/mentor-requests"
              >
                Quản lý
              </Button>
            </Card.Body>
          </Card>
        </Col>

      </Row>



      <Modal show={showMentorsModal} onHide={() => setShowMentorsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="w-100 text-center">
            <i className="bi bi-person-badge me-2"></i>
            <span className="fw-bold">Danh sách Mentor</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light rounded-bottom">
          <Table striped hover responsive className="align-middle shadow-sm">
            <thead className="table-primary">
              <tr className="text-center">
                <th>Họ tên</th>
                <th>Email</th>
                <th>Chuyên môn</th>
                <th>Lĩnh vực</th>
              </tr>
            </thead>
            <tbody>
              {mentorsList.map((mentor) => (
                <tr key={mentor.id} className="text-center">
                  <td>{mentor.fullName || mentor.firstName + ' ' + mentor.lastName}</td>
                  <td>{mentor.email}</td>
                  <td>{mentor.fieldName || 'N/A'}</td>
                  <td>{mentor.field?.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={showMembersModal} onHide={() => setShowMembersModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="w-100 text-center">
            <i className="bi bi-people me-2"></i>
            <span className="fw-bold">Danh sách Thành viên</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light rounded-bottom">
          <Table striped hover responsive className="align-middle shadow-sm">
            <thead className="table-success">
              <tr className="text-center">
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {membersList.map((member) => (
                <tr key={member.id} className="text-center">
                  <td>{member.firstName + ' ' + member.lastName}</td>
                  <td>{member.email}</td>
                  <td>{member.phoneNumber || 'N/A'}</td>
                  <td>{member.createdAt ? new Date(member.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={showTodayAppointmentsModal} onHide={() => setShowTodayAppointmentsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title className="w-100 text-center">
            <i className="bi bi-calendar-check me-2"></i>
            <span className="fw-bold">Lịch hẹn hôm nay</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light rounded-bottom">
          <Table striped hover responsive className="align-middle shadow-sm">
            <thead className="table-warning">
              <tr className="text-center">
                <th>Thành viên</th>
                <th>Mentor</th>
                <th>Lĩnh vực</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {todayAppointmentsList.map((app) => (
                <tr key={app.id} className="text-center">
                  <td>{app.memberName}</td>
                  <td>{app.mentorName}</td>
                  <td>{app.fieldName || 'N/A'}</td>
                  <td>{app.appointmentDate} {app.appointmentTime}</td>
                  <td>
                    {app.status === 'APPROVED' && <span className="badge bg-success">Đã xác nhận</span>}
                    {app.status === 'PENDING' && <span className="badge bg-warning text-dark">Chờ xác nhận</span>}
                    {app.status === 'COMPLETED' && <span className="badge bg-primary">Hoàn thành</span>}
                    {app.status === 'REJECTED' && <span className="badge bg-danger">Đã từ chối</span>}
                    {!['APPROVED','PENDING','COMPLETED','REJECTED'].includes(app.status) && <span className="badge bg-secondary">{app.status}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={showFieldsModal} onHide={() => setShowFieldsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title className="w-100 text-center">
            <i className="bi bi-building me-2"></i>
            <span className="fw-bold">Danh sách Lĩnh vực</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light rounded-bottom">
          <Table striped hover responsive className="align-middle shadow-sm">
            <thead className="table-info">
              <tr className="text-center">
                <th>Tên lĩnh vực</th>
                <th>Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {fieldsList.map((field) => (
                <tr key={field.id} className="text-center">
                  <td>{field.name}</td>
                  <td>{field.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;