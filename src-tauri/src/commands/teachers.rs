use std::fmt::format;

use crate::db::connection::establish_connection;
use crate::db::models::{Teacher, NewTeacher};
use crate::schema::group_teachers::dsl::{group_teachers};
use diesel::result::Error::NotFound;
use diesel::{RunQueryDsl, QueryDsl, ExpressionMethods};
use tauri::command;

#[command]
pub fn get_teachers() -> Result<Vec<Teacher>,String>{
    let conn = &mut establish_connection();

    match group_teachers.load::<Teacher>(conn) {
        Ok(teachers_list) => {
            Ok(teachers_list)
        },
        Err(e) => {
            Err(format!("Error de base de datos: {}",e))
        },
    }
}

