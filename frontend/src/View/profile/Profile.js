import React, { useState, useEffect } from "react";
import Header from "../../components/Header/HeaderProfile";
import profilePic from "../../assets/images/profilePic.png";
import "./css/profileMain.css";
import CardPost from "../../components/Cards/cardPost";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../components/profile/loading";
const ProfileMain = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("yourPosts");
  var uid = localStorage.getItem("userId");
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.postDeleted) {
      toast.success("Post deleted successfully", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "green",
          color: "white",
        },
      });
    }
  }, [location.state]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const userResponse = await fetch("/api/user/" + uid);
        const userData = await userResponse.json();
        const usersData = userData.users || [];
        setUsers(usersData);
        console.log(userData.users);

        // Fetch posts data based on the activeTab
        let postData = [];

        if (activeTab === "yourPosts") {
          const yourPostEndpoint = `/api/retrieveAllPostByUser/${uid}`;
          const response = await fetch(yourPostEndpoint);
          const responseData = await response.json();
          console.log(responseData + "in post by user");
          postData = responseData.posts || [];
        } else if (activeTab === "savedPosts") {
          //alert("in save post");
          const saveEndpoint = `/api/userLikedPosts/${uid}`;
          const response = await fetch(saveEndpoint);
          const responseData = await response.json();
          console.log(responseData.posts);
          postData = responseData.posts || [];
        }

        setPosts(postData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, activeTab]);

  return (
    <div className="profile">
      <Header />
      <div className="userBio">
        {users.length > 0 &&
          users.map((user) => (
            <div key={user.userid}>
              <div className="profileIcon col-12">
                {user.profile_url ? (
                  <img
                    src={user.profile_url}
                    alt="pfp"
                    className="profilePic"
                  />
                ) : (
                  <img src={profilePic} alt="Default" className="profilePic" />
                )}
              </div>
              <div className="usernameProfile col-12">{user.username}</div>
            </div>
          ))}

        <div className="tabs">
          <button
            className={`yourPosts ${activeTab === "yourPosts" ? "active" : ""}`}
            onClick={() => setActiveTab("yourPosts")}
          >
            Your Posts
          </button>
          <button
            className={`savedPosts ${
              activeTab === "savedPosts" ? "active" : ""
            }`}
            onClick={() => setActiveTab("savedPosts")}
          >
            Saved Posts
          </button>
        </div>
        {loading ? (
          <Loading /> // Render the Loading component while data is being fetched
        ) : (
          <div className="card-container col-12">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  key={post.postid}
                  to={`/post-details/${post.postid}`}
                  className="card-link"
                >
                  <CardPost post={post} />
                </Link>
              ))
            ) : (
              <div>No posts available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMain;
