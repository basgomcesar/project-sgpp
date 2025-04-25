import React from "react";
import { Modal, Button } from "react-bootstrap";
import StudentFormModal from "./CreateStudentModal";

const ButtonCreateStudent = ({
  text,
  onClick,
  variant = "primary",
  modalTarget = null,
  show, // Recibe `show` desde el padre
  onShow, // Recibe función para abrir modal
  onClose,
}) => {
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (modalTarget) {
      setShowModal(true);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={() => {
          if (onClick) onClick();
          if (onShow) onShow(); // Abre el modal
        }}
      >
        {text}
      </Button>

      <StudentFormModal show={show} handleCloseModal={onClose} />
    </>
  );
};

export default ButtonCreateStudent;
