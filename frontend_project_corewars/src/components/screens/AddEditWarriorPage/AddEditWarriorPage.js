import React, { useState } from 'react';
import Header from "./Header";
import './styles.css'; 

const CodeEditor = () => {
    const [code, setCode] = useState('');

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

    return (
        <div className="warrior-editor">
            <Header />
            <div className="editor-section">
                <div className="editor-header">
                    <span className="warrior-label">Warrior 1</span>
                    <input type="file" className="upload-btn" onChange={handleFileUpload} />
                </div>
                <textarea
                    className="code-input"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="Enter your code here..."
                ></textarea>
                <div className="actions">
                    <button className="save-btn">Save</button>
                    <button className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
