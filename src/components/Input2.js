import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Input2.css";

const Input2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { rowCount, columnCount } = location.state || {
    rowCount: 2,
    columnCount: 2,
  };

  const [upperTableColumns, setUpperTableColumns] = useState([]);
  const [upperRow, setUpperRow] = useState([]); // Data for upper table
  const [lowerTableColumns, setLowerTableColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [extremum, setExtremum] = useState("min");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showError, setShowError] = useState(false);
  const [emptyCells, setEmptyCells] = useState([]); // Stores the empty cell coordinates

  useEffect(() => {
    const upperCols = Array.from(
      { length: columnCount },
      (_, i) => `X${i + 1}`
    ).concat("Екстремум");
    const lowerCols = Array.from(
      { length: columnCount },
      (_, i) => `X${i + 1}`
    ).concat("Знак", "Значення");
    const initialRows = Array.from({ length: rowCount }, (_, i) => ({
      id: i + 1,
      data: Array(columnCount + 2).fill(""),
    }));
    const initialUpperRow = Array(columnCount).fill(""); // Initialize upper table row

    setUpperTableColumns(upperCols);
    setUpperRow(initialUpperRow);
    setLowerTableColumns(lowerCols);
    setRows(initialRows);
  }, [rowCount, columnCount]);

  const addColumn = () => {
    const newUpperIndex = upperTableColumns.length;
    const newLowerIndex = lowerTableColumns.length - 2;

    const newUpperCol = `X${newUpperIndex}`;
    const newLowerCol = `X${newLowerIndex + 1}`;

    setUpperTableColumns((prev) => [
      ...prev.slice(0, -1),
      newUpperCol,
      "Екстремум",
    ]);

    setLowerTableColumns((prev) => [
      ...prev.slice(0, -2),
      newLowerCol,
      "Знак",
      "Значення",
    ]);

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        data: [...row.data.slice(0, -2), "", ...row.data.slice(-2)],
      }))
    );
  };

  const removeColumn = () => {
    if (upperTableColumns.length > 1) {
      setUpperTableColumns(upperTableColumns.slice(0, -2).concat("Екстремум"));
      setLowerTableColumns(
        lowerTableColumns.slice(0, -3).concat("Знак", "Значення")
      );
      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          data: row.data.slice(0, -3).concat(row.data.slice(-2)),
        }))
      );
    }
  };

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1,
        data: Array(lowerTableColumns.length).fill(""),
      },
    ]);
  };

  const removeRow = () => {
    if (rows.length > 1) setRows(rows.slice(0, -1));
  };

  const handleUpperInputChange = (e, index) => {
    const value = e.target.value;
    const regex = /^-?\d*\.?\d*$/; // Allow only numbers
    if (regex.test(value)) {
      const newUpperRow = [...upperRow];
      newUpperRow[index] = value;
      setUpperRow(newUpperRow);
      setEmptyCells((prev) =>
        prev.filter((cell) => cell.row !== 0 || cell.col !== index)
      );
    }
  };

  const handleLowerInputChange = (e, rowIndex, colIndex) => {
    const value = e.target.value;
    const regex = /^-?\d*\.?\d*$/;
    if (regex.test(value)) {
      const newRows = [...rows];
      newRows[rowIndex].data[colIndex] = value;
      setRows(newRows);
      setEmptyCells((prev) =>
        prev.filter((cell) => cell.row !== rowIndex || cell.col !== colIndex)
      );
    }
  };

  const handleContinue = () => {
    const emptyCellsFound = [];

    // Check upper table
    upperRow.forEach((cell, index) => {
      if (cell === "") {
        emptyCellsFound.push({ row: 0, col: index });
      }
    });

    // Check lower table
    rows.forEach((row, rowIndex) => {
      row.data.forEach((cell, colIndex) => {
        if (
          cell === "" &&
          lowerTableColumns[colIndex] !== "Знак" // Skip "Знак" column
        ) {
          emptyCellsFound.push({ row: rowIndex + 1, col: colIndex });
        }
      });
    });

    if (emptyCellsFound.length > 0) {
      setEmptyCells(emptyCellsFound);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } else {
      navigate("/element", {
        state: { upperTableColumns, upperRow, lowerTableColumns, rows },
      });
    }
  };

  return (
    <div className="frame">
      <div className="header"></div>

      {showError && (
        <div className="error-popup">
          Будь ласка, заповніть всі комірки перед продовженням
        </div>
      )}

      <div className="table-container">
        {/* Upper Table */}
        <table
          onClick={() => setSelectedTable("upper")}
          className={selectedTable === "upper" ? "selected-table" : ""}
        >
          <thead>
            <tr>
              {upperTableColumns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {upperTableColumns.slice(0, -1).map((col, index) => (
                <td key={index}>
                  <input
                    type="text"
                    value={upperRow[index] || ""}
                    onChange={(e) => handleUpperInputChange(e, index)}
                    className={
                      emptyCells.some(
                        (cell) => cell.row === 0 && cell.col === index
                      )
                        ? "input-error"
                        : ""
                    }
                  />
                </td>
              ))}
              <td>
                <select
                  value={extremum}
                  onChange={(e) => setExtremum(e.target.value)}
                >
                  <option value="min">min</option>
                  <option value="max">max</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Lower Table */}
        <table
          onClick={() => setSelectedTable("lower")}
          className={selectedTable === "lower" ? "selected-table" : ""}
        >
          <thead>
            <tr>
              <th>№</th>
              {lowerTableColumns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                {row.data.map((cell, colIndex) => (
                  <td key={colIndex}>
                    {lowerTableColumns[colIndex] === "Знак" ? (
                      <select
                        value={cell}
                        onChange={(e) => {
                          const newRows = [...rows];
                          newRows[rowIndex].data[colIndex] = e.target.value;
                          setRows(newRows);
                        }}
                      >
                        <option value="≥">≥</option>
                        <option value="≤">≤</option>
                        <option value="=">=</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          handleLowerInputChange(e, rowIndex, colIndex)
                        }
                        className={
                          emptyCells.some(
                            (cell) =>
                              cell.row === rowIndex + 1 && cell.col === colIndex
                          )
                            ? "input-error"
                            : ""
                        }
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-row">
        <div className="button-container">
          <button className="button btn-green" onClick={addColumn}>
            Додати змінну (стовпчик)
          </button>
          <button className="button btn-red" onClick={removeColumn}>
            Видалити обраний стовпчик
          </button>
        </div>
        <div className="button-container">
          <button className="button btn-green" onClick={addRow}>
            Додати змінну (рядок)
          </button>
          <button className="button btn-red" onClick={removeRow}>
            Видалити обраний рядок
          </button>
        </div>
      </div>

      <div className="button-container_2">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FaChevronLeft />
          <span>Повернутись</span>
        </button>
        <button className="btn-next" onClick={handleContinue}>
          <span>Продовжити</span>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Input2;
