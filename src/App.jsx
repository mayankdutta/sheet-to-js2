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
  const [inputValue, setInputValue] = useState();
  const [stores, setStores] = useState(["--blank--"]);
  const [displayValue, setDisplayValue] = useState("");

  const handleDropdown = (event) => {
    setInputValue(event.target.value);
    let i = 0;
    for (; i < event.target.value.length; i++)
      if (event.target.value[i] === "-") break;

    setDisplayValue(i == "0" ? "NULL" : event.target.value.substring(0, i));
  };

  const isLink = (text) => {
    if (text.length < 4) return false;
    return (
      text[0] === "h" && text[1] === "t" && text[2] === "t" && text[3] === "p"
    );
  };

  useEffect(() => {
    Papa.parse(RETAIL_URL, {
      download: true,
      // header: true,

      before: () => {
        setStores([]);
      },
      complete: (results) => {
        for (let i = 0; i < 5; i++) {
          results.data.shift();
        }
        results.data.map((value) => setStores((prev) => [...prev, value[2]]));
      },
    });
  }, []);

  useEffect(() => {
    Papa.parse(SEARCH_ENGINE_DATA_URL, {
      download: true,

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

        for (let i = 0; i < 2; i++) results.data.shift();

        results.data = results.data.filter((data) => {
          let flag = false;
          for (const index in data) {
            flag = flag || data[index].length > 0;
          }
          return flag;
        });

        for (let i in results.data) {
          let obj = {};
          for (let j in results.data[i]) {
            obj[headers[j]] = results.data[i][j];
          }

          setTableData((prev) => [...prev, { ...obj }]);
        }
      },
    });
  }, []);

  useEffect(() => {
    setFilterTableData(
      tableData.filter((data) => data["Site Code"] === displayValue)
    );
  }, [displayValue]);

  return (
    // https://codesandbox.io/s/react-custom-dropdown-select-demo-forked-276905
    <div className="App">
      <center>
        {stores.length && tableData.length ? (
          <h2> Kindly choose values </h2>
        ) : (
          <h2>just a second </h2>
        )}
        <select value={inputValue} onChange={handleDropdown}>
          {stores.map((store) => (
            <option key={store} value={store}>
              {store}
            </option>
          ))}
        </select>
      </center>

      {filterTableData.length ? (
        <div>
          {Object.values(filterTableData[0]).map((data, index) => (
            <div key={data + index}>
              {tableHeadRow[index]} :
              {
                isLink(data) ? (
                  <a href={data}>Link</a>
                ) :
                <span>{data}</span>
              }
            </div>
          ))}
        </div>
      ) : (
        <>
          {inputValue == null ? (
            <h1> Loading ... </h1>
          ) : (
            <h1>Value not found </h1>
          )}
        </>
      )}
    </div>
  );
}

export default App;
