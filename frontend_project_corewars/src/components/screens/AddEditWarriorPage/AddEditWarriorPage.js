import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./styles.css";
import axios from "axios";

const AddEditWarriorPage = () => {
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

  const handleSaveWarrior = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          navigate("/");
        }
      const response = await axios.post("http://127.0.0.1:5000/warriors", {
        code: code,
        user_id: user_id,
      });
      if (!response.data) {
        throw new Error("Failed to save warrior");
      }
      navigate("/warriors");
    } catch (error) {
      console.error("Error saving warrior:", error);
    }
  };

  const handleCancel = () => {
    navigate("/warriors");
  };

  return (
    <div className="warrior-editor">
      <Header />
      <div className="editor-section">
        <div className="editor-header">
          <span className="warrior-label">Warrior</span>
          <input
            type="file"
            className="upload-btn"
            onChange={handleFileUpload}
          />
        </div>
        <textarea
          spellcheck="false"
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

export default AddEditWarriorPage;
