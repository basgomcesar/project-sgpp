const EditControls = ({ isEditing, onEditClick, onSaveClick, onCancelClick }) => {
    return (
      <>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={onEditClick}>
            Editar Información
          </button>
        ) : (
          <div>
            <button className="btn btn-success me-2" onClick={onSaveClick}>
              Guardar Cambios
            </button>
            <button className="btn btn-secondary" onClick={onCancelClick}>
              Cancelar
            </button>
          </div>
        )}
      </>
    );
  };
  
  export default EditControls;