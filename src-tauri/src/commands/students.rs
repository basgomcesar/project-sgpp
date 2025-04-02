use crate::db::connection::establish_connection;
use crate::db::models::{Student, students::dsl::*};
use diesel::{RunQueryDsl, QueryDsl, ExpressionMethods};
use tauri::command;

#[command]
pub fn create_student(name: String, age: i32) -> bool {
    let conn = &mut establish_connection();
    let new_student = Student { id: 0, name, age };
    
    diesel::insert_into(students)
        .values(&new_student)
        .execute(conn)
        .is_ok()
}

#[command]
pub fn get_students() -> Vec<Student> {
    let conn = &mut establish_connection();
    students.load::<Student>(conn).unwrap_or_else(|_| vec![])
}

#[command]
pub fn delete_student(student_id: i32) -> bool {
    let conn = &mut establish_connection();
    diesel::delete(students.filter(id.eq(student_id)))
        .execute(conn)
        .is_ok()
}
