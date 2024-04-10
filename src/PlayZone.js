import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { produce } from "immer";

const PlayZone = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const [activeGridName, setActiveGridName] = useState("");

  const [generation, setGeneration] = useState(0);
  const [rowsAndCols, setRowsAndCols] = useState({ numCols: 58, numRows: 15 });
  const [cellSize, setCellSize] = useState({ height: 20, width: 20 });

  //   start running the gri patter life game
  const handleStartStop = () => {
    setRunning(!running);
  };

  //   generate grids
  const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < rowsAndCols.numRows; i++) {
      rows.push(Array.from(Array(rowsAndCols.numCols), () => 0));
    }
    return rows;
  };

  //   grid state
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < rowsAndCols.numRows; i++) {
      rows.push(Array.from(Array(rowsAndCols.numCols), () => 0));
    }
    return rows;
  });

  //   reset the grids
  const handleReset = () => {
    setGrid(generateEmptyGrid());
    setGeneration(0);
    handleStartStop();
  };

  //   handlechange the name of the griname
  const hadnleChagneGridName = (e) => {
    setActiveGridName(e.target.value);
  };

  //   ===================================
  const simulateStep = () => {
    const newGrid = produce(grid, (draft) => {
      for (let i = 0; i < rowsAndCols.numRows; i++) {
        for (let j = 0; j < rowsAndCols.numCols; j++) {
          let neighbors = 0;
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (dx === 0 && dy === 0) continue;
              const newRow = i + dx;
              const newCol = j + dy;
              if (
                newRow >= 0 &&
                newRow < rowsAndCols.numRows &&
                newCol >= 0 &&
                newCol < rowsAndCols.numCols
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

  // =====================================
  const toggleCellState = (row, col) => {
    const newGrid = produce(grid, (draft) => {
      draft[row][col] = grid[row][col] ? 0 : 1;
    });
    setGrid(newGrid);
  };
  //   use effedt
  useEffect(() => {
    if (state) {
      setActiveGridName(state.gridName);
      setGeneration(state.generation);
    }
  }, []);

  //   =============================
  const handleOpenPopup = () => {
    const numRowsInput = parseInt(prompt("Enter the number of rows:", "25"));
    const numColsInput = parseInt(prompt("Enter the number of columns:", "25"));
    handleCustomizeTheNumberofCells(numRowsInput, numColsInput);
  };
  const handleCustomizeTheNumberofCells = (row, col) => {
    setRowsAndCols({ numRows: row, numCols: col });
  };
  // ===============================
  const handleOpenPopupForCellSizeCustomization = () => {
    const height = parseInt(
      prompt("Enter the size of the cell it will create cell of CxC i.e:", "25")
    );
    // const width = parseInt(prompt("Enter the number of columns:", "25"));
    handleCustomizeTheSizeOfTheCell(height);
  };

  const handleCustomizeTheSizeOfTheCell = (size) => {
    setCellSize({ height: size, width: size });
  };
  //   ================================
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(simulateStep, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, simulateStep]);

  return (
    <>
      <div
        style={{
          display: "flex",
          // justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "red",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "80%",
            margin: "auto",
            border: "1px solid black",
            height: "80%",
            borderRadius: "10px",
            display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            flexDirection: "column",
            rowGap: "20px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateRows: "auto auto auto",
            }}
          >
            <div style={{ padding: "10px" }}>
              <input
                value={activeGridName}
                onChange={hadnleChagneGridName}
                name="grid"
                style={{ padding: "20px 30px" }}
              />
            </div>
            <div
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* start stop button */}
              <button
                onClick={handleStartStop}
                style={{ padding: "15px 30px" }}
              >
                {running ? "Stop" : "Start"}
              </button>
              {/* reset button */}
              <button onClick={handleReset} style={{ padding: "15px 30px" }}>
                Pause/Reset
              </button>
              {/* home button */}
              <button
                style={{ padding: "15px 25px" }}
                onClick={() => navigate("/")}
              >
                Home Button
              </button>
            </div>

            <div
              style={{
                padding: "10px",
                minHeight: "350px",
              }}
            >
              {/* <GridArea
                numCols={rowsAndCols.numCols}
                numRows={rowsAndCols.numRows}
                running={running}
                simulateStep={simulateStep}
              /> */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${rowsAndCols.numCols}, ${cellSize.height}px)`,
                }}
              >
                {grid.map((rows, i) =>
                  rows.map((col, j) => (
                    <div
                      key={`${i}-${j}`}
                      onClick={() => toggleCellState(i, j)}
                      style={{
                        width: cellSize.width,
                        height: cellSize.height,
                        backgroundColor: grid[i][j] ? "black" : undefined,
                        border: "solid 1px black",
                      }}
                    />
                  ))
                )}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleOpenPopup}
                style={{ padding: "15px 30px" }}
              >
                Grid Size customizer
              </button>
              {/* reset button */}
              <button
                onClick={handleOpenPopupForCellSizeCustomization}
                style={{ padding: "15px 30px" }}
              >
                Cell visual customizer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================
// Popup component for customizing grid size

// ============================================

export default PlayZone;
