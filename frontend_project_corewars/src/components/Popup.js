import React from "react";
import "./styles.css";

const Popup = ({ isError, message, onClose }) => {
  const handleButtonClick = () => {
    onClose();
  };

  return (
    <div className="popup-background">
      <div className="popup">
        <p>{message}</p>
        {isError && (
          <button className="popup-button" onClick={handleButtonClick}>
            OK
          </button>
        )}
      </div>
    </div>
  );
};

export default Popup;
