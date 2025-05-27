import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

const GroupDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [students, setStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [showStudentList, setShowStudentList] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedGroup, setEditedGroup] = useState({
        course_name: "",
        semester_id: "",
        teacher_name: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await invoke("get_group_by_id", {
                    groupId: parseInt(id, 10),
                });
                setGroup(data);
                setEditedGroup({
                    course_name: data.course_name,
                    semester_id: data.semester_id,
                    teacher_name: data.teacher_name
                });
                console.log("Grupo obtenido:", data);
                console.log("Estudiantes del grupo:", data.students);
                setStudents(data.students || []);
            } catch (error) {
                console.error("Error al obtener información del grupo:", error);
                setError("Error al cargar los datos del grupo");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const fetchAvailableStudents = async () => {
        try {
            const allStudents = await invoke("get_students");
            // Excluir los que ya están en el grupo
            const filtered = allStudents.filter(
                (s) => !students.find((gs) => gs.id === s.id)
            );
            setAvailableStudents(filtered);
        } catch (err) {
            console.error("Error al obtener los estudiantes:", err);
        }
    };

    const handleEditClick = () => setIsEditing(true);

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedGroup({
            course_name: group.course_name,
            semester_id: group.semester_id,
            teacher_name: group.teacher_name
        });
    };

    const handleSave = async () => {
        try {
            await invoke("update_group", {
                groupId: parseInt(id, 10),
                updatedGroup: editedGroup,
            });
            setGroup({ ...group, ...editedGroup });
            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar el grupo:", error);
            setError("Error al guardar los cambios");
        }
    };

    const handleDelete = async () => {
        try {
            await invoke("delete_group", { groupId: parseInt(id, 10) });
            navigate("/groups");
        } catch (error) {
            console.error("Error al eliminar el grupo:", error);
            setError("Error al eliminar el grupo");
        }
    };

    const toggleStudentList = async () => {
        if (!showStudentList) await fetchAvailableStudents();
        setShowStudentList(!showStudentList);
    };

    const handleAddStudent = async (studentId) => {
        try {
            await invoke("add_student_to_group", {
                groupId: parseInt(id, 10),
                studentId,
            });
            // Recargar estudiantes del grupo
            const updatedGroup = await invoke("get_group_by_id", {
                groupId: parseInt(id, 10),
            });
            setStudents(updatedGroup.students || []);
            setAvailableStudents((prev) => prev.filter((s) => s.id !== studentId));
        } catch (error) {
            console.error("Error al agregar estudiante:", error);
        }
    };

    if (loading) return <div className="container mt-5"><div className="alert alert-info">Cargando...</div></div>;
    if (error) return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3>Detalles del Grupo</h3>
                    {!isEditing && (
                        <div>
                            <button className="btn btn-primary me-2" onClick={handleEditClick}>Editar</button>
                            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                        </div>
                    )}
                </div>
                <div className="card-body">
                    {isEditing ? (
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Nombre del Curso</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editedGroup.course_name}
                                    onChange={(e) => setEditedGroup({ ...editedGroup, course_name: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nombre del Profesor</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editedGroup.teacher_name}
                                    onChange={(e) => setEditedGroup({ ...editedGroup, teacher_name: e.target.value })}
                                />
                            </div>
                            <button type="button" className="btn btn-success me-2" onClick={handleSave}>Guardar Cambios</button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancelar</button>
                        </form>
                    ) : (
                        <div>
                            <p><strong>Nombre del Curso:</strong> {group.course_name}</p>
                            <p><strong>Nombre del Profesor:</strong> {group.teacher_name}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="card mt-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4>Estudiantes en el Grupo</h4>
                    <button className="btn btn-outline-primary btn-sm" onClick={toggleStudentList}>
                        {showStudentList ? "Ocultar lista" : "Agregar Estudiante"}
                    </button>
                </div>
                <div className="card-body">
                    {students.length > 0 ? (
                        <ul className="list-group mb-3">
                            {students.map((student) => (
                                <li key={student.id} className="list-group-item">
                                    {student.name} 
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No hay estudiantes en este grupo.</p>
                    )}

                    {showStudentList && (
                        <div>
                            <h5>Estudiantes Disponibles</h5>
                            {availableStudents.length > 0 ? (
                                <ul className="list-group">
                                    {availableStudents.map((student) => (
                                        <li key={student.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            {student.full_name}
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleAddStudent(student.id)}
                                            >
                                                Agregar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">No hay estudiantes disponibles para agregar.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupDetails;
