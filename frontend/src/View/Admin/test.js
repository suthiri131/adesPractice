import React, { useState, useEffect } from "react";
import Header from "../../components/Header/HeaderProfile";
import ViewPlace from "../../components/Cards/viewPlace"; // Import ViewPlace component

import "./css/profileMain.css";

const placeDetail = () => {
 const { placeid } = useParams(); 
 console.log("getID " + placeid);
 const [place, setPlace] = useState([]);

 useEffect(() => {
    const fetchPlaceByID = async () => {
      try {
        const response = await fetch("/api/PlaceByID/" + placeId);
        const responseData = await response.json();
        const placeData = responseData.places.rows || [];
        console.log("placeByID Data:", placeData);
        setPlace(placeData);
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
    };

    fetchPlaceByID();
 }, [placeid]);

 return (
    <div className="profileDetails">
      <Header />
      <div className="container-fluid detailBox col-10">
      {place.length > 0 ? (
 place.map((placeDetail) => {
    console.log("Place ID:", placeDetail.placeid);
    return <ViewPlace key={placeDetail.placeid} placeDetail={placeDetail} />;
 })
) : (
 <div>No more place</div>
)}

      </div>
    </div>
 );
};

export default placeDetail;
