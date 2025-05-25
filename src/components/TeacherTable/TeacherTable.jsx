import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

const TeacherTable = ({ onTeacherDoubleClick, filters, refreshKey }) => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await invoke("get_teachers");
        setTeachers(data);
        setFilteredTeachers(data);
      } catch (err) {
        console.error("Error al cargar maestros:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [refreshKey]);

  useEffect(() => {
    if (teachers.length === 0) return;

    let result = [...teachers];

    if (filters.materia) {
      result = result.filter((teacher) => teacher.materia === filters.materia);
    }

    if (filters.escuela) {
      result = result.filter((teacher) => teacher.escuela === filters.escuela);
    }

    if (filters.departamento) {
      result = result.filter((teacher) => teacher.departamento === filters.departamento);
    }

    setFilteredTeachers(result);
  }, [filters, teachers]);

  const handleRowClick = (teacherId) => {
    setSelectedRow(teacherId);
    console.log("Maestro seleccionado:", teacherId);
  };

  const handleRowDoubleClick = (teacher) => {
    onTeacherDoubleClick(teacher);
  };

  if (loading) return <div>Cargando maestros...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Grupo asignado</th>
        </tr>
      </thead>
      <tbody>
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher, index) => (
            <tr
              key={teacher.id}
              className={selectedRow === teacher.id ? "table-active" : ""}
              onClick={() => handleRowClick(teacher.id)}
              onDoubleClick={() => handleRowDoubleClick(teacher)}
              style={{ cursor: "pointer" }}
            >
              <td>{index + 1}</td>
              <td>{teacher.full_name}</td>
              <td>{teacher.grupo_asignado ? teacher.grupo_asignado : "Ninguno"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center">
              No se encontraron maestros con los filtros aplicados
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TeacherTable;
