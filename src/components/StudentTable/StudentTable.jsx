import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react"; // o usa 🗑️ si prefieres evitar librerías

const StudentTable = ({ onStudentDoubleClick, filters, refreshKey }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await invoke("get_students");
        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        console.error("Error al cargar estudiantes:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [refreshKey]);

  useEffect(() => {
    if (students.length === 0) return;

    let result = [...students];

    if (filters.grupo) {
      result = result.filter((student) => student.grupo === filters.grupo);
    }

    if (filters.escuela) {
      result = result.filter((student) => student.escuela === filters.escuela);
    }

    if (filters.semestre) {
      result = result.filter((student) => student.semester_id == filters.semestre);
    }

    setFilteredStudents(result);
  }, [filters, students]);

  const handleRowClick = (studentId) => {
    setSelectedRow(studentId);
    console.log("Estudiante seleccionado:", studentId);
  };

  const handleRowDoubleClick = (student) => {
    navigate(`/students/${student.id}`);
  };

  const handleDeleteStudent = async (studentId) => {
    const confirmed = window.confirm("¿Está seguro de eliminar al estudiante?");
    if (!confirmed) return;

    try {
      await invoke("delete_student", {  studentId }); // Ajusta si tu backend requiere otro parámetro
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch (err) {
      console.error("Error eliminando estudiante:", err);
      alert("Error al eliminar al estudiante.");
    }
  };

  if (loading) return <div className="text-center text-secondary">Cargando estudiantes...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Matrícula</th>
            <th scope="col">Semestre</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <tr
                key={student.id}
                className={selectedRow === student.id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(student.id)}
                onDoubleClick={() => handleRowDoubleClick(student)}
              >
                <td>{index + 1}</td>
                <td>{student.full_name}</td>
                <td>{student.control_number}</td>
                <td>{student.semester_id}</td>
                <td className="text-center">
                  <Trash2
                    onClick={(e) => {
                      e.stopPropagation(); // evita activar selección al eliminar
                      handleDeleteStudent(student.id);
                    }}
                    size={18}
                    style={{ color: "red", cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-secondary py-4">
                No se encontraron estudiantes con los filtros aplicados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
