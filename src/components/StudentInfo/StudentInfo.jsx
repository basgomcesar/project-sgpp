const StudentInfo = ({ student, isEditing, editedStudent, onInputChange }) => {
    return (
      <div className="card h-100">
        <div className="card-body">
          <h4 className="card-title">Información Básica</h4>
          
          {isEditing ? (
            <form>
              <div className="mb-3">
                <label className="form-label"><strong>Nombre:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  name="full_name"
                  value={editedStudent.full_name}
                  onChange={onInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><strong>Matrícula:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  name="control_number"
                  value={editedStudent.control_number}
                  onChange={onInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><strong>Semestre:</strong></label>
                <input
                  type="text"
                  className="form-control"
                  name="semester_id"
                  value={editedStudent.semester_id}
                  onChange={onInputChange}
                />
              </div>
              <div className="mb-3">
                <strong>Horas acumuladas:</strong> {student.accumulated_hours}
              </div>
            </form>
          ) : (
            <>
              <p><strong>Nombre:</strong> {student.full_name}</p>
              <p><strong>Matrícula:</strong> {student.control_number}</p>
              <p><strong>Semestre:</strong> {student.semester_id}</p>
              <p><strong>Horas acumuladas:</strong> {student.accumulated_hours}</p>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default StudentInfo;