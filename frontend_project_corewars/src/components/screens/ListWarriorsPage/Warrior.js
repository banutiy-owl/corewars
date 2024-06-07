import React from "react";

const Warrior = ({ warrior, onEdit, onDelete }) => (
  <div className="warrior-block">
    <h2>{warrior.name}</h2>
    <div className="stats">
      <p>
        <div className="wl_block">
          <span className="label">Won:</span>
          <span className="won">{warrior.won}</span> <br />
        </div>
        <div className="wl_block">
          <span className="label">Lost:</span>
          <span className="lost">{warrior.lost}</span>
        </div>
      </p>
    </div>
    <div className="status">
      <span className={`status ${warrior.busy ? "busy" : "free"}`}>
        {warrior.busy ? "Busy" : "Free"}
      </span>
    </div>
    <div className="actions">
      {/* Edit button */}
      <button
        className="edit"
        onClick={() => onEdit(warrior)}
        disabled={warrior.busy}
      >
        Edit
      </button>
      {/* Delete button */}
      <button
        className="delete"
        onClick={() => onDelete(warrior.id)}
        disabled={warrior.busy}
      >
        Delete
      </button>
    </div>
  </div>
);

export default Warrior;
