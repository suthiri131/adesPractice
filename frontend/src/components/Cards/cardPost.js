// CardPost.js
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import './css/cardPost.css'; // Import your CSS file for CardPost styling

const CardPost = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval;

    if (isHovered) {
      // Start automatic slideshow after 3 seconds
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % post.images.length);
      }, 1500);
    }

    return () => {
      clearInterval(interval);
      setCurrentIndex(0); // Reset index when not hovered
    };
  }, [isHovered, post.images.length]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Card
      className={`custom-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card.Img
        variant="top"
        src={post.images[currentIndex]} // Display the current image
        alt={`post-${post.post_id}-${currentIndex}`}
        className="cardImg"
      />
      {isHovered && (
        <div className="slideshow">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`post-${post.post_id}-${index}`}
              style={{ display: index === currentIndex ? 'block' : 'none' }}
            />
          ))}
        </div>
      )}
      {isHovered && (
        <Card.Body className="card-post-info">
          <Card.Title>{post.title}</Card.Title>
        </Card.Body>
      )}
    </Card>
  );
};

export default CardPost;
