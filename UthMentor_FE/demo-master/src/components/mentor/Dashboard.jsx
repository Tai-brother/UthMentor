import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const MentorDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <Container className="py-4">
      <h2>Mentor Dashboard</h2>
      <p className="lead">Welcome back, Mentor {currentUser?.lastName}!</p>
      
      <Row className="mt-4">
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>My Appointments</Card.Title>
              <Card.Text>
                View and manage your upcoming appointments.
              </Card.Text>
              <a href="/mentor/appointments" className="btn btn-primary">View Appointments</a>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>My Profile</Card.Title>
              <Card.Text>
                Update your profile and professional information.
              </Card.Text>
              <a href="/mentor/profile" className="btn btn-info">Edit Profile</a>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="mt-4 p-4 bg-light rounded">
        <h4>Need Help?</h4>
        <p>
          If you have any questions or need assistance, please contact our support team.
        </p>
      </div>
    </Container>
  );
};

export default MentorDashboard;