mod commands;
mod db;
mod schema;
use std::env;

use commands::{create_student, get_students, delete_student,get_student_by_id,update_student,get_practices_by_student_id};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_student,
            get_students,
            delete_student,
            get_student_by_id,
            update_student,
            get_practices_by_student_id,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
