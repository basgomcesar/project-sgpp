// importar el invoke de tauri
//Dentro de esta pantalla,se mostrara los detalles de una practica obtenida por el id de la practica
//1Nombre de la escuela donde se realiza la practica
//1Nombre del alumno que realiza la practica
//1Fecha de inicio y fin de la practica
//1Profesor de grupo que supervisa la practica
//1Fecha de inicio y fin de la practica
//1Maestro acompañante que supervisa la practica
//1Grado y grupo de la practica
//1Tutor asignado a la practica
//1Horas de la practica
import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useParams } from "react-router-dom";
import { SDivider } from "../components/Sidebar/styles";

function PracticeDetails() {
  const { practiceId } = useParams();
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPracticeDetails = async (id) => {
    setLoading(true);
    try {
      if (!id) {
        setError("ID de práctica no proporcionado.");
        setPractice(null);
        setLoading(false);
        return;
      }
      console.log("Fetching practice details for ID:", id);
      const result = await invoke("get_practice_details", {
        practiceId: Number(id),
      });
      setPractice(result);
      setError("");
    } catch (e) {
      setError("Error al obtener los detalles de la práctica.");
      setPractice(null);
      console.error("Error fetching practice details:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (practiceId) {
      fetchPracticeDetails(practiceId);
    }
  }, [practiceId]);

  if (loading) {
    return (
      <div className="alert alert-info">
        Cargando detalles de la práctica...
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!practice) {
    return (
      <div className="alert alert-warning">
        No se encontraron detalles para esta práctica.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Detalles de la Práctica</h2>
      <p className="mb-4">
        Aquí se muestran los detalles de la práctica seleccionada:
      </p>
      <SDivider />

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Escuela:</strong>
              <div>{practice.school_name}</div>
            </div>
            <div className="col-md-6">
              <strong>Alumno:</strong>
              <div>{practice.student_name}</div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Fecha de Inicio:</strong>
              <div>{practice.initial_date}</div>
            </div>
            <div className="col-md-6">
              <strong>Fecha de Fin:</strong>
              <div>{practice.final_date}</div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Profesor Supervisor:</strong>
              <div>{practice.group_teacher_name}</div>
            </div>
            <div className="col-md-6">
              <strong>Maestro Acompañante:</strong>
              <div>{practice.accompanying_teacher_name}</div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Grado y Grupo:</strong>
              <div>{practice.grade_and_group}</div>
            </div>
            <div className="col-md-6">
              <strong>Tutor Asignado:</strong>
              <div>{practice.assigned_tutor_name}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <strong>Horas de Práctica:</strong>
              <div>{practice.practice_hours}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeDetails;
