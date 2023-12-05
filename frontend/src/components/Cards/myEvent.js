import React, { useState, useEffect } from "react";
import "./css/eventsCard.css";
import StarRating from "react-rating-stars-component";
import Loading from "../../components/profile/loading";
const MyEventsCard = ({ event }) => {
  const [userRating, setUserRating] = useState(0);
  const [existingRating, setExistingRating] = useState([]);
  const [existingReq, setExistingReq] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const isPastEvent = new Date(event.datebooked) < new Date();
  const [isToday, setIsToday] = useState(false);
  var uid = localStorage.getItem("userId");
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);
  let averageRating;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const userResponse = await fetch("/api/user/" + uid);
        const userData = await userResponse.json();
        const usersData = userData.users.rows || [];
        setUsers(usersData);

        // Fetch existing rating data
        const ratingResponse = await fetch(
          `/api/getRating/${uid}/${event.placeid}/${event.bookingid}`
        );
        const ratingData = await ratingResponse.json();
        const existingRatingData = ratingData.result;
        setExistingRating(existingRatingData);

        // Fetch existing cancellation request data
        const reqCancelResponse = await fetch(
          `/api/getReqCancel/${uid}/${event.placeid}/${event.bookingid}`
        );
        const cancelData = await reqCancelResponse.json();
        const existingCancelData = cancelData.requests;
        setExistingReq(existingCancelData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, event.placeid, event.bookingid, reload]);

  useEffect(() => {
    // Check if the event date is equal to today's date
    const today = new Date().toLocaleDateString();
    const eventDate = new Date(event.datebooked).toLocaleDateString();
    setIsToday(today === eventDate);
  }, [event.datebooked]);

  const handleRatingChange = async () => {
    if (!userRating) {
      alert("Enter a rating");
      return Promise.resolve(); // Return a resolved promise to end the function
    }

    // Insert ratings
    return fetch(
      `/api/insertRating/${uid}/${event.placeid}/${event.bookingid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ratings: userRating }),
      }
    )
      .then((SubmitRatingResponse) => {
        if (SubmitRatingResponse.ok) {
          setIsRatingSubmitted(true);
          alert("Rating submitted successfully");

          // Fetch ratings of this place
          return fetch(`/api/getRatingByPlaceID/${event.placeid}`);
        } else {
          return SubmitRatingResponse.json().then((data) => {
            throw new Error(data.error || "Failed to upload rating");
          });
        }
      })
      .then((ratingsResponse) => {
        if (ratingsResponse.ok) {
          return ratingsResponse.json();
        } else {
          console.log("Rating response error");
          return Promise.reject("Rating response error");
        }
      })
      .then((ratingsData) => {
        const placeRatings = ratingsData.result || [];
        console.log(placeRatings);
        console.log("Getting rating by place " + placeRatings.length);
        //calculate average rating to push it into the places table
        averageRating = (
          placeRatings.rating_sum / placeRatings.total_rating
        ).toFixed(2);
        console.log("Updated ratings:", averageRating);

        // Update to place table
        return fetch(`/api/updateRatingsOfPlace/${event.placeid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            updatedRating: averageRating,
          }),
        });
      })
      .then((updatePlaceRatingResponse) => {
        if (updatePlaceRatingResponse.ok) {
          console.log("Place rating updated on the server");
          // alert(`Updated ${event.placeid} ratings to ${averageRating}`);
        } else {
          return updatePlaceRatingResponse
            .json()
            .then((updatePlaceRatingData) => {
              console.error(
                "Failed to update place rating on the server:",
                updatePlaceRatingData.error
              );
            });
        }
      })
      .catch((error) => {
        console.error("Error uploading ratings: " + error.message);
      });
  };

  const handleCancel = async () => {
    try {
      const cancelResponse = await fetch(
        `/api/requestCancel/${uid}/${event.placeid}/${event.bookingid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (cancelResponse.ok) {
        setReload(true);
        try {
          alert("request sent successfully");
          //email to inform user
          const response = await fetch(`/api/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: users[0].email,
              subject: "Cancel request",
              text: `Your request to cancel your booking for ${event.place_name} which is to be held on ${event.datebooked} is in progress`,
            }),
          });

          const data = await response.json();

          if (data.success) {
            alert("email sent");
            await handleRegister();
          } else {
            console.error(
              "Email verification failed:",
              data.message || "Unknown error"
            );
            setShowVerificationPopup(true);
          }
        } catch (error) {
          console.error("Error during email :", error);
        }
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };

  // Function to check if the date is within 2 days from today
  const isWithinTwoDays = (date) => {
    const bookDate = new Date(date);
    const now = new Date();

    // Set time to midnight to compare dates without considering time
    bookDate.setUTCHours(0, 0, 0, 0);
    now.setUTCHours(0, 0, 0, 0);

    // Calculate the difference in days
    const timeDifference = bookDate.getTime() - now.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference <= 2;
  };
  const formattedDate = new Date(event.datebooked).toLocaleDateString();
 return (
    <div className="myEvents-card">
      <div className="PlaceImage-container">
        <img
          src={event.place_image}
          alt={event.place_name}
          className="place-image"
        />
      </div>
      <div className="eventDetails">
        <h3 className="place-name">{event.place_name}</h3>
        <p className="dateBook">{new Date(event.datebooked).toLocaleDateString()}</p>
        <p className="pax">Number of Pax: {event.numberoftickets}</p>
        <p className="totalPaid">Total Paid: ${event.amountpaid}</p>
        {isPastEvent ? (
          <div>
            {existingRating.length > 0 ? (
              existingRating.map((rating, index) => (
                <div key={index}>
                  <StarRating
                    count={5}
                    value={rating.rating}
                    size={30}
                    activeColor="#ffd700"
                    isHalf={true}
                    edit={false}
                  />
                </div>
              ))
            ) : (
              // Only render the rating section if the date is not today
              !isToday && (
                <StarRating
                  count={5}
                  onChange={(rating) => setUserRating(rating)}
                  size={30}
                  activeColor="#ffd700"
                  isHalf={true}
                  value={userRating}
                />
              )
            )}
            {userRating !== 0 &&
              !isRatingSubmitted &&
              existingRating.length === 0 && (
                <button
                  className="submit-rating"
                  onClick={() => handleRatingChange()}
                >
                  Submit Rating
                </button>
              )}
          </div>
        ) : (
          <p className="confirm-booking">
            {" "}
            {event.is_approved === 1 ? "" : "Booking Confirmed"}
          </p>
        )}
        {isWithinTwoDays(event.datebooked) ? null : (
          <button
            className={`cancel-booking${
              existingReq.length > 0 ? " requested" : ""
            }`}
            onClick={() => handleCancel()}
          >
            {event.is_approved === 0
              ? "Requested"
              : event.is_approved === 1
              ? "Approved"
              : event.is_approved === 2
              ? "Request Rejected"
              : "Cancel Booking"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MyEventsCard;