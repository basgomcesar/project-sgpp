import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

const TeacherTable = ({ onTeacherDoubleClick, filters, refreshKey }) => {
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

  if (loading) return <div className="text-center text-secondary">Cargando maestros...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered align-middle">
        <thead className="table-light">
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
                className={selectedRow === teacher.id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(teacher.id)}
                onDoubleClick={() => handleRowDoubleClick(teacher)}
              >
                <td>{index + 1}</td>
                <td>{teacher.full_name}</td>
                <td>{teacher.grupo_asignado ? teacher.grupo_asignado : "Ninguno"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-secondary py-4">
                No se encontraron maestros con los filtros aplicados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;
