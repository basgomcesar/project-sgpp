import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

const GroupCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    courseName: "",
    semester_id: "",
    teacher_id: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lista fija de cursos (puedes cambiar esto si quieres cargar desde backend también)
  const courses = [
    "Mediación pedagógica y trabajo docente",
    "Observación y análisis de prácticas y contextos escolares",
    "Proyecto de intervención docente",
  ];

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const result = await invoke("get_teachers");
        setTeachers(result);
      } catch (err) {
        console.error("Error al obtener los maestros:", err);
        setError("No se pudieron cargar los maestros.");
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await invoke("create_group", { courseName: form.courseName, teacherId: Number(form.teacher_id) });
      navigate("/groups");
    } catch (err) {
      console.error("Error al crear el grupo:", err);
      setError("Hubo un problema al crear el grupo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Registrar Nuevo Grupo</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Select de curso */}
            <div className="mb-3">
              <label className="form-label">Nombre del Curso</label>
              <select
                name="courseName"
                className="form-select"
                value={form.courseName}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un curso</option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Select de maestro */}
            <div className="mb-3">
              <label className="form-label">Profesor</label>
              <select
                name="teacher_id"
                className="form-select"
                value={form.teacher_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un maestro</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.full_name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Grupo"}
            </button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroupCreate;
