// Loading.js

import React from "react";
import "./css/loading.css"; // You can define your loading spinner styles in this CSS file

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default Loading;
