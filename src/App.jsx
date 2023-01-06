import React, { useState, useEffect } from "react";
import Papa from "papaparse";

import "./App.css";

const SEARCH_ENGINE_DATA_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2wDEs_PO6zvacvwEQ2XVh_CK5k5fZrXkng4W26Q0BO0EcR1EPzFj_yBleDq3ipmcU4_c_95XfIWZ9/pub?gid=1633805794&single=true&output=csv";

const Headers = [{}];

function App() {
  const [tableData, setTableData] = useState([]);
  const [tableHeadRow, setTableHeadRow] = useState([]);

  useEffect(() => {
    Papa.parse(SEARCH_ENGINE_DATA_URL, {
      download: true,
      // header: true,

      before: () => {
        setTableHeadRow([]);
        setTableData([]);
      },
      complete: (results) => {
        for (let i in results.data[0]) {
          setTableHeadRow((prev) => [...prev, results.data[0][i]]);
        }

        results.data.shift();
        results.data.shift();

        results.data = results.data.filter((data) => {
          let flag = false;
          for (const index in data) {
            if (data[index].length > 0) {
              flag = true;
            }
          }
          return flag;
        });

        console.log(tableHeadRow);
        setTableData(results.data);
      },
    });
  }, []);

  console.log(tableData);
  return (
    <div className="App">
      {tableData ? (
        <table
          style={{
            border: "2px solid black",
            borderSpacing: "0.5rem",
            borderCollapse: "collapse",
            top: "0",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              {tableHeadRow.map((value, index) => {
                return (
                  <th style={{ border: "2px solid black" }} key={index}>
                    {value}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {tableData.map((value, index) => (
              <tr key={index}>
                {tableData.map((subValue, subIndex) => (
                  <td key={subIndex} style={{ border: "2px solid black" }}>
                    {value[subIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1> Loading ... </h1>
      )}
    </div>
  );
}

export default App;
