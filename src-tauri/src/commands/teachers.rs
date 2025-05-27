use std::fmt::format;

use crate::db::connection::establish_connection;
use crate::db::models::{NewTeacher, Teacher};
use crate::schema::group_teachers::dsl::group_teachers;
use diesel::prelude::*;
use diesel::result::Error::NotFound;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use tauri::command;

#[command]
pub fn get_teachers() -> Result<Vec<Teacher>, String> {
    let conn = &mut establish_connection();

    match group_teachers.load::<Teacher>(conn) {
        Ok(teachers_list) => Ok(teachers_list),
        Err(e) => Err(format!("Error de base de datos: {}", e)),
    }
}

#[command]
pub fn create_teacher(full_name: String) -> Result<Teacher, String> {

    let conn = &mut establish_connection();

    let new_teacher = NewTeacher {
        full_name: Some(full_name),
    };

    match diesel::insert_into(group_teachers)
        .values(&new_teacher)
        .get_result::<Teacher>(conn)
    {
        Ok(teacher) => Ok(teacher),
        Err(e) => Err(format!("Error al crear el docente: {}", e)),
    }
}
