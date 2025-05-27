import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { invoke } from "@tauri-apps/api/core";

// Mapeo de semestres (si es necesario, puedes adaptarlo o eliminarlo)
const semesterMapping = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
};

const TeacherFormModal = ({ show, handleCloseModal, onTeacherCreated }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    numeroEmpleado: "",
    departamento: "",
    semestre: "1", // Si lo necesitas para los maestros, puedes quitarlo o adaptarlo
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuardar = async () => {
    try {
      // Si es necesario adaptar la lógica para los maestros, puedes agregar más campos o eliminar los que no se usan.
      const semesterId = semesterMapping[formData.semestre]; // Si no es necesario, puedes eliminar
      // Llamada al comando Tauri para crear un maestro
      await invoke("create_teacher", {
        fullName: formData.nombre,
      });
      alert("Maestro creado exitosamente");
      onTeacherCreated?.();
      handleCloseModal(); // Cierra el modal
    } catch (error) {
      console.error("Error al crear el maestro:", error);
      alert("Hubo un error al crear el maestro");
    }
  };

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Maestro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-4">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TeacherFormModal;
