import React, { useState, useEffect } from "react";
import Papa from "papaparse";

import "./App.css";

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2wDEs_PO6zvacvwEQ2XVh_CK5k5fZrXkng4W26Q0BO0EcR1EPzFj_yBleDq3ipmcU4_c_95XfIWZ9/pub?gid=547306195&single=true&output=csv";

function App() {
  const [tableData, setTableData] = useState([]);
  // const [tableHeadRow, setTableHeadRow] = useState([]);

  useEffect(() => {
    Papa.parse(URL, {
      download: true,
      // header: true,

      complete: (results) => {
        setTableData(
          results.data.filter((data) => {
            let flag = false;

            for (const index in data) {
              flag = flag || data[index] != "";
            }

            // Object.keys(data).forEach((value) => (flag = flag && value != ""));
            console.log(flag);
            return flag;
          })
        );
        console.log(results.data);

        let headers = [];
        for (let j in results.data[0]) {
          headers.push(j);
        }
        // setTableHeadRow(headers);
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
