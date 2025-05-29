import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useParams } from "react-router-dom";
import { SDivider } from "../components/Sidebar/styles";
import PDFComponent from "../utils/PDFComponent";
import { PDFDownloadLink } from "@react-pdf/renderer";

function PracticeDetails() {
  const { practiceId } = useParams();
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [newHours, setNewHours] = useState("");

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
      setNewHours(result.practice_hours);
      setError("");
    } catch (e) {
      setError("Error al obtener los detalles de la práctica.");
      setPractice(null);
      console.error("Error fetching practice details:", e);
    }
    setLoading(false);
  };

  // const handleSaveHours = async () => {
  //   try {
  //     await invoke("update_practice_hours", {
  //       practiceId: Number(practiceId),
  //       hours: Number(newHours),
  //     });
  //     setPractice((prev) => ({ ...prev, practice_hours: newHours }));
  //     setEditing(false);
  //   } catch (err) {
  //     alert("Error al actualizar las horas de práctica.");
  //     console.error(err);
  //   }
  // };

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
              <div>
                {practice.initial_date
                  ? new Date(practice.initial_date).toLocaleDateString(
                      "es-ES",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </div>
            </div>
            <div className="col-md-6">
              <strong>Fecha de Fin:</strong>
              {practice.final_date ? (
                <div>
                  {new Date(practice.final_date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              ) : (
                <div>N/A</div>
              )}
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

          {!editing && (
            <div className="col-md-6 text-end">
              <button
                className="btn btn-secondary"
                onClick={() => setEditing(true)}
              >
                Editar horas
              </button>
            </div>
          )}
          {/* Button to download the pdf */}
          <div className="mt-4">
            <div className="mt-4">
              <PDFComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticeDetails;
