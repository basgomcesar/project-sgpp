import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ButtonCreateStudent = ({ 
  text, 
  onClick, 
  variant = "primary",
  modalTarget = null
}) => {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (modalTarget) {
      const modal = new window.bootstrap.Modal(document.getElementById(modalTarget));
      modal.show();
    }
  };

  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ButtonCreateStudent;
