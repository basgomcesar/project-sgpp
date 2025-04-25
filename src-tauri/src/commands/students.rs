use crate::db::connection::establish_connection;
use crate::db::models::{InternStudent, NewInternStudent};
use crate::schema::intern_students::dsl::{intern_students, id};  // Importa específicamente lo necesario
use diesel::{RunQueryDsl, QueryDsl, ExpressionMethods};
use tauri::command;

#[command]
pub fn create_student(
    full_name_new: String,
    accumulated_hours_new: i32,
    control_number_new: String,
    semester_id_new: i32
) -> Result<bool, String> {
    let conn = &mut establish_connection();
    
    println!("🔵 Datos recibidos:");
    println!("Nombre: {}", full_name_new);
    println!("Número control: {}", control_number_new);
    println!("Horas: {}", accumulated_hours_new);
    println!("Semestre: {}", semester_id_new);

    let new_student = NewInternStudent {
        accumulated_hours: accumulated_hours_new,
        control_number: control_number_new,
        semester_id: semester_id_new,
        full_name: full_name_new,
    };

    match diesel::insert_into(intern_students)
        .values(&new_student)
        .execute(conn)
    {
        Ok(rows_affected) => {
            println!("✅ Insertado correctamente. Filas afectadas: {}", rows_affected);
            Ok(rows_affected > 0)
        },
        Err(e) => {
            println!("❌ Error al insertar: {:?}", e);
            Err(format!("Error de base de datos: {}", e))
        }
    }
}

//Funcion para actualizar un estudiante
#[command]
pub fn update_student(
    student_id: i32,
    full_name_new: String,
    accumulated_hours_new: i32,
    control_number_new: String,
    semester_id_new: i32
) -> Result<bool, String> {
    let conn = &mut establish_connection();
    
    println!("🔵 Datos recibidos para actualización:");
    println!("ID del estudiante: {}", student_id);
    println!("Nombre: {}", full_name_new);
    println!("Número control: {}", control_number_new);
    println!("Horas: {}", accumulated_hours_new);
    println!("Semestre: {}", semester_id_new);

    let updated_student = NewInternStudent {
        accumulated_hours: accumulated_hours_new,
        control_number: control_number_new,
        semester_id: semester_id_new,
        full_name: full_name_new,
    };

    match diesel::update(intern_students.find(student_id))
        .set(&updated_student)
        .execute(conn)
    {
        Ok(rows_affected) => {
            println!("✅ Actualizado correctamente. Filas afectadas: {}", rows_affected);
            Ok(rows_affected > 0)
        },
        Err(e) => {
            println!("❌ Error al actualizar: {:?}", e);
            Err(format!("Error de base de datos: {}", e))
        }
    }
}

#[tauri::command]
pub fn get_students() -> Vec<InternStudent> {
    let mut conn = establish_connection();

    intern_students
        .load::<InternStudent>(&mut conn)
        .unwrap_or_else(|e| {
            println!("Error al obtener estudiantes: {}", e);
            vec![]
        })
}

#[command]
pub fn delete_student(student_id: i32) -> bool {
    let conn = &mut establish_connection();
    
    match diesel::delete(intern_students.filter(id.eq(student_id)))
        .execute(conn)
    {
        Ok(rows_affected) => {
            println!("🗑️ Estudiante eliminado. Filas afectadas: {}", rows_affected);
            rows_affected > 0
        },
        Err(e) => {
            println!("❌ Error al eliminar estudiante: {}", e);
            false
        }
    }
}
#[command]
pub fn get_student_by_id(student_id: i32) -> Option<InternStudent> {
    let conn = &mut establish_connection();

    match intern_students
        .filter(id.eq(student_id))
        .first::<InternStudent>(conn)
    {
        Ok(student) => Some(student),
        Err(e) => {
            println!("❌ Error al obtener estudiante por ID: {}", e);
            None
        }
    }
}