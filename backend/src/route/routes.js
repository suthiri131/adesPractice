const path = require("path");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const verifyJWT = require("../middleware/verifyJWT");
const verifyUserID = require("../middleware/verifyUserid");
const loginUser = require("../controller/authController");
const registerUser = require("../controller/registerController");
const getUsers = require("../controller/test");
const places = require("../controller/placesController");
const profile = require("../controller/profileController");
const home = require("../controller/homeController");
const settings = require("../controller/settingsController");
const booking = require("../controller/bookingController");
const ticket = require("../controller/ticketsController");
const statistics = require("../controller/statisticsController");
const checkout = require("../controller/checkoutController");
const { stat } = require("fs");
const email = require("../controller/emailController");
const { updateBookingStatus } = require("../model/bookingsModel");

module.exports = (app, route) => {
  //Tasmiyah
  //profile
  route.get("/api/allPosts", profile.getAllPosts);
  route.post(
    "/api/uploadPost/:uid",
    upload.array("images"),
    profile.uploadPost
  );
  route.get("/api/retrieveAllPostByUser/:uid", profile.getPostByUser);
  route.get("/api/user/:uid", profile.getUserByID);
  route.get("/api/PostByID/:postID", profile.getPostByID);
  route.get("/api/posts/searchPosts", profile.searchPosts);
  // route.get("/api/posts/searchPosts", profile.searchAllPost);
  //   route.get("/api/posts/searchUserPost/:userID", profile.searchYourPost);
  route.put(
    "/api/updatePost/:postID",
    upload.array("images"),
    profile.updatePost
  );
  route.delete("/api/deletePost/:postID", profile.deletePost);
  route.post("/api/savePost/:userID/:postID", profile.addSave);
  route.get("/api/userLikedPosts/:userID", profile.checkIfSave);
  route.delete("/api/deleteSavePost/:userID/:postID", profile.deleteSave);
  route.get("/api/countSavedTimes/:postID", profile.countSave);
  route.get(
    "/api/similarPlacePosts/:placeID/:userID/:postID",
    profile.similarPosts
  );
  //bookings
  route.get("/api/getMyUpComingBookings/:uid", booking.UpcomingBookingsByID);
  route.get("/api/getMyPastBookings/:uid", booking.PastBookingsByID);
  route.get("/api/getMyCancelBookings/:uid", booking.CancelledBookingsByID);
  route.post(
    "/api/insertRating/:userID/:placeID/:bookingID",
    booking.insertRating
  );
  route.get("/api/getRating/:userID/:placeID/:bookingID", booking.getRatings);
  route.get("/api/getRatingByPlaceID/:placeID", booking.getRatingsByPlaceID);
  route.put("/api/updateRatingsOfPlace/:placeID", booking.updatePlaceRating);
  route.post(
    "/api/requestCancel/:userID/:placeID/:bookingID",
    booking.insertCancelRequest
  );
  route.get(
    "/api/getReqCancel/:userID/:placeID/:bookingID",
    booking.getCancelRequests
  );
  //email
  route.post("/api/send-email", email.sendEmail);
  //for places
  route.get("/api/similarPlacePosts/:placeID", profile.placeReviews);

  //Su
  //comments
  route.get("/api/CommentsByPostID/:postID", profile.getCommentsByPostID);
  route.post("/api/addComment/:postID/:userID", profile.addComment);
  route.delete("/api/deleteComment/:commentID", profile.deleteComment);
  route.put("/api/updateComment/:commentID", profile.updateComment);
  route.post("/api/addReply/:commentid/:postid/:userid", profile.addReply);
  route.get("/api/replies/:commentid", profile.getRepliesbyCommentID);
  
  route.post("/api/insertPurchaseTicket", ticket.insertPurchaseTicket);

  //booking places -> fetch tickets
  route.get(
    "/api/ticketInfo/:placeid/:selectedDate",
    ticket.getAvailableTickets
  );
  route.post("/api/createCheckoutSession", checkout.createCheckoutSession);
  // Route for handling Stripe webhook events
  route.post("/webhook", checkout.handleStripeWebhook);


  //Ren
  //login
  route.post("/api/login", loginUser.loginUserController);
  //route.post("/api/rememberMe", loginUser.userCredentialsController);

  //register
  route.post("/api/register", registerUser.registerUserController);

  //home
  route.get("/api/allPlacesHome", home.getAllPlacesHome);
  // route.get("/api/allPostsHome",verifyJWT,verifyUserID, home.getAllPostsHome);
  route.post("/api/searchAndFilter", home.searchAndFilter);

  route.get("/api/imageSlideshow", home.getSlideshow);

  route.get("/api/imageSlideshow", home.getSlideshow);
  route.get("/api/mostBooked", home.getMostBooked);
  route.get("/api/mostSavedposts", home.getMostSavedPosts);

  route.get("/api/getRecommended/:userid", home.getRecommendedPlaces);

  //settings
  // route.put(
  //   "/api/editProfile/:userId",
  //   upload.single("file"),
  //   settings.editUserProfile
  // );
  route.get("/api/getPassword/:userid", settings.getPasswordController);
  route.delete("/api/deleteUser/:userid", settings.deleteUserController);
  route.get("/api/getAllCat", settings.getAllCatController);
  route.post("/api/updatePreferences/:userId", settings.updatePreferences);
  route.get("/api/getPassword/:userid", settings.getPasswordController);
  route.delete("/api/deleteUser/:userid", settings.deleteUserController);

  route.put("/api/editProfile/:userId", settings.editProfileController);

  //Farah
  route.get("/api/book-place/:placeid", places.getPlaceByID);
  route.get("/api/getPlace/:placeid", places.getPlaceByID);
  route.get("/api/admin/search", places.getAdminSearch);

  //stats

  route.get("/api/admin/stats/totaltickets", statistics.getTotalTickets);
  route.get("/api/admin/stats/mostbookings", statistics.getMostBookingsPlace);
  route.get("/api/admin/stats/revenuepermonth", statistics.getRevenuePerMonth);
  route.get(
    "/api/admin/stats/revenuepercategory",
    statistics.getRevenuePerCategory
  );
  route.get("/api/admin/stats/totalmoney", statistics.getTotalMoney);
  route.get(
    "/api/admin/stats/mostticketspurchased",
    statistics.getMostTicketsPurchased
  );
  route.get("/api/admin/stats/mostmoneyspent", statistics.getMostMoneySpent);
  route.get("/api/admin/stats/highestrating", statistics.getHighestRating);
  route.get("/api/admin/stats/lowestrating", statistics.getLowestRating);
  route.get(
    "/api/admin/stats/highestcategorytickets",
    statistics.getMostTicketsByCat
  );
  route.get(
    "/api/admin/stats/lowestcategorytickets",
    statistics.getLeastTicketsByCat
  );


  //admin
  route.post("/api/addPlace", places.createPlace);
  route.get("/api/allPlaces", places.getAllPlaces);
  route.get("/api/categories", places.getCategories);
  route.delete("/api/deletePlace/:placeid", places.deletePlace);
  route.put("/api/updatePlace/:placeid", places.updatePlace);
  route.put("/api/bookings/:bookingid", booking.updateBookingStatus);
  route.get("/api/cancelledBookings", booking.getCancelledRequestsForAdmin);
};
