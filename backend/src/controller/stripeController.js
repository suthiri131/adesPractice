// // stripeController.js
// exports.handleStripeWebhook = async (req, res) => {
//     const payload = req.body;
//     console.log("-------------------")
//     console.log(payload.type);
    
//     // Logic to handle different types of Stripe events
//     // Example: Check for 'payment_intent.succeeded' event
//     if (payload.type === 'payment_intent.succeeded') {
//       const paymentIntentId = payload.data.object.id;
//       // Perform actions after successful payment (e.g., update database, send confirmation email)
//       // Your logic here...
//       console.log('Payment successfully completed for paymentIntent:', paymentIntentId);
//     } else {
//       // Handle other types of events if needed
//       console.log('kjhoUnhandled event type:', payload.type);
//     }
    
//     res.sendStatus(200); // Send a response to Stripe confirming receipt of the event
//   };
  