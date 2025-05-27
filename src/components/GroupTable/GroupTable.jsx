import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

export default function GroupTable({
  onStudentDoubleClick,
  filters,
  refreshKey,
}) {
  const navigate = useNavigate();

  // Estados
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar grupos desde backend
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log("Cargando grupos...");
        const data = await invoke("get_groups");
        setGroups(data);
        setFilteredGroups(data);
      } catch (err) {
        console.error("Error al cargar grupos:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [refreshKey]);

  // Aplicar filtros a los grupos
  useEffect(() => {
    if (groups.length === 0) return;

    let result = [...groups];

    if (filters?.course_name) {
      result = result.filter((group) =>
        group.course_name
          .toLowerCase()
          .includes(filters.course_name.toLowerCase())
      );
    }

    setFilteredGroups(result);
  }, [filters, groups]);

  // Handlers
  const handleRowClick = (groupId) => {
    setSelectedRow(groupId);
    console.log("Grupo seleccionado:", groupId);
  };

  const handleRowDoubleClick = (group) => {
    navigate(`/groups/${group.id}`);
  };

  // Render condicional según estado
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (filteredGroups.length === 0) return <div>No hay grupos disponibles</div>;
  // Render tabla
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre del Grupo</th>
          <th>Profesor asignado</th>
          <th>Numero de estudiantes</th>
        </tr>
      </thead>
      <tbody>
        {filteredGroups.map((group) => (
          <tr
            key={group.id}
            onClick={() => handleRowClick(group.id)}
            onDoubleClick={() => handleRowDoubleClick(group)}
            className={selectedRow === group.id ? "table-active" : ""}
            style={{ cursor: "pointer" }}
          >
            <td>{group.id}</td>
            <td>{group.course_name}</td>
            <td>{group.teacher_name}</td>
            <td>{group.student_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
