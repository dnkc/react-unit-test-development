import React from "react";

const Spinner = (props) => {
  let spanClass = "spinner-border";
  if (props.size !== "big") {
    spanClass += " spinner-border-sm";
  }

  return <span className={spanClass} data-testid="test-spinner"></span>;
};

Spinner.defaultProps = {
  role: "status",
};
export default Spinner;
