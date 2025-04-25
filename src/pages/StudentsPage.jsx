import { useState } from "react";
import FilterBar from "../components/FilterBar/FilterBar";
import { SDivider } from "../components/Sidebar/styles";
import StudentTable from "../components/StudentTable/StudentTable";
import ButtonCreateStudent from "../components/ButtonCreateStudent/ButtonCreateStudent";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Importa el JS de Bootstrap
import StudentFormModal from "../components/ButtonCreateStudent/CreateStudentModal";
import { useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate

const StudentsPage = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsStudent, setShowDetailsStudent] = useState(false);
  const [filters, setFilters] = useState({
    grupo: "",
    semestre: "",
    escuela: "",
  });
  const [showModal, setShowModal] = useState(false);
  const handleStudentCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Incrementar la key para forzar recarga
  };

  const handleStudentDoubleClick = (student) => {
    navigate(`/students/${student.id}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  const handleCloseModal = () => setShowModal(false);
  return (
    <div className="home-container">
      <div className="content">
        <h1>Bienvenido a la pagina de los estudiantes</h1>
        <p>
          Estudiantes de la escuela normal, quienes estan realizando practicas{" "}
        </p>
        <SDivider />
        <FilterBar onFilter={handleFilterChange} />
        <SDivider />
        <StudentTable
          onStudentDoubleClick={handleStudentDoubleClick}
          filters={filters}
          key={refreshKey}
        />

        {/* Modal para crear nuevo estudiante */}
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <ButtonCreateStudent
            text="Crear nuevo estudiante"
            variant="success"
            show={showModal} // Pasa el estado del modal
            onShow={() => setShowModal(true)} // Pasa función para abrir
            onClose={() => setShowModal(false)} // Pasa función para cerrar
          />
          <StudentFormModal
            show={showModal}
            handleCloseModal={handleCloseModal}
            onStudentCreated={handleStudentCreated}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentsPage; 
