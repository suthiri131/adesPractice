import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfileAdmin from './EditProfileAdmin';
import AddPlaceForm from './addPlace';
import PlaceCard from './placeCard';
// import './css/viewPlaces.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const ViewAllPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const placesResponse = await fetch("/api/admin/search?place_name=" + search);
        const placesData = await placesResponse.json();
        if (Array.isArray(placesData.places)) {
          setAllPlaces(placesData.places);
        } else {
          console.error("Places data is not an array:", placesData.places);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchSearch();
  }, [search]);

  useEffect(() => {
    const fetchAllPlaces = async () => {
      try {
        const placesResponse = await fetch("/api/allPlacesHome");
        const placesData = await placesResponse.json();
        if (Array.isArray(placesData.places.rows)) {
          setAllPlaces(placesData.places.rows);
        } else {
          console.error("Places data rows is not an array:", placesData.places.rows);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAllPlaces();
  }, []);

  const handleEditClick = (placeid) => {
    console.log(`Edit button clicked for place with ID ${placeid}`);
    navigate(`/edit/${placeid}`);
  };

  const handleDeleteClick = async (placeid) => {
    try {
      const response = await fetch(`/api/deletePlace/${placeid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.alert("deleted")
        setAllPlaces((prevPlaces) =>
          prevPlaces.filter((place) => place.placeid !== placeid)
        );
      }

      if (!response.ok) {
        throw new Error('Failed to delete place');
      }

    } catch (error) {
      console.error('Error deleting place:', error);
      alert('this place has booking!')
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">All Places</h1>

          <input
            type='text'
            placeholder='Search Place Name'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control mb-4"
          />

          <div className="row">
            {allPlaces.length > 0 &&
              allPlaces.map((place) => (
                <div key={place.placeid} className="col-md-4 mb-4">
                  <div className="card shadow rounded-lg border">
                    <div className="card-body">
                      <h5 className="card-title">{place.place_name}</h5>
                      <p className="card-text">{place.cat_name}</p>
                      <p className="card-text">{place.description}</p>
                      <p className="card-text">Rating: {place.rating}/5</p>
                      <div className="mb-2">
                        <button
                          onClick={() => handleEditClick(place.placeid)}
                          className="btn btn-primary mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(event) => { event.stopPropagation(); handleDeleteClick(place.placeid); }}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllPlaces;
