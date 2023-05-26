import React from "react";
import "./DownloadButton.css";

const DownloadButton = (props) => {
  return (
    <button className="downloadButton" onClick={() => props.prepareData()}>
      Download List (.xlxs)
    </button>
  );
};

export default DownloadButton;
