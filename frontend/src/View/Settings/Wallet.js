import React, { useState } from 'react';
import wallet from "../../assets/images/wallet.png";
import './css/Wallet.css'; 

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('all'); // State to track active tab

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <img src={wallet} alt="Wallet" className="wallet-image" />
        <div className="wallet-amount">$500.00</div>
      </div>

      <div className="wallet-tabs">
        <button
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => handleTabChange('all')}
        >
          All
        </button>
        <button
          className={activeTab === 'incoming' ? 'active' : ''}
          onClick={() => handleTabChange('incoming')}
        >
          Incoming
        </button>
        <button
          className={activeTab === 'outgoing' ? 'active' : ''}
          onClick={() => handleTabChange('outgoing')}
        >
          Outgoing
        </button>
      </div>

      <div className="wallet-content">
        {/* Render content based on the active tab */}
        {activeTab === 'all' && <div>All Transactions</div>}
        {activeTab === 'incoming' && <div>Incoming Transactions</div>}
        {activeTab === 'outgoing' && <div>Outgoing Transactions</div>}
      </div>
    </div>
  );
};

export default Wallet;

//<a href="https://www.flaticon.com/free-icons/wallet" title="wallet icons">Wallet icons created by Those Icons - Flaticon</a>