const checkoutModel = require("../model/checkoutModel");
const stripe = require('stripe')
const sskey = 'whsec_0343984226f3113cf5b80c347daa5acf4d07a0a95246ff12a2ef7e4a674aa682';

exports.createCheckoutSession = async (req, res, next) => {
    const purchaseTicket= req.body;
    try {
      const session = await checkoutModel.createCheckoutSession(purchaseTicket);
      res.status(200).json({ session });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  };



  exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
  
  
    const payload = req.body;
    const payloadString = JSON.stringify(payload, null, 2);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: 'whsec_0343984226f3113cf5b80c347daa5acf4d07a0a95246ff12a2ef7e4a674aa682'
    });
  
    //local endpoint to test webhook
    //stripe listen --forward-to localhost:8081/webhook
    try {
      const event = stripe.webhooks.constructEvent(payloadString, header, process.env.STRIPE_ENDPOINT_SECRET);
  
      // Process the event according to its type
      if (event.type === 'checkout.session.completed') {   
        const paymentsessionId = event.data.object.id;
        
     
        const purchaseTicket = JSON.parse(event.data.object.metadata.purchaseTicket);
        console.log(purchaseTicket);
        console.log('userId:', purchaseTicket.userId);

    if (purchaseTicket) {
      try {
        // Call your database model function to insert the data
        const insertionResult = await checkoutModel.insertPurchaseTicket(purchaseTicket,paymentsessionId);

        // Log or handle the result of the insertion
        console.log('Insertion result:', insertionResult);
      } catch (error) {
        console.error('Error inserting data into database:', error);
        // Handle the database insertion error
      }
    } else {
      console.log('No simple metadata found');
    }
        
       
      } else {
        console.log('Unhandled event type:', event.type);
      }
  
      res.sendStatus(200); // Send the response to the client after handling the event
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
  };