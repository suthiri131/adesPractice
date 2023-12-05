import React, { useState } from 'react';
import EditProfile from './EditProfile';
import Wallet from './Wallet';
import DeleteProfile from './DeleteProfile';
import ChoosePref from './choosePref'; 

import './css/settings.css';

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState('editProfile');

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="settings-container">
      <div className="setting-sidebar">
        <div className='settings-title'>
          <h1>Settings</h1>
        </div>
        <div
          className={`tab ${selectedTab === 'editProfile' ? 'active' : ''}`}
          onClick={() => handleTabClick('editProfile')}
        >
          Edit Profile
        </div>
        <div
          className={`tab ${selectedTab === 'wallet' ? 'active' : ''}`}
          onClick={() => handleTabClick('wallet')}
        >
          Wallet
        </div>
        <div
          className={`tab ${selectedTab === 'choosePref' ? 'active' : ''}`} 
          onClick={() => handleTabClick('choosePref')} 
        >
          Choose Preferences
        </div>
        <div
          className={`tab ${selectedTab === 'deleteProfile' ? 'active' : ''}`}
          onClick={() => handleTabClick('deleteProfile')}
        >
          Delete Profile
        </div>
      </div>
      <div className="content">
        {selectedTab === 'editProfile' && <EditProfile />}
        {selectedTab === 'wallet' && <Wallet />}
        {selectedTab === 'choosePref' && <ChoosePref />}  
        {selectedTab === 'deleteProfile' && <DeleteProfile />}
      </div>
    </div>
  );
};

export default Settings;
