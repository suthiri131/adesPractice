import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import searchIcon from "../../assets/images/search.png";
import notification from "../../assets/images/notification.png";
import messages from "../../assets/images/chat.png";
import profilePic from "../../assets/images/profilePic.png";
import dropdownIcon from "../../assets/images/down.png";
import "./css/headerProfile.css";

const ProfileHeader = () => {
  const [sticky, setSticky] = useState(false);
  const [selectedOption, setSelectedOption] = useState("all-posts");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  var uid = localStorage.getItem("userId");
  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      try {
        // Check if searchValue is empty
        const isSearchEmpty = searchValue.trim() === "";

        if (isSearchEmpty) {
          if (selectedOption === "all-posts") {
            // If searchValue is empty and selected option is "all-posts", show all posts
            const response = await fetch(`/api/allPosts`);
            const responseData = await response.json();
            const allPost = responseData.posts || [];
            console.log("All Posts:", responseData);
            navigate("/search-results", {
              state: { result: allPost, searchValue },
            });
          } else if (selectedOption === "your-posts") {
            // If searchValue is empty and selected option is "your-posts", show user-specific posts
            const response = await fetch(`/api/retrieveAllPostByUser/${uid}`);
            const responseData = await response.json();
            const userPosts = responseData.posts || [];
            console.log("User Posts:", responseData);
            navigate("/search-results", {
              state: { result: userPosts, searchValue },
            });
          }
        } else {
          // If searchValue is not empty, construct and call the search API
          let searchUrl = `/api/posts/searchPosts?title=${searchValue}&description=${searchValue}&searchByUser=`;

          // Add uid to the search URL if it's "your-posts"
          if (selectedOption === "your-posts") {
            searchUrl += `${uid}`;
          } else {
            searchUrl += `false`;
          }

          console.log("Current value of uid:", uid);
          console.log(
            "Current value of searchByUser:",
            selectedOption === "your-posts"
          );

          console.log(searchUrl);

          const response = await fetch(searchUrl);
          const responseData = await response.json();
          const searchResults = responseData.posts || [];
          console.log("Search Results:", responseData);
          navigate("/search-results", {
            state: { result: searchResults, searchValue },
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${sticky ? "sticky" : ""}`}>
      <div className="nav-inner">
        <div className="logo">
          <img className="logo-img" alt="Logo" src={logo} />
        </div>

        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/travel" className="nav-link">
          Travel
        </Link>
        <Link to="/createPost" className="nav-link">
          Create
        </Link>

        <div className="search-bar">
          <img src={searchIcon} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            onKeyDown={handleSearch}
            className="search-input"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
          <div className="divider searchDivide"></div>
          <div className="dropdown">
            <select
              className="dropdown-select-type"
              onChange={handleDropdownChange}
              value={selectedOption}
            >
              <option value="all-posts">All posts</option>
              <option value="your-posts">Your posts</option>
            </select>
          </div>
        </div>

        <Link to="/notification" className="notification">
          <img
            src={notification}
            alt="Notification"
            className="notification-icon"
          />
        </Link>
        <Link to="/chat" className="chat">
          <img src={messages} alt="Chat" className="chat-icon" />
        </Link>
        <Link to="/profile" className="chat">
          <img src={profilePic} alt="Profile" className="profile-pic" />
        </Link>

        <div className="profile-dropdown">
          <img src={dropdownIcon} alt="Profile" className="dropdown-icon" />
          <div className="profileInfo">
            <Link to={"/settings"} className="dropdown-link">
              Settings
            </Link>
            <Link to={"/myBookings"} className="dropdown-link">
              Event Tracker
            </Link>
            <Link to="/logout" className="dropdown-link">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProfileHeader;
