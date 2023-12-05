import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import searchIcon from "../../assets/images/search.png";
import notification from "../../assets/images/notification.png";
import messages from "../../assets/images/chat.png";
import profilePic from "../../assets/images/profilePic.png";
import dropdownIcon from "../../assets/images/down.png";
import "./css/headerHome.css";

const HomeHeader = ({
  
  onSearchInputChange,
  onDropdownChange,
}) => {
  const [sticky, setSticky] = useState(false);
  const [selectedOption, setSelectedOption] = useState("0");
  //const [sfpost, setsfpost] = useState([]);
  const [sfplace, setsfplace] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();

  const handleSearchFilter = async () => {
    if (event.key === "Enter") {
      try {
        const response = await fetch("/api/searchAndFilter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: searchValue,
            filter: selectedOption,
          }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Response Data:", responseData);
        const placeData=responseData.places||[]
        setsfplace(placeData);
       console.log(placeData)
        // for(let i=0;i<responseData.places.length;i++){
        //   alert(JSON.stringify(responseData.places[i]))
        // }
       // const results = responseData.results || [];
       // alert("Results: " + JSON.stringify(results));
       navigate("/searchedresults", {
        state: { searchResults: placeData, searchValue},
      });

        //onSearchFilter(results);
      } catch (error) {
        console.error("Error searching and filtering data:", error);
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
            onKeyDown={handleSearchFilter}
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
              <option value="0">None</option>
              <option value="1">Accommodation</option>
              <option value="2">Delicacies</option>
              <option value="3">Recreational</option>
              <option value="4">Shopping</option>
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

export default HomeHeader;
