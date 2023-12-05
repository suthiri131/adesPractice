import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/cancelledBookings");
      const data = await response.json();
      if (Array.isArray(data.result)) {
        setRequests(data.result);
      } else {
        console.error("Data is not an array:", placesData.places);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const acceptRequest = (bookingid) => {
    console.log("acceptRequest");
    fetch(`/api/bookings/${bookingid}?is_approved=1`, {
      method: "PUT",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        fetchRequests();
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error sending form data:", error);
      });
  };

  const rejectRequest = (bookingid) => {
    console.log("rejectRequest");
    fetch(`/api/bookings/${bookingid}?is_approved=2`, {
      method: "PUT",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        fetchRequests();
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error sending form data:", error);
      });
  };

  // const fetchRequests = async () => {
  //   try {
  //     const response = await fetch("/api/cancelledBookings");
  //     const data = await response.json();
  //     if (Array.isArray(data.result)) {
  //       setRequests(data.result);
  //     } else {
  //       console.error("Data is not an array:", placesData.places);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  useEffect(() => {
    fetchRequests();
  }, []); // Removed 'requests' from the dependency array to avoid potential infinite loop

  return (
    <div>
      <h1>Pending Requests</h1>
      {requests.map((request) => (
        <div key={request.bookingid}>
          <p key={request.bookingid}>Booking ID: {request.bookingid}</p>
          <button onClick={() => acceptRequest(request.bookingid)}>
            Accept
          </button>
          <button onClick={() => rejectRequest(request.bookingid)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default PendingRequests;
