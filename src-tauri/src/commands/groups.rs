use crate::db::connection::establish_connection;
use crate::db::models::GroupWithDetails;
use crate::db::models::GroupWithStudents;
use crate::db::models::NewGroup;
use crate::db::models::GroupResult;
use crate::db::models::StudentInfo;
use crate::db::models::RawRow;
use diesel::dsl::{count, count_star};
use crate::schema::{
    groups,
    group_teachers,
    groups_students,
};


use diesel::prelude::*;
use diesel::sql_types::{BigInt, Nullable};
use tauri::command;

#[command]
pub fn get_groups() -> Result<Vec<GroupWithDetails>, String> {
    use diesel::sql_query;

    let conn = &mut establish_connection();

    sql_query(
        r#"
        SELECT 
            g.id as id,
            g.course_name as course_name,
            t.id as teacher_id,
            t.full_name as teacher_name,
            COUNT(s.id) as student_count
        FROM groups g
        JOIN group_teachers t ON g.teacher_id = t.id
        LEFT JOIN groups_students s ON s.id_group = g.id
        GROUP BY g.id, g.course_name, t.id, t.full_name
        ORDER BY g.id
        "#
    )
    .load::<GroupWithDetails>(conn)
    .map_err(|e| format!("Error al obtener grupos: {}", e))
}

#[command]
pub fn get_group_by_id(group_id: i32) -> Result<GroupWithStudents, String> {
    use diesel::sql_query;
    print!("Obteniendo grupo con ID: {}", group_id);
    let conn = &mut establish_connection();
    let rows = sql_query(
        r#"
        SELECT 
            g.id as group_id,
            g.course_name,
            t.full_name as teacher_name,
            s.id as student_id,
            s.full_name as student_name,
            s.control_number as control_number
        FROM groups g
        JOIN group_teachers t ON g.teacher_id = t.id
        LEFT JOIN groups_students gs ON gs.id_group = g.id
        LEFT JOIN intern_students s ON s.id = gs.id_student
        WHERE g.id = $1
        ORDER BY s.full_name
        "#
    )
    .bind::<diesel::sql_types::Integer, _>(group_id)
    .load::<RawRow>(conn)
    .map_err(|e| e.to_string())?;

    if rows.is_empty() {
        return Err("Grupo no encontrado".to_string());
    }

    let first = &rows[0];
    let group_id = first.group_id;
    let course_name = first.course_name.clone();
    let teacher_name = first.teacher_name.clone();

    let students = rows
        .into_iter()
        .filter_map(|row| {
            if let (Some(id), Some(name), Some(control_number)) =
                (row.student_id, row.student_name, row.control_number)
            {
                Some(StudentInfo { id, name, control_number })
            } else {
                None
            }
        })
        .collect();

    Ok(GroupWithStudents {
        group_id,
        course_name,
        teacher_name,
        students,
    })
}

#[command]
pub fn add_student_to_group(
    group_id: i32,
    student_id: i32,
) -> Result<(), String> {
    use crate::schema::groups_students::dsl::*;
    use diesel::insert_into;

    let conn = &mut establish_connection();

    let new_entry = (id_group.eq(group_id), id_student.eq(student_id));

    insert_into(groups_students)
        .values(new_entry)
        .execute(conn)
        .map_err(|e| format!("Error al agregar estudiante al grupo: {}", e))?;

    Ok(())
}

#[command]
pub fn create_group(
    course_name: String,
    teacher_id: i32,
) -> Result<GroupResult, String> {
    let conn = &mut establish_connection();

    let new_group = NewGroup {
        course_name,
        teacher_id,
    };

    diesel::insert_into(groups::table)
        .values(&new_group)
        .get_result::<GroupResult>(conn)
        .map_err(|e| format!("Error al crear el grupo: {}", e))
}

#[command]
pub fn delete_group(group_id: i32) -> Result<(), String> {
    use crate::schema::groups::dsl::*;
    use diesel::delete;

    let conn = &mut establish_connection();

    // Primero, eliminamos las relaciones en groups_students
    diesel::delete(groups_students::table.filter(groups_students::id_group.eq(group_id)))
        .execute(conn)
        .map_err(|e| format!("Error al eliminar estudiantes del grupo: {}", e))?;

    // Luego, eliminamos el grupo
    delete(groups.filter(id.eq(group_id)))
        .execute(conn)
        .map_err(|e| format!("Error al eliminar el grupo: {}", e))?;

    Ok(())
}