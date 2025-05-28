import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

export default function HighschoolTable({ onStudentDoubleClick, filters, refreshKey }) {
  const navigate = useNavigate();

  // Estados
  const [highschools, setHighschools] = useState([]);
  const [filteredHighchools, setFilteredHighchools] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar escuelas desde backend
  useEffect(() => {
    const fetchHighSchools = async () => {
      try {
        const data = await invoke("get_schools");
        setHighschools(data);
        setFilteredHighchools(data);
      } catch (err) {
        console.error("Error al cargar escuelas:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchHighSchools();
  }, [refreshKey]);

  // Aplicar filtros a las escuelas
  useEffect(() => {
    if (highschools.length === 0) return;

    let result = [...highschools];

    if (filters?.school_name) {
      result = result.filter((highschool) =>
        highschool.school_name.toLowerCase().includes(filters.school_name.toLowerCase())
      );
    }

    setFilteredHighchools(result);
  }, [filters, highschools]);

  // Handlers
  const handleRowClick = (highschoolId) => {
    setSelectedRow(highschoolId);
    console.log("Escuela seleccionada:", highschoolId);
  };

  const handleRowDoubleClick = (highschool) => {
    navigate(`/highschools/${highschool.id}`);
  };

  // Render condicional según estado
  if (loading) return <div className="text-center text-secondary">Cargando...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">CCT</th>
            <th scope="col">Zona</th>
            <th scope="col">Director</th>
          </tr>
        </thead>
        <tbody>
          {filteredHighchools.length > 0 ? (
            filteredHighchools.map((highschool, index) => (
              <tr
                key={highschool.id}
                className={selectedRow === highschool.id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(highschool.id)}
                onDoubleClick={() => handleRowDoubleClick(highschool)}
              >
                <td>{index + 1}</td>
                <td>{highschool.school_name}</td>
                <td>{highschool.cct}</td>
                <td>{highschool.zone}</td>
                <td>{highschool.director_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-secondary py-4">
                No hay escuelas disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
