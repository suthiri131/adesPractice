// PostDetails.js
import React, { useState, useEffect } from "react";

import save from "../../assets/images/save.png";
import editIcon from "../../assets/images/edit.png";
import deleteIcon from "../../assets/images/bin.png";
import confirmSave from "../../assets/images/bookmark.png";
import { Link, useNavigate } from "react-router-dom";
import "./css/cardPost.css";
import Loading from "../profile/loading";
const ViewPost = ({ userPost }) => {
  const [isSaved, setIsSaved] = useState(false);
  var uid = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(userPost.images[0]);
  const [otherUser, setOtherUser] = useState([]);
  const [saveCount, setSaveCount] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUserDataAndCount = async () => {
      try {
        // Fetch other user data
        const userResponse = await fetch("/api/user/" + userPost.userid);
        const userData = await userResponse.json();
        const usersData = userData.users || [];
        console.log("Users Data:", usersData);
        setOtherUser(usersData);

        // Fetch save count for the current post
        const countResponse = await fetch(
          `/api/countSavedTimes/${userPost.postid}`
        );
        const countData = await countResponse.json();
        const count = countData.count;
        console.log(count);
        setSaveCount(count[0].savecount);
      } catch (error) {
        console.error("Error fetching user data or save count:", error);
      }
    };

    const fetchUserLikedPosts = async () => {
      try {
        const response = await fetch(`/api/userLikedPosts/${uid}`);

        if (response.ok) {
          const responseData = await response.json();
          console.log("rm viewpost" + responseData);
          const likedPosts = responseData.posts || [];

          // Check if the current post is in the liked posts
          const isPostLiked = likedPosts
            .map((post) => post.postid)
            .includes(userPost.postid);

          setIsSaved(isPostLiked);
        } else {
          console.error(
            "Error fetching user liked posts:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching user liked posts:", error);
      }
    };

    fetchUserDataAndCount();
    fetchUserLikedPosts();
  }, [uid, userPost.postid, userPost.userid]);

  const handleSave = async () => {
    try {
      if (isSaved) {
        // If the post is already saved, unsave it
        const response = await fetch(
          `/api/deleteSavePost/${uid}/${userPost.postid}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setIsSaved(false);
        } else {
          console.error("Error unsaving post:", response.statusText);
        }
      } else {
        // If the post is not saved, save it
        const response = await fetch(
          `/api/savePost/${uid}/${userPost.postid}`,
          {
            method: "POST",
          }
        );

        if (response.ok) {
          setIsSaved(true);
        } else {
          console.error("Error saving post:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error saving/posting:", error);
    }
  };

  const handleSmallImageClick = (image) => {
    setSelectedImage(image);
  };
  const formatDate = (timestamp) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = new Date(timestamp).toLocaleString(
      undefined,
      options
    );

    // Extracting date components
    const [month, day, year] = formattedDate.split(/\/|,|\s|:/);

    // Reformatting as "dd/mm/yyyy"
    return `${day}/${month}/${year}`;
  };
  const onHandleEdit = () => {
    if (uid == userPost.userid) {
      const editPostUrl = `/editPost/${userPost.postid}`;
      navigate(editPostUrl);
    } else {
      alert("You are unauthorized");
    }
  };
  const onHandleDelete = async () => {
    if (uid == userPost.userid) {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );

      if (shouldDelete) {
        try {
          const response = await fetch(`/api/deletePost/${userPost.postid}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const responseData = await response.json();
            console.log("Success:", responseData.posts);
            navigate("/profile", { state: { postDeleted: true } });
          } else {
            console.error("Error deleting post:", response.statusText);
          }
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      } else {
        // User clicked "Cancel"
        console.log("Deletion canceled by the user");
      }
    } else {
      alert("You are unauthorized");
    }
  };

  return (
    <div className="post-container col">
      <div className="left-section">
        <img src={selectedImage} alt="First Image" className="main-image" />
        {/* Small images below */}
        <div className="small-images">
          {userPost.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              className="small-image"
              onClick={() => handleSmallImageClick(image)}
            />
          ))}
        </div>
      </div>
      {/* Vertical Divider */}
      <div className="divider divider_main"></div>
      <div className="right-section">
        <div className="post-details">
          {/* Title, Place Name, and Description */}
          <div className="title">
            <span>{userPost.title}</span>
            {/* Save Count */}
            <div className="save-count">
              {saveCount}
              <img
                src={isSaved ? confirmSave : save}
                alt="Save Logo"
                className="save-logo"
                onClick={handleSave}
              />
            </div>
          </div>
          {uid != userPost.userid && otherUser.length > 0 && (
            <div className="userName">
              created by{" "}
              <span
                className="profile-link"
                onClick={() =>
                  navigate("/othersProfile/" + otherUser[0].userid)
                }
              >
                {otherUser[0].username}
              </span>
            </div>
          )}
          <Link
            key={userPost.locationid}
            to={`/book-place/${userPost.locationid}`}
            className="toPlacedetail"
          >
            <div className="place-name">{userPost.place_name} </div>
          </Link>
          <div className="description">{userPost.description}</div>
          {/* Created date */}
          <div className="created-date">
            Created: {formatDate(userPost.created_time)}
            {uid == userPost.userid ? (
              <div className="icons">
                <img
                  src={editIcon}
                  alt="Edit Icon"
                  className="edit-icon"
                  onClick={onHandleEdit}
                />
                <img
                  src={deleteIcon}
                  alt="Delete Icon"
                  className="delete-icon"
                  onClick={onHandleDelete}
                />
              </div>
            ) : (
              ""
            )}
          </div>

          {/* Updated Time (if not null) */}
          {userPost.updated_time && (
            <div className="updated-time">
              Updated: {formatDate(userPost.updated_time)}
            </div>
          )}
          {/* Horizontal Divider */}
          <div className="divider-horizontal"></div>
          {/* Comments */}
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
