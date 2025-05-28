use crate::db::connection::establish_connection;
use crate::db::models::{NewTeacher, Teacher};
use crate::schema::{groups, groups_students, group_teachers};
use diesel::prelude::*;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl};
use tauri::command;

#[command]
pub fn get_teachers() -> Result<Vec<Teacher>, String> {
    let conn = &mut establish_connection();

    match group_teachers::table.load::<Teacher>(conn) {
        Ok(teachers_list) => Ok(teachers_list),
        Err(e) => Err(format!("Error de base de datos: {}", e)),
    }
}

#[command]
pub fn create_teacher(full_name: String) -> Result<Teacher, String> {
    let conn = &mut establish_connection();

    let new_teacher = NewTeacher {
        full_name:Some(full_name),
    };

    match diesel::insert_into(group_teachers::table)
        .values(&new_teacher)
        .get_result::<Teacher>(conn)
    {
        Ok(teacher) => Ok(teacher),
        Err(e) => Err(format!("Error al crear el docente: {}", e)),
    }
}

#[command]
pub fn get_teachers_by_student_id(id_student: i32) -> Result<Vec<Teacher>, String> {
    let conn = &mut establish_connection();

    match group_teachers::table
        .inner_join(groups::table.on(groups::teacher_id.eq(group_teachers::id.nullable())))
        .inner_join(groups_students::table.on(groups_students::id_group.eq(groups::id.nullable())))
        .filter(groups_students::id_student.eq(id_student))
        .select(group_teachers::all_columns)  // o .select(Teacher::as_select()) si tienes la macro #[diesel(table_name=...)]
        .load::<Teacher>(conn)
    {
        Ok(teachers_list) => Ok(teachers_list),
        Err(e) => Err(format!("Error de base de datos: {}", e)),
    }
}
