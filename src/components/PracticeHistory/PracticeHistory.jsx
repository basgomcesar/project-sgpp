import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom"; // <-- IMPORTANTE

const PracticeHistory = ({ practices: initialPractices }) => {
  const [practices, setPractices] = useState(initialPractices || []);
  const navigate = useNavigate(); // <-- HOOK para navegar

  const handleDelete = async (practiceId) => {
    const confirmed = window.confirm("¿Está seguro de eliminar esta práctica?");
    if (!confirmed) return;

    try {
      await invoke("delete_practice", { practiceId });
      setPractices((prev) => prev.filter((p) => p.id !== practiceId));
    } catch (error) {
      console.error("Error al eliminar práctica:", error);
      alert("Ocurrió un error al eliminar la práctica.");
    }
  };

  const handleRowDoubleClick = (practiceId) => {
    navigate(`/practicedetails/${practiceId}`); // <-- Redirige a la página de detalles
  };

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h4 className="card-title">Historial de Prácticas</h4>
        <div className="flex-grow-1 overflow-auto">
          {practices.length === 0 ? (
            <div className="alert alert-info" role="alert">
              El estudiante no tiene prácticas registradas
            </div>
          ) : (
            <div className="table-responsive h-100">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Escuela</th>
                    <th scope="col">Inicio</th>
                    <th scope="col">Fin</th>
                    <th scope="col">Horas</th>
                    <th scope="col" className="text-center">Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {practices.map((practice, index) => (
                    <tr
                      key={practice.id || index}
                      onDoubleClick={() => handleRowDoubleClick(practice.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{index + 1}</td>
                      <td>{practice.school_name || "N/A"}</td>
                      <td>{practice.initial_date ? new Date(practice.initial_date).toLocaleDateString() : "N/A"}</td>
                      <td>{practice.final_date ? new Date(practice.final_date).toLocaleDateString() : "N/A"}</td>
                      <td>{practice.practice_hours || 0}</td>
                      <td className="text-center">
                        <Trash2
                          size={18}
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(practice.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeHistory;
