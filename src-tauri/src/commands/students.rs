use crate::db::connection::establish_connection;
use crate::db::models::{InternStudent,NewInternStudent};
use crate::schema::intern_students::dsl::*;  // Importa el DSL generado por Diesel
use diesel::{RunQueryDsl, QueryDsl, ExpressionMethods};
use tauri::command;

#[command]
pub fn create_student(full_name_new: String, accumulated_hours_new: i32,control_number_new: String ,semester_id_new: i32 ) -> bool {
    let conn = &mut establish_connection();
    let new_student = NewInternStudent {
 // La DB asignará el ID
        accumulated_hours: accumulated_hours_new,
        control_number: control_number_new,
        semester_id: semester_id_new,
        full_name: full_name_new,
    };
    
    diesel::insert_into(intern_students)
        .values(&new_student)
        .execute(conn)
        .is_ok()
}


#[tauri::command]
pub fn get_students() -> Vec<InternStudent> {
    let mut conn = establish_connection();

    intern_students // ← este ES la tabla
        .load::<InternStudent>(&mut conn)
        .unwrap_or_else(|_| vec![])
}

#[command]
pub fn delete_student(student_id: i32) -> bool {
    let conn = &mut establish_connection();
    diesel::delete(intern_students.filter(id.eq(student_id)))
        .execute(conn)
        .is_ok()
}
