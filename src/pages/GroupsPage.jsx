import { SDivider } from "../components/Sidebar/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
 import GroupTable from "../components/GroupTable/GroupTable";

const GroupsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilters({ course_name: value });
  };

  const renderSearchBar = () => (
    <div className="filter-bar">
      <h4>Filtrar grupos</h4>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombre del grupo"
        value={searchTerm}
        onChange={handleInputChange}
      />
    </div>
  );

    const renderCreateButton = () => (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
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
