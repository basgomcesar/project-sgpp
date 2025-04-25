import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate

const StudentTable = ({ onStudentDoubleClick, filters,refreshKey  }) => {
  const navigate = useNavigate(); // Inicializa useNavigate
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

    // Filtrar por grupo (si existe en los datos)
    if (filters.grupo) {
      result = result.filter((student) => student.grupo === filters.grupo);
    }

    // Filtrar por escuela (si existe en los datos)
    if (filters.escuela) {
      result = result.filter((student) => student.escuela === filters.escuela);
    }

    // Filtrar por semestre
    if (filters.semestre) {
      result = result.filter(
        (student) => student.semester_id == filters.semestre
      );
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

  if (loading) return <div>Cargando estudiantes...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Matrícula</th>
          <th scope="col">Semestre</th>
        </tr>
      </thead>
      <tbody>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <tr
              key={student.id}
              className={selectedRow === student.id ? "table-active" : ""}
              onClick={() => handleRowClick(student.id)}
              onDoubleClick={() => handleRowDoubleClick(student)}
              style={{ cursor: "pointer" }}
            >
              <td>{index + 1}</td>
              <td>{student.full_name}</td>
              <td>{student.control_number}</td>
              <td>{student.semester_id}</td>
              {/* Agrega más celdas según necesites */}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              No se encontraron estudiantes con los filtros aplicados
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StudentTable;
