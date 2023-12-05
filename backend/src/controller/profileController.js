const multer = require("multer");
const profileModel = require("../model/profileModel");
const { cloudinary } = require("../utils/cloudinary");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const pool = require("../config/database");
exports.getAllPosts = async (req, res, next) => {
  console.log("In post controller");
  try {
    // Call the model function to get all users
    const allPosts = await profileModel.getAllPosts();
    // Send the response to the client
    res.status(200).json({ posts: allPosts });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//CREATE: upload image and post in database and cloudinary
exports.uploadPost = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { title, description, location } = req.body;
    const userID = req.params.uid;
    // Ensure cloudinary is defined
    if (!cloudinary) {
      throw new Error("Cloudinary configuration is missing");
    }

    // Insert data into the database with the current time
    const postId = await profileModel.uploadPost(
      userID,
      title,
      description,
      location
    );

    // Upload images to Cloudinary
    const uploadPromises = req.files.map(async (file) => {
      const { buffer } = file;

      // Ensure cloudinary.uploader.upload_stream is defined
      if (cloudinary.uploader && cloudinary.uploader.upload_stream) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: `ades_upload/${postId}` },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          // Pipe the buffer to the stream
          stream.end(buffer);
        });

        // Save Cloudinary image URLs in the database
        await profileModel.uploadImage(postId, uploadResult.secure_url);
      } else {
        throw new Error("Cloudinary uploader is not available");
      }
    });

    await Promise.all(uploadPromises); //concurrent
    await client.query("COMMIT");
    res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Internal server error" });
  }
};

const extractPublicIDFromURL = (imageURL) => {
  // Check if imageURL is a string
  if (typeof imageURL !== "string") {
    console.error("Invalid imageURL:", imageURL);
    return null;
  }

  // Extract the public ID from the Cloudinary URL
  const parts = imageURL.split("/");
  const filename = parts[parts.length - 1];
  const publicID = filename.split(".")[0];

  console.log("Extracted publicID:", publicID);
  return publicID;
};

exports.updatePost = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const postID = req.params.postID;

    if (!cloudinary) {
      throw new Error("Cloudinary configuration is missing");
    }

    // Update post information
    await profileModel.editPost(title, description, location, postID);

    // get images to be deleted
    var imagesToDelete = req.body.imagesToDelete || [];
    console.log("imagesToDelete:", imagesToDelete);
    //if only one image to delete make it an array
    if (!Array.isArray(imagesToDelete)) {
      imagesToDelete = [imagesToDelete];
    }
    // Delete images from Cloudinary and the database
    const deletePromises = imagesToDelete.map(async (imageURL) => {
      try {
        // Delete image from Cloudinary
        const publicID = extractPublicIDFromURL(imageURL);
        await cloudinary.uploader.destroy(publicID);

        // Delete image record from the database
        await profileModel.deleteImage(postID, imageURL);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    });

    await Promise.all(deletePromises);

    // Upload new images to Cloudinary
    const uploadPromises = req.files.map(async (file) => {
      const { buffer } = file;

      try {
        // Upload each new image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: `ades_upload/${postID}` },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          // Pipe the buffer to the stream
          stream.end(buffer);
        });

        // Save Cloudinary image URL in the database
        await profileModel.uploadImage(postID, uploadResult.secure_url);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      }
    });

    await Promise.all(uploadPromises);

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPostByUser = async (req, res, next) => {
  console.log("In place controller");
  const userID = req.params.uid;

  try {
    // Call the model function to get all users
    const allPosts = await profileModel.getPostByUser(userID);
    // Send the response to the client
    res.status(200).json({ posts: allPosts });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.checkIfSave = async (req, res) => {
  try {
    const { userID } = req.params;
    const likedPosts = await profileModel.checkIfPostIsLikedByUser(userID);
    console.log("liked post id: " + likedPosts);

    res.status(200).json({ posts: likedPosts }); // Send the array of liked posts
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//CREATE: insert into save post
exports.addSave = async (req, res) => {
  try {
    const { postID, userID } = req.params;
    const addedSave = await profileModel.insertSavedPosts(userID, postID);

    // Send the response to the client
    res.status(200).json({ count: addedSave });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteSave = async (req, res) => {
  try {
    const { postID, userID } = req.params;
    const deleteSaved = await profileModel.removeSavePost(userID, postID);

    // Send the response to the client
    res.status(200).json({ count: deleteSaved });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserByID = async (req, res, next) => {
  console.log("In getUserByID controller");
  const userID = req.params.uid;
  try {
    // Call the model function to get all users
    const user = await profileModel.getUserByID(userID);
    // Send the response to the client
    res.status(200).json({ users: user });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getPostByID = async (req, res, next) => {
  console.log("In controller");
  const postID = req.params.postID;
  try {
    // Call the model function to get all users
    const post = await profileModel.getPostByID(postID);
    // Send the response to the client
    res.status(200).json({ posts: post });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchPosts = async (req, res, next) => {
  const { title, description, searchByUser } = req.query;

  try {
    const posts = await profileModel.searchPosts({
      title,
      description,
      searchByUser,
    });
    console.log("in controller search posts", posts);
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error in searchPosts controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deletePost = async (req, res, next) => {
  const { postID } = req.params;

  try {
    // Get the images associated with the post
    const imagesToDelete = await profileModel.getImages(postID);

    // Delete images from Cloudinary
    const deletePromises = imagesToDelete.map(async (imageURL) => {
      try {
        console.log("Deleting image:", imageURL.image_url);

        // Delete image from Cloudinary
        const publicID = extractPublicIDFromURL(imageURL.image_url);
        console.log("Extracted publicID:", publicID);

        const deletionResult = await cloudinary.uploader.destroy(publicID);
        console.log("Deletion Result:", deletionResult);

        // Delete image record from the database
        await profileModel.deleteImage(postID, imageURL.image_url);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    });

    await Promise.all(deletePromises);

    // Delete the post
    const deletePostResult = await profileModel.deletePost(postID);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.countSave = async (req, res, next) => {
  try {
    const postID = req.params.postID;
    const countSave = await profileModel.countSavePost(postID);
    res.status(200).json({ count: countSave });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.placeReviews = async (req, res, next) => {
  try {
    const placeID = req.params.placeID;
    const reviews = await profileModel.recommendedPostForPlaces(placeID);
    res.status(200).json({ posts: reviews });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.similarPosts = async (req, res, next) => {
  try {
    const placeID = req.params.placeID; // Assuming you are using placeID instead of postID
    const userID = req.params.userID;
    const postID = req.params.postID;
    console.log(postID);
    const similar = await profileModel.getSimilarPosts(placeID, userID, postID);
    res.status(200).json({ posts: similar });
  } catch (error) {
    console.error("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getCommentsByPostID = async (req, res, next) => {
  console.log("Fetching comments by postID");
  const postID = req.params.postID; // Assuming the postID is passed as a parameter in the URL
  try {
    // Call the model function to get comments by postID
    const comments = await profileModel.getCommentsByPostID(postID); // Replace with your actual model function
    // Send the response to the client
    res.status(200).json({ comments: comments });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addComment = async (req, res) => {
  const { postID, userID } = req.params;
  const { content } = req.body;

  try {
    // Perform any necessary validation or data manipulation
    // Call the model method to add the comment
    const newComment = await profileModel.addComment(postID, userID, content); // Use postID here
    console.log("after successfully insert new comment");
    console.log(newComment);
    res.status(201).json({ message: "Comment added successfully", newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

exports.deleteComment = async (req, res, next) => {
  console.log("delete comment model");
  const { commentID } = req.params;
  try {
    //const deleteComment = await profileModel.deleteComment(commentID);
    const deleteReplies = await profileModel.deleteAllReplies(commentID);
    const deleteComment = await profileModel.deleteComment(commentID);
    res.status(200).json({ message: "comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentID } = req.params;
    console.log(commentID);
    const updateComment = await profileModel.updateComment(commentID, content);
    return res.status(200).json(updateComment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.addReply = async (req, res) => {
  const { commentid, postid, userid } = req.params;
  const { content } = req.body;

  try {
    const newReply = await profileModel.addReply(
      commentid,
      postid,
      userid,
      content
    );
    console.log("after successfully insert new reply");
    console.log(newReply);
    res.status(201).json({ message: "reply added successfully", newReply });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

exports.getRepliesbyCommentID = async (req, res, next) => {
  console.log("Fetching replies by comments");
  const commentID = req.params.commentid;
  try {
    // Call the model function to get replies by commentID
    const replies = await profileModel.getRepliesbyCommentID(commentID);
    // Send the response to the client
    res.status(200).json({ replies: replies });
  } catch (error) {
    console.log("Error: " + error);
    // Handle the error and send an error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};
