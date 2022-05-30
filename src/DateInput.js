import React, { Component } from "react";
import "./DateInput.css";

class DateInput extends Component {
  state = {
    newStartDate: "",
    newEndDate: "",
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    this.props.dateInput(this.state.newStartDate, this.state.newEndDate);

    this.setState({ newStartDate: "", newEndDate: "" });
  };

  handleChange = (evt) =>
    this.setState({ [evt.target.name]: evt.target.value });

  render() {
    return (
      <div className="dateInput">
        <form className="dateInputForm" onSubmit={this.handleSubmit}>
          <div className="formItems">
            <div className="formAndLabel">
              <label
                htmlFor="newStartDate"
                style={{ margin: "0 8px 0 0", padding: 0 }}
                className="formLabel"
              >
                Start Date
              </label>
              <div className="column">
                <input
                  type="date"
                  name="newStartDate"
                  value={this.state.newStartDate}
                  placeholder="DD/MM/YYYY"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="formAndLabel">
              <label
                htmlFor="newEndDate"
                style={{ margin: "0 8px 0 0", padding: 0 }}
                className="formLabel"
              >
                End Date
              </label>

              <div className="column">
                <input
                  type="date"
                  name="newEndDate"
                  value={this.state.newEndDate}
                  placeholder="Present or enter DD/MM/YYYY"
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className="column">
              <button className="dateInputButton" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>

        <div className="searchTitle">
          <p className="instruction">
            You must enter a Start Date. End Date default to today.
          </p>
        </div>
      </div>
    );
  }
}

export default DateInput;
