import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./View/Home/Login";
import RegisterForm from "./View/Home/Register";
import HomePage from "./View/Home/Home";
import SearchedResults from "./View/Home/SearchedResults";
import Logout from "./View/Home/Logout";

import ProfileMain from "./View/profile/Profile";
import CreatePost from "./View/profile/CreatePost";
import PostDetails from "./View/profile/PostDetails";
import PostSearchResult from "./View/profile/SearchPost";
import EditPost from "./View/profile/EditPost";
import OtherUserProfile from "./View/profile/ViewOtherUser";
import Settings from "./View/Settings/settings";
import AdminHome from "./View/Admin/adminHome";
import AddPlaceForm from "./View/Admin/addPlace";
import PlaceDetail from "./View/Home/PlaceDetails";
import viewAllPlaces from "./View/Admin/viewAllPlaces";
import EventTracker from "./View/Booking/eventTracker";
import Travel from "./View/Home/Travel";
import Sidebar from "./components/Admin/sidebar";
import UpdatePlace from "./View/Admin/updatePlace";
import BookingPage from "./View/Home/Booking";
import logo from "./assets/images/logo.png";
import { Helmet } from "react-helmet";
import SuccessfulPage from './View/Home/SuccessfulPage';

const isLoggedIn = () => {
  // Check if the user is logged in
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    return true;
  } else {
    return false;
  }
};
const isAdmin = () => {
  // Check if the user has admin privileges
  const userRole = localStorage.getItem("roleid");
  return userRole === "2";
};

const isUser=()=>{
  const userRole=localStorage.getItem("roleid");
  return userRole==='1';
}
const App = () => {
  return (
    <div className="App">
      <Helmet>
        <link rel="icon" type="image/png" href={logo} sizes="20x20" />
      </Helmet>
      <header className="App-header">
        <Routes>
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />

          <Route
            path="/"
            element={
              isLoggedIn() ? (
                isAdmin() ? (
                  <Navigate to="/admin" />
                ) : isUser() ? (
                  <HomePage />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="travel"
            element={
              isLoggedIn() ? (
                isAdmin() ? (
                  <Navigate to="/admin" />
                ) : isUser() ? (
                  <Travel />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="settings"
            element={
              isLoggedIn() ? (
                isAdmin() ? (
                  <Navigate to="/admin" />
                ) : isUser() ? (
                  <Settings />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="admin"
            element={
              isLoggedIn() ? (
                isUser() ? (
                  <Navigate to="/" />
                ) : isAdmin() ? (
                  <AdminHome />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          <Route
            path="add-place"
            element={
              isLoggedIn() ? (
                isUser() ? (
                  <Navigate to="/" />
                ) : isAdmin() ? (
                  <AddPlaceForm />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="edit/:placeid"
            element={
              isLoggedIn() ? (
                isUser() ? (
                  <Navigate to="/" />
                ) : isAdmin() ? (
                  <UpdatePlace />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="get-recommendation"
            element={
              isLoggedIn() ? (
                isAdmin() ? (
                  <Navigate to="/admin" />
                ) : isUser() ? (
                  <PlaceDetail />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="book-place/:placeid"
            element={
              isLoggedIn() ? (
                isAdmin() ? (
                  <Navigate to="/admin" />
                ) : isUser() ? (
                  <PlaceDetail />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="searchedresults"
            element={
              isLoggedIn() ? <SearchedResults /> : <Navigate to="/login" />
            }
          />
          <Route
            path="profile"
            element={
              isLoggedIn() ? (
                isAdmin() ? (
                  <Navigate to="/admin" />
                ) : isUser() ? (
                  <ProfileMain />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="createPost"
            element={
              isLoggedIn() ? (
                isAdmin() ? (
                  <Navigate to="/admin" />
                ) : isUser() ? (
                  <CreatePost />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="post-details/:postId"
            element={isLoggedIn() ? <PostDetails /> : <Navigate to="/login" />}
          />
          <Route
            path="search-results"
            element={
              isLoggedIn() ? <PostSearchResult /> : <Navigate to="/login" />
            }
          />
          <Route
            path="editPost/:postId"
            element={isLoggedIn() ? <EditPost /> : <Navigate to="/login" />}
          />
          <Route
            path="othersProfile/:otherUserID"
            element={
              isLoggedIn() ? <OtherUserProfile /> : <Navigate to="/login" />
            }
          />
          <Route
            path="myBookings"
            element={
              isLoggedIn() ? (
                isAdmin() ? (
                  <Navigate to="/admin" />
                ) : isUser() ? (
                  <EventTracker />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="logout" element={<Logout />} />

          <Route
            path="book/:placeid/:name/:price"
            element={isLoggedIn() ? <BookingPage /> : <Navigate to="/login" />}
          /> 

          <Route
            path="successfulPayment/"
            element={isLoggedIn() ? <SuccessfulPage /> : <Navigate to="/login" />}
          /> 
          
        </Routes>

        

      </header>
    </div>
  );
};

export default App;
