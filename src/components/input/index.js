import React from 'react';
import "./style.css";

const Input = ({ label, state, setState, placeholder,type }) => (
  <div className="input-wrapper">
    <label className="label-input">{label}</label>
    <input
    type={type}
      value={state}
      placeholder={placeholder}
      onChange={(e) => setState(e.target.value)}
      className="custom-input" 
    />
  </div>
);

export default Input;