import FilterBar from "../components/FilterBar/FilterBar";
import { SDivider } from "../components/Sidebar/styles";
import StudentTable from "../components/StudentTable/StudentTable";
import ButtonCreateStudent from "../components/ButtonCreateStudent/ButtonCreateStudent";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Importa el JS de Bootstrap
import StudentFormModal from "../components/ButtonCreateStudent/CreateStudentModal";

const StudentsPage = () => {
  return (
    <div className="home-container">
      <div className="content">
        <h1>Bienvenido a la pagina de los estudiantes</h1>
        <p>
          Estudiantes de la escuela normal, quienes estan realizando practicas{" "}
        </p>
        <SDivider />
        <FilterBar />
        <SDivider />
        <StudentTable />
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
            modalTarget="studentFormModal"
          />
          <StudentFormModal />
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
