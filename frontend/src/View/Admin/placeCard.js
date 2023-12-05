import React from "react";
// import './css/adminHome.css';

const PlaceCard = ({ place }) => {
  if (!place) {
    return null;
  }

  const { placeid, place_name } = place;

  const handleView = (id) => {
    console.log(`View place with id ${id}`);
  };

  const handleEdit = (id) => {
    console.log(`Edit place with id ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete place with id ${id}`);
  };

  return (
    <div className="card">
      <p>Place ID: {placeid}</p>
      <p>Place Name: {place_name}</p>
      <button onClick={() => handleView(placeid)}>View</button>
      <button onClick={() => handleEdit(placeid)}>Edit</button>
      <button onClick={() => handleDelete(placeid)}>Delete</button>
    </div>
  );
};

export default PlaceCard;
