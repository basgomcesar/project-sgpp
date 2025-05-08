import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
// import SchoolInfo from "../SchoolInfo/SchoolInfo";
// import EditControls from "../EditControls/EditControls";

const SchoolDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSchool, setEditedSchool] = useState({
        name: "",
        address: "",
        contact_number: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await invoke("get_school_by_id", {
                    schoolId: parseInt(id, 10),
                });
                setSchool(data);
                setEditedSchool({
                    name: data.name,
                    address: data.address,
                    contact_number: data.contact_number,
                });
            } catch (error) {
                console.error("Error al obtener información de la escuela:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleEditClick = () => setIsEditing(true);

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedSchool({
            name: school.name,
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
                nameNew: editedSchool.name,
                addressNew: editedSchool.address,
                contactNumberNew: editedSchool.contact_number,
            });

            setSchool({
                ...school,
                name: editedSchool.name,
                address: editedSchool.address,
                contact_number: editedSchool.contact_number,
            });

            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar la escuela:", error);
        }
    };

    if (loading) return <p>Cargando detalles...</p>;
    if (!school) return <p>No se encontró la escuela</p>;

    return (
        <div className="container mt-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Detalles de la Escuela</h2>
                {/* <EditControls
                    isEditing={isEditing}
                    onEditClick={handleEditClick}
                    onSaveClick={handleSaveChanges}
                    onCancelClick={handleCancelEdit}
                /> */}
            </div>

            <div className="row g-3" style={{ height: "calc(100vh - 150px)" }}>
                <div className="col-md-12 h-100">
                    {/* <SchoolInfo
                        school={school}
                        isEditing={isEditing}
                        editedSchool={editedSchool}
                        onInputChange={handleInputChange}
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default SchoolDetailsPage;