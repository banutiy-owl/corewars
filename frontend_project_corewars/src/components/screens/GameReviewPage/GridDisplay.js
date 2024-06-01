import React, { useState, useEffect } from "react";
import myText from "./testfile.txt";

const Grid = () => {
  const initialGridData = Array.from({ length: 100 }, () => Array(80).fill(0));
  const [gridData, setGridData] = useState(initialGridData);
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const response = await fetch(myText);
        const text = await response.text();
        const cells = text.split(";");
        const pairs = cells
          .map((cell) => {
            const [, value1, value2] = cell.split(",");
            return [parseInt(value1, 10), parseInt(value2, 10)];
          })
          .filter((pair) => !isNaN(pair[0]) && !isNaN(pair[1]));
        setFileContent(pairs);
      } catch (error) {
        console.error("Error fetching and processing data:", error);
      }
    };

    fetchFileContent();
  }, []);

  console.log(fileContent);

  const getBackgroundColor = (value) => {
    switch (value) {
      case 0:
        return "#1a1a1a";
      case 123:
        return "#f03838";
      case 321:
        return "#7632cd";
      default:
        return "#ffffff"; // Default color if no match
    }
  };

  const getBorderColor = (value) => {
    switch (value) {
      case 0:
        return "#444";
      case 123:
        return "#f03838";
      case 321:
        return "#7632cd";
      default:
        return "#000000"; // Default border color if no match
    }
  };

  const gridRows = [];
  for (let i = 0; i < 80; i++) {
    const gridCells = [];
    for (let j = 0; j < 100; j++) {
      const index = i * 100 + j;
      const value = fileContent[index] ? fileContent[index][0] : 0;
      const borderValue = fileContent[index] ? fileContent[index][1] : 0;
      gridCells.push(
        <div
          key={j}
          className="grid-cell"
          style={{
            backgroundColor: getBackgroundColor(value),
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: getBorderColor(borderValue),
          }}
        />
      );
    }
    gridRows.push(
      <div key={i} className="grid-row">
        {gridCells}
      </div>
    );
  }

  return <div className="grid-container">{gridRows}</div>;
};

export default Grid;
