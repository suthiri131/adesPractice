import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Header from "../../components/Header/HeaderProfile";
import "./css/createPost.css";
import bin from "../../assets/images/bin.png";
import voice from "../../assets/images/voice.png";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/profile/loading";
import recording from "../../assets/images/recording.png";
const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const onDrop = useCallback((acceptedFiles) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
  }, []);
  var uid = localStorage.getItem("userId");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*,video/*",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("createPostData")) || {};
    setTitle(storedData.title || "");
    setDescription(storedData.description || "");
    setImages(storedData.images || []);
    setLocation(storedData.location || "");
  }, []);

  useEffect(() => {
    const dataToStore = { title, description, images, location };
    localStorage.setItem("createPostData", JSON.stringify(dataToStore));
  }, [title, description, images, location]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/allPlaces");
        const responseData = await response.json();

        // Assuming responseData has a 'users' property, adjust if needed
        const locationData = responseData.places.rows || [];
        console.log("Places Data:", locationData);

        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);
  const handleMediaClick = (media) => {
    setPreviewImage(media);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };
  const handleDeleteMedia = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    if (isRecording) {
      // Stop recording logic
      recognition.stop();
      setIsRecording(false);
    } else {
      // Start recording logic

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setDescription(transcript);
      };
      recognition.start();
      setIsRecording(true);
    }
  };
  const handleUpload = async () => {
    if (!title || !description || !location || images.length === 0) {
      alert("Please input all values, including images");
      return;
    }
    const isValid = /^[a-zA-Z0-9\s\.,?!@#$%^&*()_+=\-:;'"\\]*$/;
    if (!(isValid.test(title) && isValid.test(description))) {
      alert("Format not accepted");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    for (const image of images) {
      formData.append("images", image);
      console.log(image);
    }

    fetch("api/uploadPost/" + uid, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("Images uploaded successfully");
          setIsLoading(false);
          navigate("/profile");
          localStorage.removeItem("createPostData");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          throw new Error(data.error || "Failed to upload images");
        }
      })
      .catch((error) => {
        console.error("Error uploading images: " + error.message);
      });
  };

  return (
    <div className="createPost">
      <Header />

      <div className="container ">
        <div className="col-12 head">
          <h1>Create post</h1>
        </div>
        <div id="upload-form">
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
            <div className="description-container">
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              <img
                src={isRecording ? recording : voice}
                alt={isRecording ? "Recording Icon" : "Voice Icon"}
                onClick={handleVoiceInput}
                className={`voice ${isRecording ? "ripple" : ""}`}
              />
            </div>
          </div>
          <label>Choose a location:</label>
          <select
            id="location"
            name="location"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.placeid} value={loc.placeid}>
                {loc.place_name}
              </option>
            ))}
          </select>

          {images.length > 0 && (
            <div className="image-preview">
              <p>Selected Images:</p>
              {images.map((file, index) => (
                <div key={file.name} className="image-container">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    onClick={() => handleMediaClick(file)}
                    className="preview-image"
                  />
                  <img
                    src={bin}
                    alt="Delete"
                    className="bin-icon"
                    onClick={() => handleDeleteMedia(index)}
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
            <p>
              📸Drag 'n' drop your images or videos here, or click to select
              files
            </p>
          </div>
          {previewImage && (
            <div className="full-image-preview" onClick={handleClosePreview}>
              <img src={URL.createObjectURL(previewImage)} alt="Full Preview" />
            </div>
          )}

          <button
            className="upload"
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? <Loading /> : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
