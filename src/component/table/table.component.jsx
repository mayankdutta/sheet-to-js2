import React from "react";
import "./table.styles.css";

  const isLink = (text) => {
    if (text.length < 4) return false;
    return (
      text[0] === "h" && text[1] === "t" && text[2] === "t" && text[3] === "p"
    );
  };

const Table = ({ title, data, index, tableHeadRow }) => {
  return (
    <>
      <div className="title">{title}</div>
      <div className="row">
        <span className="col column1">{tableHeadRow[index]} :</span>
        {isLink(data) ? (
          <a href={data}>
            <span className="col column2">Link</span>
          </a>
        ) : (
          <span className="col column2">{data}</span>
        )}
      </div>
    </>
  );
};

export default Table;
/*
  * 0 => store details
  * 11 => GST Details
  * 15 => Agreement Details
  * 31 => compliance Documents
  *
  */
