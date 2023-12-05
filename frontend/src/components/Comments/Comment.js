import React, { useState, useEffect } from "react";
import "./commentStyle.css";
import { useNavigate } from "react-router-dom";

const Comment = ({ postId, postComment }) => {
  const defaultProfilePic =
    "https://i.pinimg.com/564x/c1/d2/e2/c1d2e2559aa6dab1ca40ff37d2ddd9fe.jpg";
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem("userId");
  console.log("what is this userid" + loggedInUserId);
  const { userid, username, date_commented, content, commentid } = postComment;
  const showEditButton = loggedInUserId == userid;
  const showDeleteButton = loggedInUserId == userid;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  //const [replyContent, setReplyContent] = useState("");
  const [replyContent, setReplyContent] = useState([]);
  const [showAllReplies, setShowAllReplies] = useState(false); // State to manage displaying all replies
  const [responseData, setResponseData] = useState(null);
  const [showRepliesSection, setShowRepliesSection] = useState(replyContent.length > 0);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset edited content to original content
    setEditedContent(content);
  };

  const handleSaveEdit = async () => {
    // Logic to save edited content
    try {
      const response = await fetch(`/api/updateComment/${commentid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        console.log("updated comment:" + updatedComment);
        //setEditedContent("edited");
        setEditedContent(updatedComment);

        setIsEditing(false);
        navigate(`/post-details/${postId}`, {
          state: { commentUpdated: true },
        });
      } else {
        console.error("Error updating comment:", response.statusText);
      }

      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (shouldDelete) {
      console.log("shoud delete , yes");
      try {
        const response = await fetch(
          `/api/deleteComment/${postComment.commentid}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          alert("delete successfully");
          const responseData = await response.json();
          console.log("Success:", responseData.posts);
          navigate(`/post-details/${postId}`, {
            state: { commentDeleted: true },
          });
        } else {
          alert("error while deleteing");
          console.error("Error deleting post:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    } else {
      // User clicked "Cancel"
      console.log("Deletion canceled by the user");
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(true);
  };

  const handleReplySubmit = async () => {
    try {
      const response = await fetch(
        `/api/addReply/${commentid}/${postId}/${loggedInUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: replyContent }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        alert("reply done");
        setShowReplyForm(false);
        fetchRepliesByCommentID();

        //navigate(`/post-details/${postId}`, { state: { replyUpdated: true } });
      } else {
        console.error("Error uploading reply:", response.statusText);
      }

      // Exit edit mode
      setShowReplyForm(false);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleCancelReply = () => {
    setShowReplyForm(false); // Hide the reply form
    fetchRepliesByCommentID();
    
   
};
  

  const fetchRepliesByCommentID = async () => {
    try {
      const response = await fetch("/api/replies/" + commentid);
      const responseData = await response.json();
      //const replyData = responseData.replies || [];
      const replyData = responseData.replies;
      console.log("Replies by commentid Data:", replyData);
      setReplyContent(replyData);
    } catch (error) {
      console.error("Error fetching reply data:", error);
    }
  };

  useEffect(() => {
    fetchRepliesByCommentID(); // Call the function within the useEffect
  }, [commentid]);

  return (
    <div className="comment-container">
      <div className="comment">
        <div className="comment-left">
          <img
            src={postComment.profilePic || defaultProfilePic}
            alt="Profile"
            className="profilePicture"
          />
        </div>
        <div className="comment-right">
          <div className="username">{username}</div>
          <div className="date">{date_commented}</div>
          {showReplyForm && (
            <div>
              <textarea
                // value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
              />
              <button onClick={handleReplySubmit}>Submit Reply</button>
              <button onClick={handleCancelReply}>Cancel Reply</button>
            </div>
          )}
          {!showReplyForm && (
            <>
              {!isEditing ? (
                <div>{content}</div>
              ) : (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              )}
              {!isEditing && showEditButton && (
                <button className="edit-button" onClick={handleEdit}>
                  Edit
                </button>
              )}
              {isEditing && showEditButton && (
                <>
                  <button className="save-button" onClick={handleSaveEdit}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </>
              )}
              {showDeleteButton && (
                <button className="delete-button" onClick={handleDelete}>
                  Delete
                </button>
              )}
              <button className="reply-button" onClick={handleReplyClick}>
                Reply
              </button>

            </>
          )}
        </div>
      </div>
      
      {!showReplyForm  && (
  <div className="replies-section">
    <button
      className="view-replies-button"
      onClick={() => {
        setShowAllReplies(!showAllReplies); // Toggle showAllReplies state
      }}
    >
      {showAllReplies ? "Hide" : "View"} {replyContent.length} replies
    </button>

    {showAllReplies && (
      <div className="all-replies">
        {/* Display all replies when showAllReplies is true */}
        {Array.isArray(replyContent) &&
                replyContent.map((reply, index) => (
                  <div key={index} className="reply">
                    <div className="reply-username">{reply.username}</div>
                    <p>{reply.content}</p>
                  </div>
                ))}
      </div>
    )}
  </div>
)}


      <hr className="comment-line" />

    </div>
  );
};

export default Comment;
