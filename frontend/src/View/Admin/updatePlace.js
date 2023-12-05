import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

const UpdatePlace = () => {
//   const [place, setPlace] = useState({
//     place_name: '',
//     price: '',
//     latitude: '',
//     longitude: '',
//     description: '',
//     rating: '',
//     cat_id: '',
//   });

const { placeid } = useParams();

useEffect(() => {
    console.log('placeid', placeid)
}, [placeid])
const [place, setPlace] = useState({});

//   useEffect(() => {
//     const fetchPlaceDetails = async () => {
//       try {
//         const response = await fetch(`/api/getPlace/${placeid}`);
//         const placeData = await response.json();
//         setPlace(placeData);
//       } catch (error) {
//         console.error('Error fetching place details:', error);
//       }
//     };

//     fetchPlaceDetails();
//   }, [[placeid]]);

useEffect(() => {
    const fetchPlaceByID = async () => {
      try {

        // const postsResponse = await fetch("/api/allPostsHome");
        // const postsData = await postsResponse.json();
        // setAllPosts(postsData.posts || []);

        const placeResponse = await fetch(`/api/getPlace/` + placeid);
        console.log('placeResponse: ', placeResponse)
        const placeData = await placeResponse.json();
        console.log('placeData: ', placeData)
        console.log('placeData.post: ', placeData.post)
        setPlace(placeData.post || {});
        console.log('place: ', place)
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
    };

    fetchPlaceByID();
  }, [placeid]);

  useEffect(() => {
    console.log('place', place)
  }, [place]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlace((prevPlace) => ({
      ...prevPlace,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/updatePlace/${placeid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(place),
      });

      if (response.ok) {
        window.alert('Place updated successfully');
      } else {
        throw new Error('Failed to update place');
      }
    } catch (error) {
      console.error('Error updating place:', error);
    }
  };

  return (
    <div>
      <h2>Update Place</h2>
      <form>
        <label>
          Place Name:
          <input
            type="text"
            name="place_name"
            value={place.place_name}
            onChange={handleInputChange}
          />
        </label>
        <br />

        <label>
          Price:
          <input
            type="text"
            name="price"
            value={place.price}
            onChange={handleInputChange}
          />
        </label>
        <br />

        <label>
          Latitude:
          <input
            type="text"
            name="latitude"
            value={place.latitude}
            onChange={handleInputChange}
          />
        </label>
        <br />

        <label>
          Longitude:
          <input
            type="text"
            name="longitude"
            value={place.longitude}
            onChange={handleInputChange}
          />
        </label>
        <br />

        <label>
          Description:
          <input
            type="text"
            name="description"
            value={place.description}
            onChange={handleInputChange}
          />
        </label>
        <br />

        <label>
          Rating:
          <input
            type="text"
            name="rating"
            value={place.rating}
            onChange={handleInputChange}
          />
        </label>
        <br />

        <label>
          Category ID:
          <input
            type="text"
            name="cat_id"
            value={place.cat_id}
            onChange={handleInputChange}
          />
        </label>
        <br />

        <button type="button" onClick={handleUpdate}>
          Update Place
        </button>
      </form>
    </div>
  );
};

export default UpdatePlace;
