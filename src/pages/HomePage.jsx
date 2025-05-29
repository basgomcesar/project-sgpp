import Sidebar from "../components/Sidebar/Sidebar";

const HomePage = () => {
  return (
    <div className="d-flex">

      <div className="container mt-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">Bienvenido al Sistema de Prácticas Profesionales</h1>
          <p className="lead text-muted">
            Este sistema permite gestionar y dar seguimiento a las prácticas profesionales de los estudiantes
            de la Escuela Normal en telesecundarias.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h4 className="card-title mb-3">¿Cómo funciona?</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Registro de prácticas:</strong> Permite agregar nuevas prácticas indicando los
                    datos del estudiante, escuela y profesor responsable.
                  </li>
                  <li className="list-group-item">
                    <strong>Historial:</strong> Consulta y administra las prácticas realizadas por cada
                    estudiante.
                  </li>
                  <li className="list-group-item">
                    <strong>Detalle:</strong> Visualiza toda la información relacionada con una práctica
                    específica.
                  </li>
                  <li className="list-group-item">
                    <strong>Administración:</strong> El sistema permite editar y eliminar prácticas según sea
                    necesario.
                  </li>
                </ul>

                <div className="mt-4">
                  <p className="text-muted">
                    Este sistema busca facilitar el seguimiento académico y administrativo de las experiencias
                    profesionales de los alumnos en sus prácticas escolares.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default HomePage;
