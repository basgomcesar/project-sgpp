import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

const StudentDetailsPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await invoke("get_student_by_id", {
          studentId: parseInt(id, 10),
        });
        setStudent(data);
        const practicesData = await invoke("get_practices_by_student_id", {
          sId: parseInt(id, 10),
        });
        setPractices(practicesData);
      } catch (error) {
        console.error("Error al obtener informacion del estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Cargando detalles...</p>;
  if (!student) return <p>No se encontró al estudiante</p>;

  return (
    <div className="container mt-4">
      <h2>Detalles del Estudiante</h2>
      
      <div className="row g-3" style={{ height: "calc(100vh - 150px)" }}>
        {/* Primera columna - Información del estudiante (30%) */}
        <div className="col-md-4 h-100"> {/* Cambiado a col-md-4 (~30%) */}
          <div className="card h-100">
            <div className="card-body">
              <h4 className="card-title">Información Básica</h4>
              <p>
                <strong>Nombre:</strong> {student.full_name}
              </p>
              <p>
                <strong>Matrícula:</strong> {student.control_number}
              </p>
              <p>
                <strong>Semestre:</strong> {student.semester_id}
              </p>
              <p>
                <strong>Horas acumuladas:</strong> {student.accumulated_hours}
              </p>
            </div>
          </div>
        </div>

        {/* Segunda columna - Historial de prácticas (70%) */}
        <div className="col-md-8 h-100"> {/* Cambiado a col-md-8 (~70%) */}
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h4 className="card-title">Historial de Prácticas</h4>
              <div className="flex-grow-1 overflow-auto"> {/* Contenedor scrollable */}
                {practices.length === 0 ? (
                  <div className="alert alert-info" role="alert">
                    El estudiante no tiene prácticas registradas
                  </div>
                ) : (
                  <div className="table-responsive h-100">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Escuela</th>
                          <th scope="col">Inicio</th>
                          <th scope="col">Fin</th>
                          <th scope="col">Horas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {practices.map((practice, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{practice.school_id || "N/A"}</td>
                            <td>{practice.initial_date ? new Date(practice.initial_date).toLocaleDateString() : "N/A"}</td>
                            <td>{practice.final_date ? new Date(practice.final_date).toLocaleDateString() : "N/A"}</td>
                            <td>{practice.accumulated_hours || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default StudentDetailsPage;
