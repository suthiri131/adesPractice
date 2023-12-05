const pool = require("../config/database");

module.exports.UpcomingBookingsByID = async (userid) => {
  console.log("in bookingsModel-> booking by ID");
  try {
    const getBookingSql = `SELECT b.*,cr.is_approved,p.paymentid,p.amountpaid, p.paymentdate, p.paymentmethod, p.transactionid, pl.place_image,pl.place_name FROM bookings b 
         JOIN payments p ON p.bookingid=b.bookingid JOIN places pl ON b.placeid=pl.placeid LEFT JOIN cancel_request cr ON cr.bookingid=b.bookingid WHERE b.userid=$1 AND b.datebooked >= CURRENT_DATE ORDER BY b.datebooked DESC`;

    const userBookings = await pool.query(getBookingSql, [userid]);

    // Filter out entries where cr.is_approved is equal to 1
    const filteredBookings = userBookings.rows.filter(
      (booking) => booking.is_approved !== 1
    );

    console.log(filteredBookings);
    return filteredBookings;
  } catch (error) {
    console.log("Error in gettingBookingByID: " + error);
  }
};

module.exports.PastBookingsByID = async (userid) => {
  console.log("in bookingsModel-> booking by ID");
  try {
    const getBookingSql = `SELECT b.*,p.paymentid,p.amountpaid, p.paymentdate, p.paymentmethod, p.transactionid, pl.place_image,pl.place_name FROM bookings b 
           JOIN payments p ON p.bookingid=b.bookingid JOIN places pl ON b.placeid=pl.placeid WHERE b.userid=$1 AND b.datebooked < CURRENT_DATE ORDER BY b.datebooked DESC`;
    const userBookings = await pool.query(getBookingSql, [userid]);
    console.log(userBookings.rows);
    return userBookings.rows;
  } catch (error) {
    console.log("Error in gettingBookingByID: " + error);
  }
};
module.exports.CancelledBookings = async (userid) => {
  console.log("in bookingsModel-> booking by ID");
  try {
    const getBookingSql = `SELECT b.*,cr.is_approved,p.paymentid,p.amountpaid, p.paymentdate, p.paymentmethod, p.transactionid, pl.place_image,pl.place_name FROM bookings b 
           JOIN payments p ON p.bookingid=b.bookingid JOIN places pl ON b.placeid=pl.placeid JOIN cancel_request cr ON cr.bookingid=b.bookingid WHERE b.userid=$1 AND cr.is_approved = 1`;
    const userBookings = await pool.query(getBookingSql, [userid]);
    console.log(userBookings.rows);
    return userBookings.rows;
  } catch (error) {
    console.log("Error in gettingBookingByID: " + error);
  }
};

module.exports.insertRating = async (userid, placeid, bookingid, ratings) => {
  try {
    const insertRatingSql = `Insert INTO ratings(userid,placeid,bookingid,rating) VALUES($1,$2,$3,$4)`;
    const rated = await pool.query(insertRatingSql, [
      userid,
      placeid,
      bookingid,
      ratings,
    ]);
    return rated.rowCount;
  } catch (error) {
    console.log("Error in insertRating: " + error);
  }
};
module.exports.getRatings = async (userid, placeid, bookingid) => {
  try {
    const getRatingSql = `SELECT * from ratings where userid=$1 AND placeid=$2 AND bookingid=$3`;
    const rated = await pool.query(getRatingSql, [userid, placeid, bookingid]);
    return rated.rows;
  } catch (error) {
    console.log("Error in insertRating: " + error);
  }
};

module.exports.getRatingsByPlaceID = async (placeid) => {
  try {
    // Execute the SQL query to fetch relevant data
    const getRatingsSql = `SELECT userid, rating FROM ratings WHERE placeid=$1`;
    const ratingsData = await pool.query(getRatingsSql, [placeid]);

    // Process the data in JavaScript
    const totalCount = ratingsData.rows.length;
    const totalSum = ratingsData.rows.reduce((sum, row) => sum + row.rating, 0);

    // Return the result as an object
    return {
      total_rating: totalCount,
      rating_sum: totalSum,
    };
  } catch (error) {
    console.log("Error in getRatingsByPlaceID: " + error);
  }
};

module.exports.updatePlaceRating = async (placeid, rating) => {
  try {
    const updatePlaceRatingQuery = `UPDATE places SET rating = $1 WHERE placeid = $2`;
    const result = await pool.query(updatePlaceRatingQuery, [rating, placeid]);
    return result.rowCount;
  } catch (error) {
    console.error("Error in updatePlaceRating:", error);
  }
};

module.exports.cancelBookingRequest = async (userid, placeid, bookingid) => {
  try {
    const sql = `Insert into cancel_request(userid,placeid,bookingid,request_time) VALUES($1,$2,$3,NOW())`;
    const cancel = await pool.query(sql, [userid, placeid, bookingid]);
    return cancel.rowCount;
  } catch (error) {
    console.error("Error in cancelBookingRequest:", error);
  }
};

module.exports.getCancelRequests = async (userid, placeid, bookingid) => {
  try {
    const getCancellation = `SELECT * from cancel_request where userid=$1 AND placeid=$2 AND bookingid=$3`;
    const cancel = await pool.query(getCancellation, [
      userid,
      placeid,
      bookingid,
    ]);
    return cancel.rows;
  } catch (error) {
    console.log("Error in insertRating: " + error);
  }
};

module.exports.updateBookingStatus = async (bookingid, is_approved) => {
  console.log("in in bookings model");
  try {
    const updateSql = `
      UPDATE cancel_request
      SET is_approved = $2
      WHERE bookingid = $1
      RETURNING *
    `;

    const values = [bookingid, is_approved];

    const result = await pool.query(updateSql, values);
    console.log("result: ", result.rowCount);
    // console.log("Successfully updated place:", result.rows[0]);
    return result.rowCount;
  } catch (error) {
    console.error("Error updating place:", error);
  }
};

module.exports.getCancelledRequestsForAdmin = async () => {
  console.log("in bookingsModel-> cancelled requests");
  try {
    const getRequestsSql = `
    SELECT * from cancel_request WHERE is_approved = 0;
    `;
    const userBookings = await pool.query(getRequestsSql);
    console.log(userBookings.rows);
    return userBookings.rows;
  } catch (error) {
    console.log("Error in getCancelledRequestsForAdmin: " + error);
  }
};
