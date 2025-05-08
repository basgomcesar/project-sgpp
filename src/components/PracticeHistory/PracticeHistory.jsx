const PracticeHistory = ({ practices }) => {
    return (
      <div className="card h-100">
        <div className="card-body d-flex flex-column">
          <h4 className="card-title">Historial de Prácticas</h4>
          <div className="flex-grow-1 overflow-auto">
            {practices.length === 0 ? (
              <div className="alert alert-info" role="alert">
                El estudiante no tiene prácticas registradas
              </div>
            ) : (
              <div className="table-responsive h-100">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Escuela</th>
                      <th scope="col">Inicio</th>
                      <th scope="col">Fin</th>
                      <th scope="col">Horas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {practices.map((practice, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{practice.school_id || "N/A"}</td>
                        <td>{practice.initial_date ? new Date(practice.initial_date).toLocaleDateString() : "N/A"}</td>
                        <td>{practice.final_date ? new Date(practice.final_date).toLocaleDateString() : "N/A"}</td>
                        <td>{practice.accumulated_hours || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default PracticeHistory;