import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const StudentDetailsModal = ({ student, show, onHide }) => {
  return (
    <Modal isOpen={show} toggle={onHide} size="lg">
      <ModalHeader toggle={onHide}>
        Detalles del Estudiante: {student?.full_name || ''}
      </ModalHeader>
      <ModalBody>
        {student ? (
          <div>
            <p><strong>Matrícula:</strong> {student.control_number}</p>
            <p><strong>Nombre completo:</strong> {student.full_name}</p>
            <p><strong>Semestre:</strong> {student.semester_id}</p>
            {/* Agrega más campos según sea necesario */}
          </div>
        ) : (
          <p>No se ha seleccionado ningún estudiante</p>
        )}
      </ModalBody>
    </Modal>
  );
};

export default StudentDetailsModal;