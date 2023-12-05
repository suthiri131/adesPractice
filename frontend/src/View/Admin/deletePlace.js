import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/viewPlaces.css';

const DeletePlaces = () => {
  const [allPlaces, setAllPlaces] = useState([]);

  const deletePlace = async (placeId) => {
    try {
      const response = await fetch(`/api/deletePlace/${placeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok){
        window.alert("deleted")
        setAllPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place.placeid !== placeId)
      );
      }

      if (!response.ok) {
        throw new Error('Failed to delete place');
      }

    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        const placesResponse = await fetch('/api/allPlacesHome');
        const placesData = await placesResponse.json();

        if (Array.isArray(placesData.places.rows)) {
          setAllPlaces(placesData.places.rows);
        } else {
          console.error(
            'Places data rows is not an array:',
            placesData.places.rows
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllPlaces();
  }, []);

  return (
    <div className="content">
      <div className="Places">
        <div className="home-title1">All Places</div>

        <div className="place-cards-container">
          {allPlaces.length > 0 &&
            allPlaces.map((place) => (
              <Link
                key={place.placeid}
                to={`/book-place/${place.placeid}`}
                className="place-card-link no-underline"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <div key={place.placeid} className="place-card">
                  <div className="places-card-info">
                    <h3 className="places-card-title black-text">
                      {place.place_name}
                    </h3>
                    <p className="places-card-cat black-text">
                      {place.cat_name}
                    </p>
                    <p className="places-card-description black-text">
                      {place.description}
                    </p>
                    <p className="places-card-rating black-text">
                      Rating: {place.rating}/5
                    </p>
                    <button
                      className="delete-button"
                      onClick={() => {
                        event.preventDefault();
                        deletePlace(place.placeid);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DeletePlaces;
