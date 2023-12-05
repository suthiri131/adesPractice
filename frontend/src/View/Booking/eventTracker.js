import React, { useState, useEffect } from "react";
import Header from "../../components/Header/HeaderHome";
import profilePic from "../../assets/images/profilePic.png";
import "./css/track.css";
import EventCard from "../../components/Cards/myEvent";
import Loading from "../../components/profile/loading";
const TrackEvent = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [cancel, setCancel] = useState([]);
  var uid = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    console.log(tab);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcomingResponse, pastResponse, cancelResponse] =
          await Promise.all([
            fetch("/api/getMyUpComingBookings/" + uid),
            fetch("/api/getMyPastBookings/" + uid),
            fetch("/api/getMyCancelBookings/" + uid),
          ]);

        const [upcomingData, pastData, cancelData] = await Promise.all([
          upcomingResponse.json(),
          pastResponse.json(),
          cancelResponse.json(),
        ]);

        setUpcoming(upcomingData.booking || []);
        setPast(pastData.booking || []);
        setCancel(cancelData.booking || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, [uid]);
  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }
    switch (activeTab) {
      case "Upcoming":
        return (
          <div>
            {upcoming.length > 0 ? (
              <div>
                {upcoming.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            ) : (
              <p>No upcoming events available</p>
            )}
          </div>
        );
      case "Past":
        return (
          <div>
            {" "}
            {past.length > 0 ? (
              <div>
                {past.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            ) : (
              <p>No past events available</p>
            )}
          </div>
        );
      case "CancelledEvents":
        return (
          <div>
            {" "}
            {cancel.length > 0 ? (
              <div>
                {cancel.map((event, index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            ) : (
              <p>No cancelled events available</p>
            )}
          </div>
        );
      case "Vouchers":
        return <div>Vouchers content goes here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="eventTrack">
      <Header />
      <div className="sidebarTrack">
        <div className="profileTrack-section">
          <div className="profileTrack">
            <img src={profilePic} alt="Profile" />
          </div>
          {/* Other profile details can be added here */}
        </div>
        <div className="sidebarTrack-components">
          {/* Add other sidebar components (e.g., Upcoming booking, past bookings, vouchers) */}
          <div
            className={`sidebarTrack-component ${
              activeTab === "Upcoming" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Upcoming")}
          >
            Upcoming Bookings
          </div>
          <div
            className={`sidebarTrack-component ${
              activeTab === "Past" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Past")}
          >
            Past Bookings
          </div>
          <div
            className={`sidebarTrack-component ${
              activeTab === "CancelledEvents" ? "active" : ""
            }`}
            onClick={() => handleTabClick("CancelledEvents")}
          >
            Cancelled Bookings
          </div>
          <div
            className={`sidebarTrack-component ${
              activeTab === "Vouchers" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Vouchers")}
          >
            Vouchers
          </div>
        </div>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default TrackEvent;
