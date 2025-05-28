import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

const SchoolDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedSchool, setEditedSchool] = useState({
    school_name: "",
    address: "",
    contact_number: "",
  });
  const [newTutor, setNewTutor] = useState({
    full_name: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await invoke("get_school_by_id", {
          schoolId: parseInt(id, 10),
        });
        console.log(JSON.stringify(data));
        await fetchTutors();
        const schoolData = {
          ...data.school,
          sector_chief_name: data.sector_chief?.full_name || "",
          zone_supervisor_name: data.zone_supervisor?.full_name || "",
          context: data.context?.context_name || "",
          contact_number: data.school?.contact_number || "",
        };

        setSchool(schoolData);
        setEditedSchool({
          school_name: schoolData.school_name,
          address: schoolData.address,
          contact_number: schoolData.contact_number,
        });
      } catch (error) {
        console.error("Error al obtener información de la escuela:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchTutors = async () => {
    try {
      const result = await invoke("get_tutors_by_school_id", {
        idSchool: parseInt(id, 10),
      });
      setTutors(result);
    } catch (error) {
      console.error("Error al obtener tutores:", error);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleTutorInputChange = (e) => {
    const { name, value } = e.target;
    setNewTutor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSaveTutor = async () => {
    try {
      await invoke("create_tutor", {
        idSchool: parseInt(id, 10),
        nameNew: newTutor.full_name,
        // otros campos
      });

      // Actualizar la lista de tutores
      await fetchTutors();

      // Cerrar el modal y resetear el formulario
      setShowModal(false);
      setNewTutor({
        full_name: "",
        email: "",
      });
    } catch (error) {
      console.error("Error al crear tutor:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedSchool({
      school_name: school.school_name,
      address: school.address,
      contact_number: school.contact_number,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedSchool((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await invoke("update_school", {
        schoolId: parseInt(id, 10),
        nameNew: editedSchool.school_name,
        addressNew: editedSchool.address,
        contactNumberNew: editedSchool.contact_number,
      });

      setSchool({
        ...school,
        school_name: editedSchool.school_name,
        address: editedSchool.address,
        contact_number: editedSchool.contact_number,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar la escuela:", error);
    }
  };

  const handleAddTutors = () => {
    // Lógica para agregar profesores tutores
    console.log("Agregar profesores tutores para la escuela:", id);
    // Puedes navegar a otra página o mostrar un modal aquí
    //Llamar a modal para crear nuevo tutor
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const SchoolInfo = () => {
    const FIELDS = [
      {
        name: "school_name",
        label: "Nombre",
        type: "text",
        editable: true,
      },
      {
        name: "address",
        label: "Dirección",
        type: "text",
        editable: true,
      },
      {
        name: "cct",
        label: "CCT",
        type: "text",
        editable: false,
      },
    ];

    const renderField = (field) => {
      if (isEditing && field.editable) {
        return (
          <div className="mb-3" key={field.name}>
            <label className="form-label">
              <strong>{field.label}:</strong>
            </label>
            <input
              type={field.type}
              className="form-control"
              name={field.name}
              value={editedSchool[field.name] || ""}
              onChange={handleInputChange}
            />
          </div>
        );
      }
      return (
        <p key={field.name}>
          <strong>{field.label}:</strong> {school[field.name] || "N/A"}
        </p>
      );
    };

    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Información de la Escuela</h4>
          {FIELDS.map(renderField)}
        </div>
      </div>
    );
  };

  const EditControls = () => (
    <div className="d-flex gap-2 my-3">
      {isEditing ? (
        <>
          <button className="btn btn-success" onClick={handleSaveChanges}>
            Guardar
          </button>
          <button className="btn btn-secondary" onClick={handleCancelEdit}>
            Cancelar
          </button>
        </>
      ) : (
        <button className="btn btn-primary" onClick={handleEditClick}>
          Editar
        </button>
      )}
    </div>
  );
  const TutorsList = () => (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Profesores Tutores</h5>
        {tutors.length === 0 ? (
          <p>No hay tutores registrados para esta escuela.</p>
        ) : (
          <ul className="list-group">
            {tutors.map((tutor, index) => (
              <li className="list-group-item" key={index}>
                <strong>{tutor.full_name}</strong>
                <br />
                {tutor.email && <small>{tutor.email}</small>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const AdditionalInfo = () => (
    <div className="card mt-3">
      <div className="card-body">
        <h4 className="card-title">Información Adicional</h4>
        <p>
          <strong>Nombre del Director:</strong> {school?.director_name || "N/A"}
        </p>
        <p>
          <strong>Sector:</strong> {school?.sector || "N/A"}
        </p>
        <p>
          <strong>Zona:</strong> {school?.zone || "N/A"}
        </p>
        <p>
          <strong>Nombre del Jefe de Sector:</strong>{" "}
          {school?.sector_chief_name || "N/A"}
        </p>
        <p>
          <strong>Nombre del Supervisor de Zona:</strong>{" "}
          {school?.zone_supervisor_name || "N/A"}
        </p>
        <p>
          <strong>Contexto:</strong> {school?.context || "N/A"}
        </p>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="container mt-4">
        <p>Cargando detalles...</p>
      </div>
    );
  if (!school)
    return (
      <div className="container mt-4">
        <p>No se encontró la escuela</p>
      </div>
    );

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Columna principal */}
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Detalles de la Escuela</h3>
          </div>

          <SchoolInfo />
          <AdditionalInfo />
          <EditControls />
        </div>

        {/* Columna lateral derecha */}
        <div className="col-md-4 ">
          <div className="card sticky-top" style={{ top: "100px" }}>
            <div className="card-body">
              <TutorsList />
              <h4 className="card-title"></h4>
              <button
                className="btn btn-primary w-100 mb-3"
                onClick={handleAddTutors}
              >
                Agregar profesores tutores
              </button>
              {/* Puedes agregar más botones o acciones aquí */}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <>
          <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Registrar nuevo tutor</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Formulario de registro */}
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Nombre completo</label>
                      <input
                        type="text"
                        className="form-control"
                        name="full_name"
                        value={newTutor.full_name}
                        onChange={handleTutorInputChange}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveTutor}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default SchoolDetailsPage;
