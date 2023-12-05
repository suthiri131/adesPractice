const bookingModel = require("../model/bookingsModel");

exports.UpcomingBookingsByID = async (req, res, next) => {
  console.log("In getBookingsByID controller");
  try {
    const { uid } = req.params;
    const allBookings = await bookingModel.UpcomingBookingsByID(uid);
    res.status(200).json({
      booking: allBookings,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.PastBookingsByID = async (req, res, next) => {
  console.log("In getBookingsByID controller");
  try {
    const { uid } = req.params;
    const allBookings = await bookingModel.PastBookingsByID(uid);
    res.status(200).json({
      booking: allBookings,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.CancelledBookingsByID = async (req, res, next) => {
  console.log("In getBookingsByID controller");
  try {
    const { uid } = req.params;
    const allBookings = await bookingModel.CancelledBookings(uid);
    res.status(200).json({
      booking: allBookings,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.insertRating = async (req, res, next) => {
  console.log("In insertRating controller");
  try {
    const { userID, placeID, bookingID } = req.params;
    const { ratings } = req.body;
    const insertBookRating = await bookingModel.insertRating(
      userID,
      placeID,
      bookingID,
      ratings
    );
    res.status(200).json({
      message: "insert success for rating",
      result: insertBookRating,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getRatings = async (req, res, next) => {
  console.log("In getBookingsByID controller");
  try {
    const { userID, placeID, bookingID } = req.params;
    const allRatings = await bookingModel.getRatings(
      userID,
      placeID,
      bookingID
    );
    res.status(200).json({
      result: allRatings,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getCancelRequests = async (req, res, next) => {
  console.log("In getBookingsByID controller");
  try {
    const { userID, placeID, bookingID } = req.params;
    const all = await bookingModel.getCancelRequests(
      userID,
      placeID,
      bookingID
    );
    res.status(200).json({
      requests: all,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getRatingsByPlaceID = async (req, res, next) => {
  console.log("In getBookingsByID controller");
  try {
    const { placeID } = req.params;
    const allRatings = await bookingModel.getRatingsByPlaceID(placeID);
    console.log(allRatings);
    res.status(200).json({
      result: allRatings,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updatePlaceRating = async (req, res, next) => {
  try {
    const { placeID } = req.params;
    const { updatedRating } = req.body;

    const updateRating = await bookingModel.updatePlaceRating(
      placeID,
      updatedRating
    );
    res.status(200).json({
      result: updateRating,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.insertCancelRequest = async (req, res, next) => {
  console.log("In insertCancelRequest controller");
  try {
    const { userID, placeID, bookingID } = req.params;

    const insertCancellation = await bookingModel.cancelBookingRequest(
      userID,
      placeID,
      bookingID
    );
    res.status(200).json({
      message: "insert success for cancel",
      result: insertCancellation,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingid = req.params.bookingid;
    const is_approved = req.query.is_approved;

    console.log('bookingid', bookingid)

    // const updateBookingStatus = {
    //   place_name: req.body.place_name,
    //   price: req.body.price,
    //   latitude: req.body.latitude,
    //   longitude: req.body.longitude,
    //   description: req.body.description,
    //   rating: req.body.rating,
    //   cat_id: req.body.cat_id,
    // };

    const result = await bookingModel.updateBookingStatus(
      bookingid,
      is_approved
    );

    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found",
      });
    }

    console.log("Successfully updated booking:", result);

    res.status(200).json({
      status: "success",
      data: {
        booking: result,
        message: "Booking updated successfully.",
      },
    });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

exports.getCancelledRequestsForAdmin = async (req, res, next) => {
  console.log("In getCancelledRequestsForAdmin controller");
  try {
    const allRequests = await bookingModel.getCancelledRequestsForAdmin();
    console.log(allRequests);
    res.status(200).json({
      result: allRequests,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
