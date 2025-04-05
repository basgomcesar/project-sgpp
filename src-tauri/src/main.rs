mod commands;
mod db;
mod schema;

use commands::{create_student, get_students, delete_student};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_student,
            get_students,
            delete_student
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
