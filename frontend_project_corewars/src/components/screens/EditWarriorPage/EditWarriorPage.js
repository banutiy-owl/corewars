import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../Header";
import "./styles.css";
import axios from "axios";
import Popup from "../../Popup";


const EditWarriorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const warrior = location.state.warrior;
  const [showPopup, setShowPopup] = useState(false);
  const [isError, setIsError] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    setCode(warrior.code);
  }, [warrior]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleSaveWarrior = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          navigate("/");
        }
      const response = await axios.put(`http://127.0.0.1:5000/warrior/${warrior.id}`, {
        code: code,
        user_id: user_id,
      });
      navigate("/warriors");
    } catch (error) {
      setPopupMessage(error.response.data.error);
      setShowPopup(true);
      setIsError(true);
    }
  };

  const handleCancel = () => {
    navigate("/warriors");
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="warrior-editor">
      <Header />
      <div className="editor-section">
        <div className="editor-header">
          <span className="warrior-label">{warrior.name}</span>
          <input
            type="file"
            className="upload-btn"
            onChange={handleFileUpload}
          />
        </div>
        <textarea
          spellCheck="false"
          className="code-input"
          value={code}
          onChange={handleCodeChange}
          placeholder="Enter your code here..."
        ></textarea>
        <div className="actions">
          <button className="save-btn" onClick={handleSaveWarrior}>
            Save
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
      {showPopup && (
        <Popup
          isError={isError}
          message={popupMessage}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default EditWarriorPage;
