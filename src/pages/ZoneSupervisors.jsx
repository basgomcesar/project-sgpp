import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function ZoneSupervisors() {
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [nombreSupervisor, setNombreSupervisor] = useState("");
    const [error, setError] = useState("");

    const fetchSupervisors = async () => {
        setLoading(true);
        try {
            const result = await invoke("get_zone_supervisors");
            setSupervisors(result);
        } catch (e) {
            setError("Error al obtener supervisores de zona.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSupervisors();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await invoke("create_zone_supervisor", { fullName: nombreSupervisor });
            setNombreSupervisor("");
            setShowModal(false);
            fetchSupervisors();
        } catch (e) {
            setError("Failed to create supervisor.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Supervisores de Zona</h2>

            {loading ? (
                <div className="alert alert-info">Cargando supervisores...</div>
            ) : supervisors.length === 0 ? (
                <div className="alert alert-warning">No hay supervisores de zona registrados.</div>
            ) : (
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre del supervisor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supervisors.map((sup) => (
                            <tr key={sup.id}>
                                <td>{sup.id}</td>
                                <td>{sup.full_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button
                className="btn btn-primary mt-3"
                onClick={() => setShowModal(true)}
            >
                Crear supervisor de zona
            </button>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <form onSubmit={handleCreate}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Crear supervisor de zona</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre del supervisor</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={nombreSupervisor}
                                            onChange={(e) => setNombreSupervisor(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        Crear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
}

export default ZoneSupervisors;
