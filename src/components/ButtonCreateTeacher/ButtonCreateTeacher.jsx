import React from "react";
import { Button } from "react-bootstrap";
import TeacherFormModal from "./CreateTeacherModal"; // Asegúrate de crear este archivo

const ButtonCreateTeacher = ({
  text,
  onClick,
  variant = "primary",
  show,
  onShow,
  onClose,
}) => {
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

      <TeacherFormModal show={show} handleCloseModal={onClose} />
    </>
  );
};

export default ButtonCreateTeacher;
