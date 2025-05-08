import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export default function NewSchoolPage() {
    const [formData, setFormData] = useState({
        schoolName: "",
        schoolCCT: "",
        schoolAddress: "",
        schoolDirector: "",
        schoolSector: "",
        schoolZone: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await invoke("create_school", { 
                name_new: formData.schoolName,
                address_new: formData.schoolAddress,
                cct_new: formData.schoolCCT || null,
                director_name_new: formData.schoolDirector || null,
                sector_new: formData.schoolSector || null,
                zone_new: formData.schoolZone || null,
            });
            console.log("School created successfully:", response);
            alert("Escuela creada exitosamente");
        } catch (error) {
            console.error("Error creating school:", error);
            alert("Error al crear la escuela");
        }
    };

    return (
        <div className="container">
            <h1>Crear Nueva Escuela</h1>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="m-3">
                            <label htmlFor="schoolName" className="form-label">
                                Nombre de la Escuela
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="schoolName"
                                placeholder="Nombre de la escuela"
                                value={formData.schoolName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="m-3">
                            <label htmlFor="schoolCCT" className="form-label">
                                CCT
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="schoolCCT"
                                placeholder="CCT de la escuela"
                                value={formData.schoolCCT}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="m-3">
                            <label htmlFor="schoolAddress" className="form-label">
                                Dirección
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="schoolAddress"
                                placeholder="Dirección de la escuela"
                                value={formData.schoolAddress}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="m-3">
                            <label htmlFor="schoolDirector" className="form-label">
                                Nombre del Director
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="schoolDirector"
                                placeholder="Nombre del director de la escuela"
                                value={formData.schoolDirector}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="m-3">
                            <label htmlFor="schoolSector" className="form-label">
                                Sector
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="schoolSector"
                                placeholder="Sector de la escuela"
                                value={formData.schoolSector}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="m-3">
                            <label htmlFor="schoolZone" className="form-label">
                                Zona
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="schoolZone"
                                placeholder="Zona de la escuela"
                                value={formData.schoolZone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary m-3">
                    Crear Escuela
                </button>
            </form>
        </div>
    );
}
