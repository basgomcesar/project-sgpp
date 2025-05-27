import HighschoolTable from "../components/HighschoolTable/HighschoolTable";
import { SDivider } from "../components/Sidebar/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HighSchoolsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  const handleSearch = () => {
    setFilters({ school_name: searchTerm });
  };

  const renderSearchBar = () => (
    <div className="filter-bar">
      <h4>Filtrar escuelas</h4>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombre de la escuela"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );

  const renderCreateButton = () => (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "250px",
        zIndex: 1000,
      }}
    >
      <button
        className="btn btn-success"
        onClick={() => navigate("/highschools/new")}
      >
        Crear nueva escuela
      </button>
    </div>
  );

  const renderSidebar = () => (
    <div
      style={{
        width: "220px",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
        position: "fixed",
        right: 0,
        top: 0,
      }}
    >
      <h4>Menú</h4>
      <button
        className="btn btn-outline-primary w-100 mb-3"
        onClick={() => navigate("/supervisores")}
      >
        Supervisores de zona
      </button>
      <button
        className="btn btn-outline-secondary w-100"
        onClick={() => navigate("/jefes")}
      >
        Jefe de sector
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex" }}>
      {/* Contenido principal */}
      <div style={{ flex: 1, padding: "20px", marginRight: "240px" }}>
        <div className="content">
          <h1>Bienvenido a la página de las escuelas</h1>
          <p>
            Escuelas telesecundarias donde los estudiantes están realizando
            prácticas profesionales
          </p>
          <SDivider />
          {renderSearchBar()}
          <SDivider />
          <HighschoolTable filters={filters} />
          {renderCreateButton()}
        </div>
      </div>

      {/* Barra lateral */}
      {renderSidebar()}
    </div>
  );
};

export default HighSchoolsPage;
