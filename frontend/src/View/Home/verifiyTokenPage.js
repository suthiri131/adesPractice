import React, { useState } from "react";

const VerificationPopup = ({ onClose, onSubmit }) => {
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = () => {
    onSubmit(verificationCode);
  };

  return (
    <div className="overlay">
      <div className="popup">
        <h2>Verification Code</h2>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default VerificationPopup;
