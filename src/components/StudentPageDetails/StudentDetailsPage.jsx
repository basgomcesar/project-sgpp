import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState({
    full_name: "",
    control_number: "",
    semester_id: "",
    accumulated_hours: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await invoke("get_student_by_id", {
          studentId: parseInt(id, 10),
        });
        setStudent(data);
        setEditedStudent({
          full_name: data.full_name,
          control_number: data.control_number,
          semester_id: data.semester_id,
          accumulated_hours: data.accumulated_hours
        });
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Restaurar los valores originales
    setEditedStudent({
      full_name: student.full_name,
      control_number: student.control_number,
      semester_id: student.semester_id,
      accumulated_hours: student.accumulated_hours
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await invoke("update_student", {
        studentId: parseInt(id, 10),
        fullNameNew: editedStudent.full_name,
        controlNumberNew: editedStudent.control_number,
        semesterIdNew: editedStudent.semester_id,
        accumulatedHoursNew: parseFloat(editedStudent.accumulated_hours)
      });
      
      // Actualizar el estado del estudiante con los nuevos datos
      setStudent({
        ...student,
        full_name: editedStudent.full_name,
        control_number: editedStudent.control_number,
        semester_id: editedStudent.semester_id,
        accumulated_hours: editedStudent.accumulated_hours
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el estudiante:", error);
    }
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (!student) return <p>No se encontró al estudiante</p>;

  return (
<div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h2>Detalles del Estudiante</h2>
    {!isEditing ? (
      <button className="btn btn-primary" onClick={handleEditClick}>
        Editar Información
      </button>
    ) : (
      <div>
        <button className="btn btn-success me-2" onClick={handleSaveChanges}>
          Guardar Cambios
        </button>
        <button className="btn btn-secondary" onClick={handleCancelEdit}>
          Cancelar
        </button>
      </div>
    )}
  </div>
  
  <div className="row g-3" style={{ height: "calc(100vh - 150px)" }}>
    {/* Primera columna - Información del estudiante (50%) */}
    <div className="col-md-6 h-100">
      <div className="card h-100">
        <div className="card-body">
          <h4 className="card-title">Información Básica</h4>
          
          {isEditing ? (
            <form>
              <div className="mb-3">
                <label className="form-label"><strong>Nombre:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  name="full_name"
                  value={editedStudent.full_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><strong>Matrícula:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  name="control_number"
                  value={editedStudent.control_number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><strong>Semestre:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  name="semester_id"
                  value={editedStudent.semester_id}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <strong>Horas acumuladas:</strong> {student.accumulated_hours}
              </div>
            </form>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>

    {/* Segunda columna - Historial de prácticas (50%) */}
    <div className="col-md-6 h-100">
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