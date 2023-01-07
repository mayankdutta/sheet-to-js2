import React, { useState, useEffect } from "react";
import Papa from "papaparse";

import "./App.css";

const SEARCH_ENGINE_DATA_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2wDEs_PO6zvacvwEQ2XVh_CK5k5fZrXkng4W26Q0BO0EcR1EPzFj_yBleDq3ipmcU4_c_95XfIWZ9/pub?gid=1633805794&single=true&output=csv";

const RETAIL_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQz9nNSWNOABN2s-Gzk-ho5jLnMAtirgHOPFyYUBBLZ87DJ7DS0j9xRSLIfxgFNImK8nXOxXzpJ3Cie/pub?gid=781849941&single=true&output=csv";

function App() {
  const [tableData, setTableData] = useState([]);
  const [tableHeadRow, setTableHeadRow] = useState([]);

  const [filterTableData, setFilterTableData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [stores, setStores] = useState([]);
  const [displayValue, setDisplayValue] = useState("");

  const handleDropdown = (event) => {
    setInputValue(event.target.value);
    let i = 0;
    for (; i < event.target.value.length; i++) {
      if (event.target.value[i] === "-") {
        break;
      }
    }
    setDisplayValue(event.target.value.substring(0, i));
  };

  useEffect(() => {
    Papa.parse(RETAIL_URL, {
      download: true,
      // header: true,

      before: () => {},
      complete: (results) => {
        for (let i = 0; i < 5; i++) {
          results.data.shift();
        }

        // console.log(results.data)
        // results.data.map((value, index) => console.log(value[2], value[7]));
        results.data.map((value, index) =>
          setStores((prev) => [...prev, value[2]])
        );
      },
    });
  }, []);

  useEffect(() => {
    Papa.parse(SEARCH_ENGINE_DATA_URL, {
      download: true,
      // header: true,

      before: () => {
        setTableHeadRow([]);
        setTableData([]);
      },
      complete: (results) => {
        let headers = [];
        for (let i in results.data[0]) {
          headers = [...headers, results.data[0][i]];
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

        // console.log(tableHeadRow);

        for (let i in results.data) {
          // console.log(headers[i]);

          let obj = {};
          for (let j in results.data[i]) {
            // console.log(headers[j], ": ", results.data[i][j]);
            obj[headers[j]] = results.data[i][j];
          }

          // console.log(obj);
          setTableData((prev) => [...prev, { ...obj }]);
          // setTableData(prev => [...prev, {headers[i]: results.data[0][i]}]);
        }
        // setTableData(results.data);
      },
    });
  }, []);

  useEffect(() => {
    setFilterTableData(
      tableData.filter((data) => data["Site Code"] === displayValue)
    );
  }, [displayValue]);

  // console.log(tableData);
  console.log(filterTableData);

  return (
    <div className="App">
      {stores && (
        <label>
          Choose columns:
          <select value={inputValue} onChange={handleDropdown}>
            {stores.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </label>
      )}

      {filterTableData.length ? (
        <div
          style={{
            border: "2px solid black",
            borderSpacing: "0.5rem",
            borderCollapse: "collapse",
            top: "0",
            width: "100%",
          }}
        >
            <div>
              {Object.values(filterTableData[0]).map((data, index) => (
                <div key={data}>{tableHeadRow[index]} : {data}</div>
              ))}
            </div>
          </div>
      ) : (
        <h1> Loading ... </h1>
      )}
    </div>
  );
}

export default App;
