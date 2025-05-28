import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

const PracticeCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID del estudiante

  const [form, setForm] = useState({
    teacher_id: "",
    start_date: "",
    end_date: "",
    school_id: "",
    tutor_id: "",
    accompanying_teacher_id: "",
    grade_group: "",
    accumulated_hours: "",
  });

  const [groupTeachers, setGroupTeachers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [accompanyingTeachers, setAccompanyingTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachers = await invoke("get_teachers_by_student_id", { idStudent: parseInt(id) });
        // Filtrar maestros para que no haya repetidos por su id
        const uniqueTeachers = teachers.filter(
          (teacher, index, self) =>
            index === self.findIndex((t) => t.id === teacher.id)
        );
        setGroupTeachers(uniqueTeachers);

        const schoolList = await invoke("get_schools");
        setSchools(schoolList);

        const allAccompanyingTeachers = await invoke("get_accompanying_teachers");
        setAccompanyingTeachers(allAccompanyingTeachers);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos.");
      }
    };

    fetchData();
  }, [id]);

  // Filtrar tutores al seleccionar escuela
  useEffect(() => {
    const fetchTutors = async () => {
      if (!form.school_id) {
        setTutors([]);
        return;
      }
      try {
        const tutors = await invoke("get_tutors_by_school_id", { idSchool: parseInt(form.school_id) });
        setTutors(tutors);
      } catch (err) {
        console.error("Error al obtener tutores:", err);
        setError("No se pudieron cargar los tutores.");
      }
    };

    fetchTutors();
  }, [form.school_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await invoke("create_practice", {
        studentId: parseInt(id),
        ...form,
        groupTeacherId: parseInt(form.teacher_id),
        otherStudentId: parseInt(id),
        startDate: `${form.start_date} 00:00:00`,
        endDate: `${form.end_date} 00:00:00`,
        assignedTutorId: parseInt(form.tutor_id),
        accompanyingTeacherId: parseInt(form.accompanying_teacher_id),
        practiceHours: parseFloat(form.accumulated_hours),
        newSchoolId: parseInt(form.school_id), // Added required key
        gradeAndGroup: form.grade_group,
      });

      navigate(`/students/${id}`);
    } catch (err) {
      console.error("Error al registrar la práctica:", err);
      setError("Hubo un problema al registrar la práctica.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h3>Registrar Nueva Práctica</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Primera columna */}
              <div className="col-md-6">
                {/* Profesor de grupo */}
                <div className="mb-3">
                  <label className="form-label">Profesor de Grupo</label>
                  <select
                    name="teacher_id"
                    className="form-select"
                    value={form.teacher_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un profesor</option>
                    {groupTeachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fecha inicio */}
                <div className="mb-3">
                  <label className="form-label">Fecha de Inicio</label>
                  <input
                    type="date"
                    name="start_date"
                    className="form-control"
                    value={form.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Fecha final */}
                <div className="mb-3">
                  <label className="form-label">Fecha Final</label>
                  <input
                    type="date"
                    name="end_date"
                    className="form-control"
                    value={form.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Escuela */}
                <div className="mb-3">
                  <label className="form-label">Escuela</label>
                  <select
                    name="school_id"
                    className="form-select"
                    value={form.school_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una escuela</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.school_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Segunda columna */}
              <div className="col-md-6">
                {/* Tutor asignado */}
                <div className="mb-3">
                  <label className="form-label">Tutor Asignado</label>
                  <select
                    name="tutor_id"
                    className="form-select"
                    value={form.tutor_id}
                    onChange={handleChange}
                    required
                    disabled={!form.school_id}
                  >
                    <option value="">Seleccione un tutor</option>
                    {tutors.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Maestro acompañante */}
                {/* <div className="mb-3">
                  <label className="form-label">Maestro Acompañante</label>
                  <select
                    name="accompanying_teacher_id"
                    className="form-select"
                    value={form.accompanying_teacher_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un maestro</option>
                    {accompanyingTeachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.full_name}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* Grado y grupo */}
                <div className="mb-3">
                  <label className="form-label">Grado y Grupo</label>
                  <input
                    type="text"
                    name="grade_group"
                    className="form-control"
                    value={form.grade_group}
                    onChange={handleChange}
                    placeholder="Ej. 3°A"
                    required
                  />
                </div>

                {/* Horas acumuladas */}
                <div className="mb-3">
                  <label className="form-label">Horas Acumuladas</label>
                  <input
                    type="number"
                    name="accumulated_hours"
                    className="form-control"
                    value={form.accumulated_hours}
                    onChange={handleChange}
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Registrando..." : "Registrar Práctica"}
            </button>

            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PracticeCreate;
