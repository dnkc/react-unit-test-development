import React from "react";

const Input = ({ id, label, onChange, help, value, type }) => {
  let inputClass = "form-control";
  if (help) {
    inputClass += " is-invalid";
  }
  return (
    <div className="mb-3">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={inputClass}
        value={value}
        type={type}
        onChange={onChange}
      />
      {help && <span className="invalid-feedback">{help}</span>}
    </div>
  );
};

export default Input;
