use crate::db::connection::establish_connection;
use crate::db::models::Practice;
use crate::schema::practices::dsl::{practices,student_id};  // Importa específicamente lo necesario
use diesel::{RunQueryDsl, QueryDsl, ExpressionMethods, SelectableHelper};
use tauri::command;

#[command]
pub fn get_practices_by_student_id(s_id: i32) -> Vec<Practice> {
    let conn = &mut establish_connection();

    practices
        .filter(student_id.eq(s_id))
        .select(Practice::as_select())  // Esto asegura que los campos coincidan
        .load(conn)
        .unwrap_or_else(|e| {
            println!("Error al obtener prácticas: {}", e);
            vec![]
        })

}