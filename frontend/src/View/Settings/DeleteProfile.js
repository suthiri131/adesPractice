import React, { useState, useEffect } from 'react';
import './css/deleteProfile.css';

const DeleteProfile = ({ actualPassword, onDelete }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userPassword, setUserPassword] = useState('');


   

  const handleDelete = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
        }),
      });
  
      const responseData = await response.json();
  
      // Check the response from the server
      if (responseData.success) {
        alert('Profile deleted successfully');
         
      localStorage.clear();

     
      window.location.href = '/login';
        
      } else {
        setError('Failed to delete profile. Check your password.');
        alert('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('Internal server error');
    }
  };
  
  return (
    <div className='delete-profile'>
      <h2 className='delete-profile-title'>Delete Profile</h2>
      <label className='password-confirm'>
        Password to confirm delete:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p className='error-text'>{error}</p>}
      <button className='delete' onClick={handleDelete}>Delete Profile</button>
    </div>
  );
};

export default DeleteProfile;
