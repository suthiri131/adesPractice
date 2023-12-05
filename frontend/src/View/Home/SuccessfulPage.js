import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SuccessfulPage = () => {
  const { purchaseTicket } = useParams();

  useEffect(() => {
    if (purchaseTicket) {
      // Decode and parse the purchaseTicket string to get the object
      const decodedPurchaseTicket = JSON.parse(decodeURIComponent(purchaseTicket));

      // Perform your SQL insert here using the extracted purchaseTicket object
      // Example: Insert logic using fetch or other means to your backend API
      fetch('/api/insertPurchaseTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(decodedPurchaseTicket),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Insert successful:', data);
          // Handle success, update state, etc.
        })
        .catch((error) => {
          console.error('Error inserting data:', error);
          // Handle error
        });
    }
  }, [purchaseTicket]);

  return (
    <div>
      <h1>Congratulations!</h1>
      <p>Your payment was successful. Thank you for your purchase.</p>
      {/* You can add more information or actions here */}
    </div>
  );
};

export default SuccessfulPage;
