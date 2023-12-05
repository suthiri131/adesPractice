import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditProfileAdmin from './EditProfileAdmin';
import AddPlaceForm from './addPlace';
import PlaceCard from './placeCard';
import './css/viewPlaces.css';

const ViewAllEditPages=()=>{

    const [places, setPlaces] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]);


    useEffect(() => {
      const fetchAllPlaces = async () => {
        try {
    
          const placesResponse = await fetch("/api/allPlacesHome");
          const placesData = await placesResponse.json();
          // Check if placesData.places.rows is an array before setting the state
          if (Array.isArray(placesData.places.rows)) {
            setAllPlaces(placesData.places.rows);
          } else {
            console.error(
              "Places data rows is not an array:",
              placesData.places.rows
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      
      // Call the fetch function
      fetchAllPlaces();
    }, []);

    

    useEffect(() => {
        if (Array.isArray(places)) {
        console.log('Places state updated:', places);
        }
    }, [places]);

    return(

        <div className="content">
      <div className="Places">
        <div className="home-title1">All Places</div>

        <div className="place-cards-container">
          {allPlaces.length > 0 &&
            allPlaces.map((place) => (
              <Link
                key={place.placeid}
                to={`/edit/${place.placeid}`}
                className="place-card-link no-underline"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <div key={place.placeid} className="place-card">
                  {/* Assuming placesCard is a component */}
                  <placesCard place={place} />
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
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      </div>


    );
};

export default ViewAllEditPages;