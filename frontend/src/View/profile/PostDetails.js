import React, { useState, useEffect } from "react";
import Header from "../../components/Header/HeaderProfile";
import Comment from "../../components/Comments/Comment";
import "./css/profileMain.css";
import ViewPost from "../../components/Cards/ViewPost";
import { useParams, useLocation, Link } from "react-router-dom";
import CardPost from "../../components/Cards/cardPost";

const ProfileDetail = () => {
  const location = useLocation();
  const { postId } = useParams();
  const params = useParams();
  console.log("getID " + postId);
  const [post, setPost] = useState([]);
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState(""); // State for the new comment
  const [similarPost, setSimilarPosts] = useState([]);
  useEffect(() => {
    const fetchPostByID = async () => {
      try {
        const response = await fetch("/api/PostByID/" + postId);
        const responseData = await response.json();
        const postData = responseData.posts || [];
        const postArray = Array.isArray(postData) ? postData : [postData];

        console.log("Response Data:", responseData);
        console.log("Post Data:", postArray);
        setPost(postArray);

        // Extract placeid from the details of the specific post
        const placeid = postArray.length > 0 ? postArray[0].locationid : null;
        const userid = postArray.length > 0 ? postArray[0].userid : null;
        const postid = postArray.length > 0 ? postArray[0].postid : null;
        console.log(placeid);
        // Now fetch similar posts based on the retrieved placeid
        if (placeid && userid && postid) {
          fetchSimilarPosts(placeid, userid, postid);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    const fetchSimilarPosts = async (placeid, userid, postid) => {
      try {
        const response = await fetch(
          `/api/similarPlacePosts/${placeid}/${userid}/${postid}`
        );
        const responseData = await response.json();
        const postData = responseData.posts || [];
        const postArray = Array.isArray(postData) ? postData : [postData];

        console.log("Response Data (Similar Posts):", responseData);
        console.log("Similar Posts Data:", postArray);
        setSimilarPosts(postArray);
      } catch (error) {
        console.error("Error fetching similar posts:", error);
      }
    };

    fetchPostByID();
  }, [postId]); // Include postId in the dependency array

  const fetchCommentsByPostID = async () => {
    try {
      const response = await fetch("/api/CommentsByPostID/" + postId);
      const responseData = await response.json();
      const commentsData = responseData.comments || [];
      console.log("CommentsByPostID Data:", commentsData);
      setComment(commentsData);
    } catch (error) {
      console.error("Error fetching comments data:", error);
    }
  };

  useEffect(() => {
    fetchCommentsByPostID(); // Call the function within the useEffect
  }, [postId]);
  useEffect(() => {
    if (
      location.state &&
      (location.state.commentDeleted || location.state.commentUpdated)
    ) {
      fetchCommentsByPostID(); // Refetch comments when a comment is deleted
    }
  }, [location.state]);

  const addComment = async () => {
    try {
      var userId = localStorage.getItem("userId");
      const response = await fetch(`/api/addComment/${postId}/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }), // Sending the new comment content to the backend
      });

      if (response.ok) {
        console.log("wait");
        const responseData = await response.json();
        // Update comment state with the newly added comment from the backend
        // setComment([...comment, responseData.newComment]);
        setComment([responseData.newComment, ...comment]);

        setNewComment(""); // Clear the new comment textarea
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="profileDetails">
      <Header />
      <div className="container-fluid detailBox col-10">
        {post ? (
          post.map((userPost) => {
            console.log("Post ID:", userPost.postid);
            return <ViewPost key={userPost.postid} userPost={userPost} />;
          })
        ) : (
          <div>No more post</div>
        )}
      </div>
      <h2>View similar post</h2>
      <div className="card-container col-12">
        {similarPost.length === 0 ? (
          <div>
            <p>No similar posts found. Be the first one to post!</p>
            <p>
              <Link to="/createPost">Create Post</Link>
            </p>
          </div>
        ) : (
          similarPost.map((similarPostItem) => {
            console.log("Post ID of similar:", similarPostItem.postid);
            return (
              <Link
                key={similarPostItem.postid}
                to={`/post-details/${similarPostItem.postid}`}
                className="card-link"
              >
                <CardPost key={similarPostItem.postid} post={similarPostItem} />
              </Link>
            );
          })
        )}
      </div>
      <div>
        <div>comment session</div>
        {/* Comment box and Comment button */}
        <div className="comment-box">
          <textarea
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button style={{ color: "black" }} onClick={addComment}>
            Comment
          </button>
        </div>
        {comment.length > 0 ? (
          comment.map((postComment) => {
            return (
              <Comment
                key={postComment.commentid}
                postId={postId}
                postComment={postComment}
              />
            );
          })
        ) : (
          <div>No comments available</div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetail;
