import React from 'react';
import save from '../../assets/images/save.png';
import './css/cardPost.css';

const ViewPlaces = ({ place }) => {
 return (
    <div className="post-container col">
      <div className="left-section">
        <img
          src={place.place_image}
          alt="Place Image"
          className="main-image"
        />
      </div>
      <div className="divider divider_main"></div>
      <div className="right-section">
        <div className="post-details">
          <div className="title">
            <span>{place.name}</span>
            <div className="save-count">
             Ratings: {place.rating}
            
            </div>
          </div>
          <div className="place-name">Price: {place.price}</div>
          <div className="description">{place.description}</div>
          <div className="created-time">
            Latitude: {place.latitude}, Longitude: {place.longitude}
          </div>
        </div>
      </div>
    </div>
 );
};

export default ViewPlaces;