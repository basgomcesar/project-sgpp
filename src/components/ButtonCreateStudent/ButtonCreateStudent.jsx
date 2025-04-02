import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ButtonCreateStudent = ({ text, onClick, variant = "primary" }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default ButtonCreateStudent;
