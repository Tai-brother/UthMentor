import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import './DoctorCard.css';

const MentorCard = ({ mentor, isSelected, onSelect }) => {
  return (
    <Card 
      className={`mentor-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="mentor-img-container">
        <Card.Img 
          variant="top" 
          src={mentor.imageUrl || 'https://via.placeholder.com/150?text=Mentor'} 
          className="mentor-img"
        />
        {mentor.rating !== null && mentor.rating !== undefined && mentor.rating > 0 && (
          <div className="mentor-rating">
            <span>⭐ {mentor.rating}</span>
          </div>
        )}
      </div>
      
      <Card.Body>
        <Card.Title className="mentor-name">
          {mentor.fullName}
        </Card.Title>
        
        <div className="fields">
          {mentor.fieldNames && mentor.fieldNames[0] && (
            <Badge bg="info" className="me-1 mb-1">{mentor.fieldNames[0]}</Badge>
          )}
        </div>
        
        <div className="mentor-info mt-2">
          <div className="info-item">
            <i className="bi bi-calendar-check"></i>
            <span>{mentor.experience || 0} năm kinh nghiệm</span>
          </div>
          
          {mentor.fee && (
            <div className="info-item price">
              <i className="bi bi-cash"></i>
              <span>{mentor.fee.toLocaleString('vi-VN')}đ / lần tư vấn</span>
            </div>
          )}
        </div>

        {isSelected && <div className="selected-mark">✓</div>}
      </Card.Body>
    </Card>
  );
};

export default MentorCard;
