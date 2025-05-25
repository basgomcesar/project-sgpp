import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

// Constants for form fields
const FORM_FIELDS = [
  {
    id: "schoolName",
    label: "Nombre de la Escuela",
    placeholder: "Nombre de la escuela",
  },
  { id: "schoolCCT", label: "CCT", placeholder: "CCT de la escuela" },
  {
    id: "schoolAddress",
    label: "Dirección",
    placeholder: "Dirección de la escuela",
  },
  {
    id: "schoolDirector",
    label: "Nombre del Director",
    placeholder: "Nombre del director de la escuela",
  },
  { id: "schoolSector", label: "Sector", placeholder: "Sector de la escuela" },
  { id: "schoolZone", label: "Zona", placeholder: "Zona de la escuela" },
  { id: "schoolType", label: "Conexto", type: "select" },
];

export default function NewSchoolPage() {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolCCT: "",
    schoolAddress: "",
    schoolDirector: "",
    schoolSector: "",
    schoolZone: "",
    schoolType: "",
  });

  const [schoolTypes, setSchoolTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await invoke("get_all_contexts");
                setSchoolTypes(data);
            } catch (error) {
                console.error("Error al obtener información de los contextos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await invoke("create_school", {
        nameNew: formData.schoolName,
        addressNew: formData.schoolAddress,
        cctNew: formData.schoolCCT || null,
        directorNameNew: formData.schoolDirector || null,
        sectorNew: formData.schoolSector || null,
        zoneNew: formData.schoolZone || null,
      });

      console.log("School created successfully:", response);
      alert("Escuela creada exitosamente");
    } catch (error) {
      console.error("Error creating school:", error);
      alert("Error al crear la escuela");
    }
  };

  const renderFormField = ({ id, label, placeholder }) => (
    <div className="m-3" key={id}>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        type="text"
        className="form-control"
        id={id}
        placeholder={placeholder}
        value={formData[id]}
        onChange={handleChange}
      />
    </div>
  );

  //How to add a combobox

  return (
    <div className="container">
      <h1>Crear Nueva Escuela</h1>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            {FORM_FIELDS.slice(0, 3).map(renderFormField)}
          </div>
          <div className="col-md-6">
            {FORM_FIELDS.slice(3).map(renderFormField)}
          </div>
        </div>

        <button type="submit" className="btn btn-primary m-3">
          Crear Escuela
        </button>
      </form>
    </div>
  );
}
