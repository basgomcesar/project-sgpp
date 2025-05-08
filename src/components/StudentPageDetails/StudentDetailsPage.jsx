import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import StudentInfo from "../StudentInfo/StudentInfo";
import PracticeHistory from "../PracticeHistory/PracticeHistory";
import EditControls from "../EditControls/EditControls";

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState({
    full_name: "",
    control_number: "",
    semester_id: "",
    accumulated_hours: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await invoke("get_student_by_id", {
          studentId: parseInt(id, 10),
        });
        setStudent(data);
        setEditedStudent({
          full_name: data.full_name,
          control_number: data.control_number,
          semester_id: data.semester_id,
          accumulated_hours: data.accumulated_hours
        });
        const practicesData = await invoke("get_practices_by_student_id", {
          sId: parseInt(id, 10),
        });
        setPractices(practicesData);
      } catch (error) {
        console.error("Error al obtener informacion del estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedStudent({
      full_name: student.full_name,
      control_number: student.control_number,
      semester_id: student.semester_id,
      accumulated_hours: student.accumulated_hours
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await invoke("update_student", {
        studentId: parseInt(id, 10),
        fullNameNew: editedStudent.full_name,
        controlNumberNew: editedStudent.control_number,
        semesterIdNew: editedStudent.semester_id,
        accumulatedHoursNew: parseFloat(editedStudent.accumulated_hours)
      });
      
      setStudent({
        ...student,
        full_name: editedStudent.full_name,
        control_number: editedStudent.control_number,
        semester_id: editedStudent.semester_id,
        accumulated_hours: editedStudent.accumulated_hours
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el estudiante:", error);
    }
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (!student) return <p>No se encontró al estudiante</p>;

  return (
    <div className="container mt-12">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Detalles del Estudiante</h2>
        <EditControls
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onSaveClick={handleSaveChanges}
          onCancelClick={handleCancelEdit}
        />
      </div>
      
      <div className="row g-3" style={{ height: "calc(100vh - 150px)" }}>
        <div className="col-md-6 h-100">
          <StudentInfo
            student={student}
            isEditing={isEditing}
            editedStudent={editedStudent}
            onInputChange={handleInputChange}
          />
        </div>

        <div className="col-md-6 h-100">
          <PracticeHistory practices={practices} />
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;