

import React, { useState, useEffect } from 'react';
import profilePic from '../../assets/images/profilePic.png';
import './css/editProfile.css';



const EditProfile = () => {
  const [userData, setUserData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [image, setImage] = useState(profilePic);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(userData.email);
  
    if (!isValidEmail) {
      alert("Email should be in this format e.g. xxx@xxx.com");
      return;
    }
  
    // Check if the new password and confirm password match
    if (newPassword && !confirmPassword) {
      alert('Please fill Confirm New Password');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert('New Password and Confirm New Password do not match');
      return;
    }
  
    // Check if required fields are empty
    if (!userData.email || !userData.password || !userData.username) {
      alert('Please fill the required fields');
      return;
    }
  
    // Create a new FormData object
    const formData = new FormData();
  
    // Append data to the FormData object
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);
  
    // Use the fetch API to send the form data to the backend
    const userId = localStorage.getItem('userId');
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
  
    try {
      const response = await fetch(`/api/editProfile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          newPassword: newPassword
         
        }),
      });
  
      // Check if the response is successful (status code 2xx)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response as JSON
      const data = await response.json();
      alert("Profile Updated Successfully!");
  
      // Handle the response from the backend
      console.log(data);
     
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/user/${userId}`);
        const responseData = await response.json();

        if (responseData.users.length > 0) {
          const userProfile = responseData.users[0];
          setUserData({
            email: userProfile.email,
            password:userProfile.password,
            username: userProfile.username,
            password: userProfile.password,
          });
          setImage(userProfile.profile_url || profilePic);
        }
      } catch (error) {
        console.error('Error fetching user profile data:', error);
      }
    };

    fetchUserProfile();
  }, []); 

  return (
    <div>
      <h1>Edit Profile</h1>
      <form>
        <div className="profileIcon col-12">
          <input
            type="file"
            id="uploadProfile"
            name="photo"
            style={{ display: 'none' }}
           
          />
          <label htmlFor="uploadProfile" className="profilePicLabel">
            <img src={image} alt="pfp" className="profilePic" />
          </label>
         
        </div>

        <div>
          <label>Username: *</label>
          <input
            type="text"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
          />
        </div>
        <div>
          <label>Email: *</label>
          <input
            type="text"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </div>
        <div>
          <label>Password: *</label>
          <input
            type="password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            readOnly
          />
        </div>

        <div>
          <label>New Password:</label>
          <input
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>
            Confirm New Password: (Please fill this field to confirm your new
            password)
          </label>
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="save" onClick={handleSubmit}>
          Save Changes
        </button>
      </form>
     
    </div>
  );
};

export default EditProfile;
