import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./css/booking.css"; // Import your CSS file
import Header from "../../components/Header/HeaderProfile";
import Checkout from '../../components/Checkout';


const loggedInUserId = localStorage.getItem("userId");

const BookingPage = () => {
  const { placeid, name, price } = useParams();
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date
  const [ticketCount, setTicketCount] = useState(1); // State to store number of tickets
  const [ticketInfo, setTicketInfo] = useState(null); // State to store ticket information
  const [totalAmount, setTotalAmount] = useState(price); // State to store total amount
  const today = new Date();
const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
const [loading, setLoading] = useState(false);

  const handleDateChange = async (event) => {
    setSelectedDate(event.target.value);
    const selectedDate = event.target.value;
    try {
      setLoading(true); 
      const response = await fetch(`/api/ticketInfo/${placeid}/${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Tickets Info:", data);
        setTicketInfo(data); // Set ticket information received from the backend
        // Handle the data received from the backend
        // Update the UI based on ticket info
      } else {
        console.error("Failed to fetch ticket info");
      }
    } catch (error) {
      console.error("Error fetching ticket info:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleTicketCountChange = (event) => {
    const selectedTickets = parseInt(event.target.value);
    if (selectedTickets <= ticketInfo.remainingTickets) {
      setTicketCount(selectedTickets);
      setTotalAmount(price * selectedTickets); // Update total amount based on ticket count and price
    } else {
      setTicketCount(ticketInfo.remainingTickets); // Limit to remaining tickets
      setTotalAmount(price * ticketInfo.remainingTickets); // Update total amount based on remaining tickets
    }
  };

  const handleBooking = async () => {
    try {

      const purchaseTicket ={
        placeId: placeid,
        placeName: name,
        price: price,
        totalAmount: totalAmount,
        quantity: ticketCount,
        selectedDate: selectedDate,
        userId: loggedInUserId,
        todayDate: formattedDate // Add the formatted date to the object
      }
      // Create a checkout session with Stripe
      const response = await fetch("/api/createCheckoutSession", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseTicket)
      
      });
  
      if (response.ok) {
        
        const { session } = await response.json();
        
        window.location.href = session.url;
      } else {
        console.error("Failed to initiate Stripe checkout");
        // Handle error scenarios
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      // Handle error scenarios
    }
  };
  

  return (
    <div className ="booking">
        <Header />
    <div className="booking-container">
        
      <h2 className="booking-heading">Purchase The Ticket</h2>
      <p className="place-name">{name}</p>
      <p className="price">Price: {price}</p>
      <p className="total-amount">Total Amount: {totalAmount}</p>
      <p>Place ID: {placeid}</p>
      <label htmlFor="datePicker">Select Date:</label>
      <input
        type="date"
        id="datePicker"
        value={selectedDate}
        onChange={handleDateChange}
        min={formattedDate}
      />
      <div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            ticketInfo && (
              <p>
                Available Tickets: {ticketInfo.remainingTickets}
              </p>
            )
          )}
        </div>
      <label htmlFor="ticketCountInput">Number of Tickets:</label>
      <input
        type="number"
        id="ticketCountInput"
        value={ticketCount}
        onChange={handleTicketCountChange}
      />
      <button
          className="book-button"
          onClick={handleBooking}
          disabled={loading || !ticketInfo}
        >
          Continue to Payment
        </button>
    </div>
    </div>
  );
};

export default BookingPage;
