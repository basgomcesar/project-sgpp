import { SDivider } from "../components/Sidebar/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
 import GroupTable from "../components/GroupTable/GroupTable";

const GroupsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  const handleSearch = () => {
    setFilters({ group_name: searchTerm });
  };
  const renderSearchBar = () => (
    <div className="filter-bar">
      <h2>Filtrar grupos</h2>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombre del grupo"
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
        left: "100px",
        zIndex: 1000,
      }}
    >
      <button
        className="btn btn-success"
        onClick={() => navigate("/group/new")}
      >
        Crear nuevo grupo
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex" }}>
      {/* Contendio principal */}
      <div style={{ flex: 1, padding: "20px", marginRight: "240px" }}>
        <div className="content">
          <h1> Bienvenido a la página de grupos</h1>
          <p>Aquí puedes ver y gestionar los grupos de las escuelas.</p>
          <SDivider />
          {renderSearchBar()}
          <SDivider />
          <GroupTable filters={filters} />
          {renderCreateButton()}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
