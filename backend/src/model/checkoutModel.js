const pool = require("../config/database");
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;


exports.createCheckoutSession = async (purchaseTicket) => {
    const totalAmount = purchaseTicket.price*100;
    const quantity = purchaseTicket.quantity;
    try {
      const session = await stripe.checkout.sessions.create({
       line_items :[
        {
        price_data:{
          currency:"sgd",
          product_data:{
            name:purchaseTicket.placeName
          },
          unit_amount:totalAmount
        },
        quantity:quantity,
      }
      ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_BASE_URL}/myBookings`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/book-place/${purchaseTicket.placeId}`,
        metadata: {
          purchaseTicket: JSON.stringify(purchaseTicket) // Add purchaseTicket as metadata
        }
      });
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  };  


  module.exports.insertPurchaseTicket = async (purchaseTicket, paymentsessionId) => {
    console.log(purchaseTicket);
    console.log('userId:', purchaseTicket.userId);
    const userid = purchaseTicket.userId;
    console.log(userid);
    const placeid= purchaseTicket.placeId;
    console.log(placeid);
    const datebooked = purchaseTicket.selectedDate;
    const bookingdate= purchaseTicket.todayDate;
    const numberoftickets = purchaseTicket.quantity;
    const amountpaid= purchaseTicket.totalAmount;

    try {
        const insertQuery = `INSERT INTO bookings (userid, placeid, datebooked, bookingdate, numberoftickets)
        VALUES ($1, $2, $3, $4, $5) RETURNING bookingid`;


        const insertValues = [userid,placeid,datebooked,bookingdate,numberoftickets]; // Values to be inserted
        const result = await pool.query(insertQuery, insertValues);
        const bookingId = result.rows[0].bookingid;

        const paymentsInsertQuery = `INSERT INTO payments (bookingid, amountpaid, paymentdate, paymentmethod, transactionid)
        VALUES ($1,$2, $3, $4, $5);`;

        const paymentsInsertValues = [bookingId, amountpaid,bookingdate,'credit card', paymentsessionId];
        await pool.query(paymentsInsertQuery, paymentsInsertValues);
         
            console.log('Data inserted into the database after successful session creation.');

            return { message: 'Data inserted successfully', bookingId };

    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };