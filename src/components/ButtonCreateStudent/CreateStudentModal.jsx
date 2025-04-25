import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { invoke } from '@tauri-apps/api/core';

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

const StudentFormModal = ({  show, handleCloseModal, onStudentCreated   }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    numeroControl: "",
    semestre: "1",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuardar = async () => {
    try {
      const semesterId = semesterMapping[formData.semestre];
      // Call the Tauri command
      await invoke("create_student", {
        fullNameNew: formData.nombre,
        accumulatedHoursNew: 0,
        controlNumberNew: formData.numeroControl,
        semesterIdNew: semesterId,
      });
      alert("Estudiante creado exitosamente");
      onStudentCreated?.();
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error("Error al crear el estudiante:", error);
      alert("Hubo un error al crear el estudiante");
    }
  };

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Estudiante</Modal.Title>
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
          <div className="mb-4">
            <label className="form-label">Numero de control</label>
            <input
              type="text"
              className="form-control"
              name="numeroControl"
              value={formData.numeroControl}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Semestre</label>
            <select
              className="form-control"
              name="semestre"
              value={formData.semestre}
              onChange={handleInputChange}
            >
              <option value="1">1er Semestre</option>
              <option value="2">2do Semestre</option>
              <option value="3">3er Semestre</option>
              <option value="4">4to Semestre</option>
              <option value="5">5to Semestre</option>
              <option value="6">6to Semestre</option>
              <option value="7">7mo Semestre</option>
              <option value="8">8vo Semestre</option>
              <option value="9">9no Semestre</option>
            </select>
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

export default StudentFormModal;