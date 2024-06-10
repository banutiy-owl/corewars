import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Header";
import "./styles.css";

const AddWarriorPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

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

  const handleSaveWarrior = () => {
    navigate("/warriors");
  };

  const handleCancel = () => {
    navigate("/warriors");
  };

  return (
    <div className="warrior-editor">
      <Header />
      <div className="editor-section">
        <div className="editor-header">
          <span className="warrior-label">Warrior 1</span>
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
    </div>
  );
};

export default AddWarriorPage;
