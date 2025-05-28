use crate::db::connection::establish_connection;
use crate::db::models::NewPractice;
use crate::db::models::Practice;
use crate::db::models::PracticeWithAllDetails;
use crate::db::models::PracticeWithDetails;
use crate::schema::practices::dsl::{id, practices, student_id};
use diesel::associations::HasTable;
use diesel::dsl::delete;
use diesel::prelude::*;
use diesel::sql_query;
use diesel::sql_types::Integer;
// Importa específicamente lo necesario
use chrono::NaiveDateTime;
use diesel::{ExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
use tauri::command;

#[command]
pub fn get_practices_by_student_id(s_id: i32) -> Vec<PracticeWithDetails> {
    let conn = &mut establish_connection();

    let conn = &mut establish_connection();

    let query = r#"
        SELECT
            p.id,
            p.school_id,
            s.school_name,
            p.student_id,
            p.group_teacher_id,
            gt.full_name AS group_teacher_name,
            p.initial_date,
            p.final_date,
            p.accompanying_teacher_id,
            at.full_name AS accompanying_teacher_name,
            p.grade_and_group,
            p.assigned_tutor_id,
            tut.full_name AS assigned_tutor_name,
            p.practice_hours
        FROM practices p
        LEFT JOIN schools s ON p.school_id = s.id
        LEFT JOIN group_teachers gt ON p.group_teacher_id = gt.id
        LEFT JOIN accompanying_teacher at ON p.accompanying_teacher_id = at.id
        LEFT JOIN assigned_tutors tut ON p.assigned_tutor_id = tut.id
        WHERE p.student_id = $1
    "#;

    sql_query(query)
        .bind::<Integer, _>(s_id)
        .load::<PracticeWithDetails>(conn)
        .expect("Error loading practices")
}

#[command]
pub fn create_practice(
    new_school_id: i32,
    other_student_id: i32,
    group_teacher_id: i32,
    start_date: Option<String>,
    end_date: Option<String>,
    accompanying_teacher_id: Option<i32>,
    grade_and_group: String,
    assigned_tutor_id: i32,
    practice_hours: i32,
) -> Result<bool, String> {
    let conn = &mut establish_connection();
    println!(
        "Creating practice with data: {:?}",
        (
            new_school_id,
            other_student_id,
            group_teacher_id,
            start_date.clone(),
            end_date.clone(),
            accompanying_teacher_id,
            grade_and_group.clone(),
            assigned_tutor_id,
            practice_hours
        )
    ); // Parse dates with proper error handling
    let initial_date = match start_date {
        Some(s) => match NaiveDateTime::parse_from_str(&s, "%Y-%m-%d %H:%M:%S") {
            Ok(dt) => Some(dt),
            Err(e) => return Err(format!("Invalid start date format: {}", e)),
        },
        None => None,
    };

    let final_date = match end_date {
        Some(s) => match NaiveDateTime::parse_from_str(&s, "%Y-%m-%d %H:%M:%S") {
            Ok(dt) => Some(dt),
            Err(e) => return Err(format!("Invalid end date format: {}", e)),
        },
        None => None,
    };

    let new_practice = NewPractice {
        school_id: new_school_id,
        student_id: other_student_id,
        group_teacher_id,
        initial_date,
        final_date,
        accompanying_teacher_id,
        grade_and_group,
        assigned_tutor_id,
        practice_hours,
    };

    diesel::insert_into(practices)
        .values(&new_practice)
        .execute(conn)
        .map(|rows_affected| rows_affected > 0)
        .map_err(|e| format!("Database error: {}", e))
}

#[command]
pub fn delete_practice(practice_id: i64) -> Result<bool, String> {
    // Changed to i64
    let conn = &mut establish_connection();

    let deleted_rows = diesel::delete(practices.filter(id.eq(practice_id)))
        .execute(conn)
        .map_err(|e| format!("Error deleting practice: {}", e))?;

    Ok(deleted_rows > 0)
}
use std::panic;

#[command]
pub fn get_practice_details(practice_id: i64) -> Result<PracticeWithAllDetails, String> {

let result: std::thread::Result<Result<PracticeWithAllDetails, diesel::result::Error>> = panic::catch_unwind(|| {
        let conn = &mut establish_connection();
        println!("Fetching details for practice ID: {}", practice_id);


        let query = r#"
        SELECT
          p.id AS id,
          p.school_id AS school_id,
          s.school_name AS school_name,
          p.student_id AS student_id,
          i.full_name AS student_name,
          p.group_teacher_id AS group_teacher_id,
          gt.full_name AS group_teacher_name,
          p.initial_date AS initial_date,
          p.final_date AS final_date,
          p.accompanying_teacher_id AS accompanying_teacher_id,
          at.full_name AS accompanying_teacher_name,
          p.grade_and_group AS grade_and_group,
          p.assigned_tutor_id AS assigned_tutor_id,
          tut.full_name AS assigned_tutor_name,
          p.practice_hours AS practice_hours
        FROM practices p
        LEFT JOIN schools s ON p.school_id = s.id
        LEFT JOIN intern_students i ON p.student_id = i.id
        LEFT JOIN group_teachers gt ON p.group_teacher_id = gt.id
        LEFT JOIN accompanying_teacher at ON p.accompanying_teacher_id = at.id
        LEFT JOIN assigned_tutors tut ON p.assigned_tutor_id = tut.id
        WHERE p.id = $1
    "#;

        println!("Executing query: {}", query);

        let res = sql_query(query)
            .bind::<diesel::sql_types::BigInt, _>(practice_id)
            .get_result::<PracticeWithAllDetails>(conn)?;

        Ok::<_, diesel::result::Error>(res)
    });
    match result {
        Ok(Ok(data)) => Ok(data),
        Ok(Err(db_err)) => Err(format!("DB error: {}", db_err)),
        Err(panic_err) => Err("¡Error inesperado en Rust! (panic)".to_string()),
    }
}
