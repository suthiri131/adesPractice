import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./css/addPlaceForm.css";

function AddPlaceForm() {
  const [place_name, setPlace_name] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [cat_id, setCat_id] = useState("");
  const [selectedOption, setSelectedOption] = useState("1");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
    setCat_id(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!place_name || !price || !latitude || !longitude || !description || !cat_id) {
      alert("Please fill in all the fields!");
      return;
    }

    try {
      const res = await fetch("/api/addPlace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          place_name,
          price,
          latitude,
          longitude,
          description,
          rating,
          cat_id,
        }),
      });

      const data = await res.json();

      if (data.data.message === "Place added successfully.") {
        alert("Place added successfully!");

        // window.reload()

        setPlace_name("");
        setPrice("");
        setLatitude("");
        setLongitude("");
        setDescription("");
        setRating(0);
        setCat_id("");
        setSelectedOption("1");
        setCategories([]);

      } else {
        console.error("Add place failed:", data.data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error during add place:", error);
    }
  };

  return (
    <div className="form-container container">
      <h1>Add a Place</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-input col-6">
          <label htmlFor="place_name">Place Name</label>
          <input
            type="text"
            id="place_name"
            name="place_name"
            placeholder="Place Name"
            value={place_name}
            onChange={(e) => setPlace_name(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="price">Price</label>
          <input
            type="text"
            id="price"
            name="price"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-input">
          <label htmlFor="rating">Rating</label>
          <input
            type="text"
            id="rating"
            name="rating"
            value={rating}
            readOnly
          />
        </div>

        <div className="dropdown">
          <select
            className="dropdown-select-type"
            onChange={handleDropdownChange}
            value={selectedOption}
          >
          <option value="1">Accommodation</option>
          <option value="2">Delicacies</option>
          <option value="3">Recreational</option>
          <option value="4">Shopping</option>
          </select>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddPlaceForm;