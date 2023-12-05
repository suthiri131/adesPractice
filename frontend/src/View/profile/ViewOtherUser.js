// Import the necessary hooks
import React, { useState, useEffect } from "react";
import Header from "../../components/Header/HeaderProfile";
import profilePic from "../../assets/images/profilePic.png";
import "./css/profileMain.css";
import CardPost from "../../components/Cards/cardPost";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OtherUser = () => {
  const [otherUser, setOtherUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const { otherUserID } = useParams();

  alert(otherUserID);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (otherUserID) {
          const response = await fetch("/api/user/" + otherUserID);
          const responseData = await response.json();
          const usersData = responseData.users || [];
          console.log("Users Data:", usersData);
          if (usersData.length > 0) {
            console.log("Users Data:", usersData);
            setOtherUser(usersData);
          } else {
            console.log("No user data found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const fetchPost = async () => {
      try {
        const response = await fetch(
          "/api/retrieveAllPostByUser/" + otherUserID
        );
        const responseData = await response.json();
        const postData = responseData.posts || [];
        console.log("Posts Data:", postData);
        setPosts(postData);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchUser();
    fetchPost();
  }, [otherUserID]);

  return (
    <div className="profile">
      <Header />
      <div className="userBio">
        <div className="profileIcon col-12">
          <img src={profilePic} alt="pfp" className="profilePic" />
          {otherUser.length > 0 &&
            otherUser.map((user) => (
              <div key={user.userid} className="username col-12">
                {user.username}
              </div>
            ))}
        </div>
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
      </div>
    </div>
  );
};

export default OtherUser;
