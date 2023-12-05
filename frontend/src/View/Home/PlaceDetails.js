import React, { useState, useEffect } from "react";
import Header from "../../components/Header/HeaderHome";
import ViewPlaces from "../../components/Cards/viewPlace";
import { useParams, Link } from "react-router-dom";
import CardPost from "../../components/Cards/cardPost";
import "./css/place.css";
const PlaceDetail = () => {
  const { placeid } = useParams();
  const [place, setPlace] = useState({});
  const [post, setPosts] = useState([]);
  useEffect(() => {
    const fetchPlaceByID = async () => {
      try {
        const placeResponse = await fetch("../api/book-place/" + placeid);
        const placeData = await placeResponse.json();

        setPlace(placeData.post || {});
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
    };
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch("/api/similarPlacePosts/" + placeid);
        const responseData = await response.json();
        const postData = responseData.posts || [];
        const postArray = Array.isArray(postData) ? postData : [postData];

        setPosts(postArray);
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
    };

    fetchPlaceByID();
    fetchRelatedPosts();
  }, [placeid]);

  return (
    <div className="profileDetails">
      <Header />
      <div className="container mt-5">
        {place && (
          <div>
            <div className="row">
              <div className="col-md-4 mb-3">
                {/* <img
                  src={place.place_image || "default-placeholder-image.jpg"}
                  alt="Place"
                  className="img-fluid"
                /> */}
              </div>
              <div className="col-md-8">
                <h1>{place.place_name}</h1>
                <ViewPlaces key={place.placeid} place={place} />
                
          <Link to={`/book/${place.placeid}/${place.place_name}/${place.price}`}>
            <button>Book</button>
          </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="dividerSuggest divider"></div>
      <h2>Related Posts</h2>
      <div className="card-container col-12">
        {post.length === 0 ? (
          <div>
            <p>No similar posts found. Be the first one to post!</p>
            <p>
              <Link to="/createPost">Create Post</Link>
            </p>
          </div>
        ) : (
          post.map((similarPostItem) => {
            console.log("Post ID of similar:", similarPostItem.postid);
            return (
              <Link
                key={similarPostItem.postid}
                to={`/post-details/${similarPostItem.postid}`}
                className="card-link"
              >
                <CardPost key={similarPostItem.postid} post={similarPostItem} />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PlaceDetail;
