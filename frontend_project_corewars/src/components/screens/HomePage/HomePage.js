import { React, useState } from "react";

import Grid from "../../grid/Grid.js";
import "./HomePage.css";
import history from "../../assets/history-w.png";

function HomePage() {
  const [file, setFile] = useState();
  const [fileContent, setFileContent] = useState("");

  function handleChange(event) {
    setFile(event.target.files[0]);

    // Read the file content
    const reader = new FileReader();
    reader.onload = function (event) {
      const content = event.target.result;
      setFileContent(content);
    };
    reader.readAsText(event.target.files[0]);
  }

  return (
    <div className="home-container">
      <div className="history-tab">
        <button className="button">
          <img src={history} alt="" />
          History
        </button>
      </div>
      <div className="info-panel">
        -
        <div className="button upload">
          <form>
            <label htmlFor="file-upload" className="custom-file-upload">
              Upload
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </form>
        </div>
      </div>
      <div className="data">
        <pre className="text-field my-code-field">{fileContent}</pre>
        <div className="text-field comp-code-field"></div>
        <div className="text-field tasks-field"></div>
        <Grid />
      </div>
    </div>
  );
}

export default HomePage;
