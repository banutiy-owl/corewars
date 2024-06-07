import React from "react";
import "./Grid.css";

function Grid() {
  const rows = Array.from({ length: 64 }, (_, rowIndex) => (
    <tr key={rowIndex}>
      {Array.from({ length: 64 }, (_, colIndex) => (
        <td key={colIndex}></td>
      ))}
    </tr>
  ));

  return (
    <table className="table-border" style={{ display: 'inline-block' }}>
      <tbody>{rows}</tbody>
    </table>
  );
}

export default Grid;
