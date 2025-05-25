import { useState } from "react";
import FilterBar from "../components/FilterBar/FilterBar";
import { SDivider } from "../components/Sidebar/styles";
import TeacherTable from "../components/TeacherTable/TeacherTable";
import ButtonCreateTeacher from "../components/ButtonCreateTeacher/ButtonCreateTeacher";
import "bootstrap/dist/js/bootstrap.bundle.min";
import TeacherFormModal from "../components/ButtonCreateTeacher/CreateTeacherModal";
import { useNavigate } from "react-router-dom";

const TeachersPage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDetailsTeacher, setShowDetailsTeacher] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    materia: "",
    departamento: "",
    escuela: "",
  });
  const [showModal, setShowModal] = useState(false);

  const handleTeacherCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleTeacherDoubleClick = (teacher) => {
    navigate(`/teachers/${teacher.id}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSearch = () => {
    setFilters({ school_name: searchTerm });
  };

  return (
    <div className="home-container">
      <div className="content">
        <h1>Bienvenido a la página de los maestros</h1>
        <p>
          Maestros de la escuela normal, quienes imparten clases en distintos
          niveles educativos.
        </p>
        <SDivider />
        <div className="filter-bar">
          <h2>Filtrar maestros</h2>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nombre del maestro"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Buscar
          </button>
        </div>
        <SDivider />
        <TeacherTable
          onTeacherDoubleClick={handleTeacherDoubleClick}
          filters={filters}
          key={refreshKey}
        />

        {/* Modal para crear nuevo maestro */}
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <ButtonCreateTeacher
            text="Crear nuevo maestro"
            variant="primary"
            show={showModal}
            onShow={() => setShowModal(true)}
            onClose={() => setShowModal(false)}
          />
          <TeacherFormModal
            show={showModal}
            handleCloseModal={handleCloseModal}
            onTeacherCreated={handleTeacherCreated}
          />
        </div>
      </div>
    </div>
  );
};

export default TeachersPage;
