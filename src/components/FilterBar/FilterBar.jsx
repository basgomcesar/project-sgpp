import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

const FilterBar = ({ onFilter }) => {
  const [filtros, setFiltros] = useState({
    grupo: '',
    semestre: '',
    escuela: '',
  });
  const [escuelas, setEscuelas] = useState([]);

  useEffect(() => {
    const fetchEscuelas = async () => {
      try {
        const result = await invoke('get_schools');
        setEscuelas(result);
      } catch (error) {
        console.error('Error al obtener las escuelas:', error);
      }
    };

    fetchEscuelas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFilter) onFilter(filtros);
  };

  const handleReset = () => {
    const reset = { grupo: '', semestre: '', escuela: '' };
    setFiltros(reset);
    if (onFilter) onFilter(reset);
  };

  return (
    <div className="card mb-4 w-100">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row align-items-end g-3">
            {/* Curso */}
            <div className="col-md-4">
              <label className="form-label">Curso</label>
              <select
                name="grupo"
                value={filtros.grupo}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Selecciona un curso</option>
                <option value="cursoObs">
                  Observación y análisis de prácticas y contextos escolares
                </option>
                <option value="cursoMediacion">
                  Mediación pedagógica y trabajo docente
                </option>
                <option value="cursoProyecto">
                  Proyecto de intervención docente
                </option>
              </select>
            </div>

            {/* Escuela */}
            <div className="col-md-4">
              <label className="form-label">Escuela</label>
              <select
                name="escuela"
                value={filtros.escuela}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Selecciona una escuela</option>
                {escuelas.map((escuela, index) => (
                  <option key={index} value={escuela.id}>
                    {escuela.school_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semestre */}
            <div className="col-md-2">
              <label className="form-label">Semestre</label>
              <select
                name="semestre"
                value={filtros.semestre}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Todos</option>
                {[...Array(9)].map((_, i) => (
                  <option key={i} value={i + 1}>{`${i + 1}°`}</option>
                ))}
              </select>
            </div>

            {/* Botones */}
            <div className="col-md-2 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Aplicar Filtros
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline-secondary"
              >
                Limpiar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterBar;
