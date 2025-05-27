mod commands;
mod db;
mod schema;
use std::env;

use commands::{create_student, get_students, delete_student,get_student_by_id,update_student,get_practices_by_student_id,get_schools,create_school,get_school_by_id,get_all_contexts,get_teachers,get_groups,get_group_by_id,add_student_to_group,create_teacher,create_group};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_student,
            get_students,
            delete_student,
            get_student_by_id,
            update_student,
            get_practices_by_student_id,
            get_schools,
            create_school,
            get_school_by_id,
            get_all_contexts,
            get_teachers,
            get_groups,
            get_group_by_id,
            add_student_to_group,
            create_teacher,
            create_group
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
