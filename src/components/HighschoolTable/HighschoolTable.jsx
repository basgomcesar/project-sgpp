import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";

export default function HighschoolTable({ onStudentDoubleClick, filters,refreshKey  }) {
  //Inicializar navigate
  const navigate = useNavigate();
  //Estado para los datos de la tabla
  const [highschools, setHighschools] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredHighchools, setFilteredHighchools] = useState([]);

  //Fetch de datos de la tabla
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

    //Filtrar los datos de la tabla
    // useEffect(() => {
    //     if (highschools.length === 0) return;
    //     let result = [...highschools];
    //     // Filtrar por nombre de la escuela (si existe en los datos)
    //     if (filters.school_name) {
    //         result = result.filter((highschool) =>
    //             highschool.school_name.toLowerCase().includes(filters.school_name.toLowerCase())
    //         );
    //     }
    // },[filters, highschools]);

    // Manejar el clic en una fila
    const handleRowClick = (highschoolId) => {
        setSelectedRow(highschoolId);
        console.log("Escuela seleccionada:", highschoolId);
    };

    //Manejar el doble clic en una fila
    const handleRowDoubleClick = (highschool) => {
        navigate(`/highschools/${highschool.id}`);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (filteredHighchools.length === 0) {
        return <div>No hay escuelas disponibles</div>;
    }

  return (
    <table className="table table-striped table-hover">
        <thead>
            <tr>
            <th scope="col">Nombre</th>
            <th scope="col">CCT</th>
            <th scope="col">Zona</th>
            <th scope="col">Director</th>
            </tr>
        </thead>
        <tbody>
            {filteredHighchools.map((highschool) => (
            <tr
                key={highschool.id}
                onClick={() => handleRowClick(highschool.id)}
                onDoubleClick={() => handleRowDoubleClick(highschool)}
                className={selectedRow === highschool.id ? "table-active" : ""}
            >
                <td>{highschool.school_name}</td>
                <td>{highschool.cct}</td>
                <td>{highschool.zone}</td>
                <td>{highschool.director_name}</td>
            </tr>
            ))}
        </tbody>
    </table>
  );
}
