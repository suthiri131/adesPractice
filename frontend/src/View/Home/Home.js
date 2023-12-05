import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import CardPost from "../../components/Cards/cardPost";
import "./css/home.css";
import "./css/placesCard.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "../../components/Header/HeaderHome";
import "./css/mostBooked.css";
import "./css/mostPopular.css";

const HomePage = () => {
  const [user, setUser] = useState({});
  const [placeImages, setPlaceImages] = useState([]);
  const [mostBooked,setmostBooked]=useState([]);
  const [recommended,setRecommended]=useState([]);
  const [mostPopular,setmostPopular]=useState([]);

  useEffect(() => {
   
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/user/${userId}`);
        const responseData = await response.json();

        if (responseData.users.length > 0) {
          const userProfile = responseData.users[0];
          setUser(userProfile);
        
        }
      } catch (error) {
        console.error('Error fetching user profile data:', error);
      }
    }
    const fetchPlaceImages = async () => {
      try {
        // Fetch images of 3 places
        const imageResponse = await fetch("/api/imageSlideshow");
        const imageData = await imageResponse.json();
      
        // Log the received data to the console
        console.log("ImageData:", imageData);
    
        // Check if imageData.images.rows is an array before setting the state
        if (Array.isArray(imageData.images.rows)) {
          // Assuming 'setPlaceImages' is your state-setting function
          setPlaceImages(imageData.images.rows);
        } else {
          console.error("Images data rows is not an array:", imageData.images.rows);
        }
      } catch (error) {
        console.error("Error fetching place images:", error);
      }
    };
    
    const fetchMostBooked = async () => {
      try {
        const mostBookedResponse = await fetch("/api/mostBooked");
        const mostBookedData = await mostBookedResponse.json();
    
        // Check if mostBookedData.mostBooked is defined and is an array
        if (Array.isArray(mostBookedData.mostBooked)) {
          // Set the state with the array
          setmostBooked(mostBookedData.mostBooked);
        } else {
          console.error(
            "Most Booked data is not an array:",
            mostBookedData.mostBooked
          );
        }
      } catch (error) {
        console.error("Error fetching most booked data:", error);
      }
    };
    const fetchRecommended = async () => {
      try {
        const userid=localStorage.getItem("userId");
        const recommendedResponse = await fetch(`/api/getRecommended/${userid}`);
        const recommendedData = await recommendedResponse.json();
    
        // Check if mostBookedData.mostBooked is defined and is an array
        if (Array.isArray(recommendedData.recommendedPlaces)) {
          // Set the state with the array
          setRecommended(recommendedData.recommendedPlaces);

        } else {
          console.error(
            "Recommended data is not an array:",
            recommendedData.recommendedPlaces
          );
        }
      } catch (error) {
        console.error("Error fetching most recommended data:", error);
      }
    };
       
    const fetchMostPopular = async () => {
      try {
        const mostPopularResponse = await fetch("/api/mostSavedPosts");
        const mostPopularData = await mostPopularResponse.json();
    
        if (Array.isArray(mostPopularData.mostSavedPosts)) {
          // Set the state with the array
          setmostPopular(mostPopularData.mostSavedPosts);
        } else {
          console.error(
            "Most Popular data is not an array:",
            mostPopularData.mostSavedPosts
          );
        }
      } catch (error) {
        console.error("Error fetching most popular data:", error);
      }
    };
    
    

    // Fetch user details
    fetchUserData();
    fetchMostBooked();
    fetchMostPopular();
    fetchRecommended();

    // Fetch place images
    fetchPlaceImages();
  }, []);

  const settings1 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "custom-slider",
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, 
  };
  
  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    className: "custom-slider",

    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, 
  };
  const settings3 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    className: "custom-slider",
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000, 
  };

  return (
    <div>
      <Header />
      <div className="user-welcome">
        Welcome, {user.username}!
      </div>

      {/* Image Slideshow for Places */}
      <div className="Places">
        <Slider {...settings1}>
          {placeImages.map((image, index) => (
            <div key={index} className="place-slide">
              <img
                src={image.place_image}
                className="slideshow-images"
                alt={`Place ${index + 1}`}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Most Booked Section */}
      <div className="MostBookedPlaces">
        <div className="mostbooked-title">Most Booked</div>
        <Slider {...settings2} className="mostbooked-slider">
          {mostBooked.length > 0 &&
            mostBooked.map((place) => (
              <Link
                key={place.placeid}
                to={`/book-place/${place.placeid}`}
                className="place-card-link no-underline"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <div key={place.placeid} className="place-card mostbooked-slide">
                  <img src={place.place_image} alt={place.place_name} />
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
        </Slider>
      </div>
      <div className="Recommended">
  <div className="recommended-title">Recommended</div>
  {recommended.length === 0 ? (
    <div>No recommended places</div>
  ) : (
    <Slider {...settings2} className="mostbooked-slider">
      {recommended.map((place) => (
        <Link
          key={place.placeid}
          to={`/book-place/${place.placeid}`}
          className="place-card-link no-underline"
          style={{ textDecoration: 'none', color: 'black' }}
        >
          <div key={place.placeid} className="place-card mostbooked-slide">
            <img src={place.place_image} alt={place.place_name} />
            <div className="places-card-info">
              <h3 className="places-card-title black-text">
                {place.place_name}
              </h3>
              <p className="places-card-cat black-text">
                {place.cat_name} {/* Assuming cat_id is the category ID */}
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
    </Slider>
  )}
</div>

      <div className="MostBookedPlaces">
        <div className="mostbooked-title">Most Popular Posts</div>
        <Slider {...settings2} className="mostbooked-slider">
          {mostPopular.length > 0 &&
            mostPopular.map((post) => (
              <Link
                key={post.postid}
                to={`/post-details/${post.postid}`}
                className="card-link"
              
              >
                 <CardPost post={post} />
              </Link>
            ))}
        </Slider>
      </div>
  


    </div>
  );
};

export default HomePage;