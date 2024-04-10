import React, { useState, useEffect } from "react";
import { produce } from "immer";
import Dashboard from "./Dashboard";
import PlayZone from "./PlayZone";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const numRows = 25;
  const numCols = 25;

  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [gridName, setGridName] = useState("Grid 1");
  const [gridList, setGridList] = useState([{ name: gridName, grid: grid }]);
  const [selectedGridIndex, setSelectedGridIndex] = useState(0);

  const toggleCellState = (row, col) => {
    const newGrid = produce(grid, (draft) => {
      draft[row][col] = grid[row][col] ? 0 : 1;
    });

    setGrid(newGrid);
  };

  const handleStartStop = () => {
    setRunning(!running);
  };

  const handleReset = () => {
    setGrid(generateEmptyGrid());
    setGeneration(0);
  };

  const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  };

  const simulateStep = () => {
    const newGrid = produce(grid, (draft) => {
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          let neighbors = 0;
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (dx === 0 && dy === 0) continue;
              const newRow = i + dx;
              const newCol = j + dy;
              if (
                newRow >= 0 &&
                newRow < numRows &&
                newCol >= 0 &&
                newCol < numCols
              ) {
                neighbors += grid[newRow][newCol];
              }
            }
          }
          if (grid[i][j] === 1) {
            if (neighbors < 2 || neighbors > 3) {
              draft[i][j] = 0;
            }
          } else {
            if (neighbors === 3) {
              draft[i][j] = 1;
            }
          }
        }
      }
    });
    setGrid(newGrid);
    setGeneration((prevGeneration) => prevGeneration + 1);
  };

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(simulateStep, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, simulateStep]); // Add simulateStep to the dependency array

  const handleGridNameChange = (e) => {
    setGridName(e.target.value);
    const updatedGridList = [...gridList];
    updatedGridList[selectedGridIndex].name = e.target.value;
    setGridList(updatedGridList);
  };

  const handleGridSelection = (index) => {
    setSelectedGridIndex(index);
    setGrid(gridList[index].grid);
    setGridName(gridList[index].name);
  };

  const handleAddGrid = () => {
    const newGridName = `Grid ${gridList.length + 1}`;
    setGridList([
      ...gridList,
      { name: newGridName, grid: generateEmptyGrid() },
    ]);
  };

  return (
    <div>
      {/* <div>
        <button onClick={handleStartStop}>{running ? "Stop" : "Start"}</button>
        <button onClick={handleReset}>Reset</button>
        <input
          type="text"
          value={gridName}
          onChange={handleGridNameChange}
          placeholder="Grid Name"
        />
        <button onClick={handleAddGrid}>Add Grid</button>
      </div>
      <div>
        {gridList.map((gridItem, index) => (
          <button key={index} onClick={() => handleGridSelection(index)}>
            {gridItem.name}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => toggleCellState(i, j)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "black" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
      <div>Generation: {generation}</div> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/playzone" element={<PlayZone />} />
      </Routes>
      {/* <Dashboard /> */}
      {/* <PlayZone /> */}
    </div>
  );
};

export default App;
