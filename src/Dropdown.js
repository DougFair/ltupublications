import React from "react";
import "./Dropdown.css";

const Dropdown = (props) => {
  return (
    <div className="dropdownContainer">
      <p className="dropdownTitle"> Search papers for:</p>

      <select
        value={props.institute}
        onChange={(evt) => props.handleInstitute(evt.target.value)}
        className="instituteDropdown"
      >
        <option value="LIMS">LIMS</option>
        <option value="SABE">SABE</option>
        <option value="LTU">La Trobe University </option>
      </select>
    </div>
  );
};
export default Dropdown;
