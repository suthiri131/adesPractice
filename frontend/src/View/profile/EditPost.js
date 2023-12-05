import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Header from "../../components/Header/HeaderProfile";
import "./css/createPost.css";
import bin from "../../assets/images/bin.png";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/profile/loading";
const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [postToEdit, setPostToEdit] = useState({ images: [] });
  const [deletedImages, setDeletedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const onDrop = useCallback(
    (acceptedFiles) => {
      const newImages = [...postToEdit.images, ...acceptedFiles].slice(0, 10);
      const updatedPostToEdit = { ...postToEdit, images: newImages };
      setPostToEdit(updatedPostToEdit);
    },
    [postToEdit]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  useEffect(() => {
    const fetchPostByID = async () => {
      try {
        const response = await fetch("/api/PostByID/" + postId);
        const responseData = await response.json();
        const postData = responseData.posts || [];
        console.log(postData);
        if (Object.keys(postData).length > 0) {
          setPost(postData);
          setPostToEdit(postData);
          console.log(postToEdit)
          setTitle(postData.title);
          setDescription(postData.description);
          setLocation(postData.locationid);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostByID();
  }, [postId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/allPlaces");
        const responseData = await response.json();
        const locationData = responseData.places.rows || [];
        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleImageClick = (image) => {
    setPreviewImage(image);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const handleDeleteImage = (index) => {
    const updatedPostToEdit = { ...postToEdit };
    //getting deleted images
    const deletedImage = updatedPostToEdit.images[index];
    updatedPostToEdit.images.splice(index, 1);
    setPostToEdit(updatedPostToEdit);

    setDeletedImages([...deletedImages, deletedImage]);
  };
  const handleUpdate = async () => {
    if (!title || !description || !location || postToEdit.images.length === 0) {
      alert(
        "Please input all values, including images" +
          `location: ${location} image:${postToEdit.images.length} `
      );
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);

    for (const image of postToEdit.images) {
      formData.append("images", image);
    }
    for (const deletedImage of deletedImages) {
      formData.append("imagesToDelete", deletedImage);
    }
    try {
      const response = await fetch("/api/updatePost/" + postId, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Post updated successfully");
        setIsLoading(false);
        navigate("/profile");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="createPost">
      <Header />

      <div className="container">
        <div className="col-12 head">
          <h1>Edit post</h1>
        </div>
        {Object.keys(postToEdit).length > 0 ? (
          <div id="upload-form" key={postToEdit.postid}>
            <div className="col-12">
              <label>Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Description:</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <label>Choose a location:</label>
            <select
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value={postToEdit.locationid}>
                {postToEdit.place_name}
              </option>
              {locations.map((loc) => (
                <option key={loc.placeid} value={loc.placeid}>
                  {loc.place_name}
                </option>
              ))}
            </select>
            {postToEdit.images && Object.keys(postToEdit.images).length >  0 && (
              <div className="image-preview">
                <p>Selected Images:</p>
                {Object.keys(postToEdit.images).map((key, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={
                        postToEdit.images[key] instanceof File
                          ? URL.createObjectURL(postToEdit.images[key])
                          : postToEdit.images[key]
                      }
                      alt={`Image ${index + 1}`}
                      onClick={() => handleImageClick(postToEdit.images[key])}
                      className="preview-image"
                    />
                    <img
                      src={bin}
                      alt="Delete"
                      className="bin-icon"
                      onClick={() => handleDeleteImage(index)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "active" : ""}`}
            >
              <input {...getInputProps()} />
              <p>📸Drag 'n' drop your images here, or click to select files</p>
            </div>
            {previewImage && (
              <div className="full-image-preview" onClick={handleClosePreview}>
                <img
                  src={
                    previewImage instanceof File
                      ? URL.createObjectURL(previewImage)
                      : previewImage
                  }
                  alt="Full Preview"
                />
              </div>
            )}

            <button
              className="upload"
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? <Loading /> : "Update"}
            </button>
          </div>
        ) : (
          <div>Unable to fetch post</div>
        )}
      </div>
    </div>
  );
};

export default EditPost;
