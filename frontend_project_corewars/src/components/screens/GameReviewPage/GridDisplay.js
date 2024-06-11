import React, { useState, useEffect } from "react";
import myText from "./testfile1.txt";

const Grid = ({ round, gridData }) => {
  const [fileContent, setFileContent] = useState([]);

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        if (!gridData) return;
        console.log("Grid data:", gridData);
        const lines = gridData.trim().split("\n");
        const formattedLines = lines.map((line) => {
          return line
            .trim()
            .split(";")
            .map((dataPoint) => {
              const [_, background, border] = dataPoint.split(",");
              return [parseInt(background, 10), parseInt(border, 10)];
            });
        });
        setFileContent(formattedLines);
      } catch (error) {
        console.error("Error fetching and processing data:", error);
      }
    };

    fetchFileContent();
  }, [gridData]);

  const getBackgroundColor = (value) => {
    switch (value) {
      case 1:
        return "#f03838";
      case 2:
        return "#7632cd";
      default:
        return "#1a1a1a";
    }
  };

  const getBorderColor = (value) => {
    switch (value) {
      case 0:
        return "#444";
      case 1:
        return "#f03838";
      case 2:
        return "#7632cd";
      default:
        return "#000000";
    }
  };

  const gridRows = [];
  const roundIndex = round - 1;
  if (fileContent.length > 0 && fileContent[roundIndex]) {
    const roundData = fileContent[roundIndex];
    for (let i = 0; i < 80; i++) {
      const gridCells = [];
      for (let j = 0; j < 100; j++) {
        const index = i * 100 + j;
        const [backgroundValue, borderValue] = roundData[index];

        gridCells.push(
          <div
            key={j}
            className="grid-cell"
            style={{
              backgroundColor: getBackgroundColor(backgroundValue),
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
  }

  return <div className="grid-container">{gridRows}</div>;
};
export default Grid;
