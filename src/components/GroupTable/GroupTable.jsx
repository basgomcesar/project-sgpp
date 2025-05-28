import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react"; // Asegúrate de tener instalado Lucide o usa un ícono alternativo

export default function GroupTable({
  onStudentDoubleClick,
  filters,
  refreshKey,
}) {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await invoke("get_groups");
        setGroups(data);
        setFilteredGroups(data);
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [refreshKey]);

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

  const handleRowClick = (groupId) => {
    setSelectedRow(groupId);
  };

  const handleRowDoubleClick = (group) => {
    navigate(`/groups/${group.id}`);
  };

  const handleDeleteStudent = async (groupId) => {
    const confirmed = window.confirm("¿Está seguro de eliminar al estudiante?");
    if (!confirmed) return;

    try {
      await invoke("delete_student", { groupId }); // Ajusta el nombre del comando y parámetro según tu backend
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } catch (err) {
      alert("Error al eliminar al estudiante.");
    }
  };

  if (loading)
    return (
      <div className="text-center text-secondary">Cargando grupos...</div>
    );
  if (error)
    return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre del Grupo</th>
            <th scope="col">Profesor asignado</th>
            <th scope="col">Numero de estudiantes</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <tr
                key={group.id}
                onClick={() => handleRowClick(group.id)}
                onDoubleClick={() => handleRowDoubleClick(group)}
                className={selectedRow === group.id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
              >
                <td>{group.id}</td>
                <td>{group.course_name}</td>
                <td>{group.teacher_name}</td>
                <td>{group.student_count}</td>
                <td className="text-center">
                  <Trash2
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStudent(group.id);
                    }}
                    style={{ cursor: "pointer", color: "red" }}
                    size={18}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-secondary py-4">
                No hay grupos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
