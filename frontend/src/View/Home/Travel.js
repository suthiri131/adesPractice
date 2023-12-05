import React, { useEffect, useState } from "react";
import Header from "../../components/Header/HeaderHome";
import CardPost from "../../components/Cards/cardPost";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./css/placesCard.css";

const Travel = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [user, setUser] = useState({});
   const navigate = useNavigate(); 
 



  useEffect(() => {
    const fetchAllPostsAndPlaces = async () => {
      try {
        const postsResponse = await fetch("/api/allPosts");
        console.log('postsResponse', postsResponse)
        const postsData = await postsResponse.json();
        if (Array.isArray(postsData.posts.rows)) {
          setAllPosts(postsData.posts.rows);
        } else {
          console.error(
            "Posts data rows is not an array:",
            postsData.posts.rows
          );
        }
       setAllPosts(postsData.posts || []);

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

    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`/api/user/${userId}`);
        const responseData = await response.json();
        const userData = responseData.users.rows[0] || {};
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchAllPostsAndPlaces();
    fetchUserData();
  }, []);

 
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    className: "custom-slider",
  };

  return (
    <div>
      <Header navigate={navigate} />
   

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
                <img src={place.place_image} alt={place.place_name} />
               
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

export default Travel;
