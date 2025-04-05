import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentFormModal = ({ show, handleClose }) => {
  return (
    <div className={`modal fade ${show ? "show" : ""}`} style={{ display: show ? "block" : "none" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Crear Nuevo Estudiante</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input type="text" className="form-control" />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

const ButtonCreateStudent = ({ text, variant = "primary" }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button variant={variant} onClick={() => setShowModal(true)}>
        {text}
      </Button>
      <StudentFormModal show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
};

  export default StudentFormModal;