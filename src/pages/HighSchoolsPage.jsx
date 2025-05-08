import HighschoolTable from "../components/HighschoolTable/HighschoolTable";
import { SDivider } from "../components/Sidebar/styles";
import { useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate

const HighSchoolsPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ width: '100%' }} expand="lg">
        <div className="content">
          <h1>Bienvenido a la pagina de las escuelas</h1>
          <p>
            Escuelas telesecundarias donde los estudiantes estan realizando
            practicas profesionales
          </p>
          <SDivider/>
            {/* Filtrar escuelas por nombres */}
            <div className="filter-bar">
              <h1>Filtrar escuelas</h1>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nombre de la escuela"
              />
              <button className="btn btn-primary">Buscar</button>
            </div>
          <SDivider/>
        {/* tabla de escuelas */}
          <HighschoolTable />
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
            onClick={() => navigate("/highschools/new")}
          >
            Crear nueva escuela
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default HighSchoolsPage;
