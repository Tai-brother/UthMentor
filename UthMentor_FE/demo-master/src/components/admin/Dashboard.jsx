import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Container className="py-4">
      <h2>Admin Dashboard</h2>
      <p className="lead">Welcome to the admin panel!</p>
      
      <Row className="mt-4">
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Mentor Requests</Card.Title>
              <Card.Text>
                Review and manage mentor applications.
              </Card.Text>
              <Link to="/admin/mentor-requests" className="btn btn-primary">View Requests</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Manage Members</Card.Title>
              <Card.Text>
                View and manage member accounts.
              </Card.Text>
              <Link to="/admin/manage-members" className="btn btn-info">Manage Members</Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Fields</Card.Title>
              <Card.Text>
                Create and manage fields.
              </Card.Text>
              <Link to="/admin/manage-fields" className="btn btn-success">Manage Fields</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
