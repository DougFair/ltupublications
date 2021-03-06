import React from "react";
import PropTypes from "prop-types";
// import { withRouter } from 'react-router'
import "./LinkButton.css";

const LinkButton = (props) => {
  const { history, location, match, staticContext, to, onClick, ...rest } =
    props;
  return (
    <button
      className="linkButton"
      {...rest}
      onClick={(event) => {
        onClick && onClick(event);
        history.push(to);
      }}
    />
  );
};

LinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default LinkButton;
