import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const numRows = 25;
const numCols = 25;
const Dashboard = () => {
  const navigate = useNavigate();

  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });
  const [gridName, setGridName] = useState("Grid 1");
  const [gridList, setGridList] = useState([{ name: gridName, grid: grid }]);

  const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  };

  const handleAddGrid = () => {
    const newGridName = `Grid ${gridList.length + 1}`;
    setGridList([
      ...gridList,
      { name: newGridName, grid: generateEmptyGrid() },
    ]);
  };

  return (
    <div
      style={{
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
        height: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "50%",
          margin: "auto",
          border: "1px solid black",
          height: "50%",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: "20px",
        }}
      >
        {gridList.map((gridItem, index) => (
          <button
            style={{
              padding: "12px 20px",
              borderRadius: "5px",
              width: "30%",
              cursor: "pointer",
            }}
            key={index}
            onClick={() =>
              navigate("/playzone", {
                state: { gridName: gridItem.name, activeIndex: index },
              })
            }
          >
            {gridItem.name}
          </button>
        ))}
        <button
          style={{
            padding: "12px 20px",
            borderRadius: "5px",
            width: "30%",
            cursor: "pointer",
          }}
          onClick={handleAddGrid}
        >
          + Add
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
