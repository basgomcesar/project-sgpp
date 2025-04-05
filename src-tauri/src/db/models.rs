use chrono::{NaiveDateTime};
use serde::{Serialize, Deserialize};
use serde_with::{serde_as};
use diesel::{Queryable, Insertable, AsChangeset, Identifiable};
use crate::schema::*;

// Group Teachers
#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, Identifiable, AsChangeset, Clone)]
#[diesel(table_name = group_teachers)]
pub struct GroupTeacher {
    pub id: i32,
    pub full_name: String,
}

#[derive(Debug, Serialize, Deserialize, Insertable)]
#[diesel(table_name = group_teachers)]
pub struct NewGroupTeacher {
    pub full_name: String,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone)]
#[diesel(table_name = intern_students)]
pub struct InternStudent {
    pub id: i32,
    pub control_number: Option<String>,     // Nullable<Varchar>
    pub full_name: Option<String>,          // Nullable<Varchar>
    pub semester_id: Option<i32>,           // Nullable<Int4>
    pub accumulated_hours: Option<i32>,     // Nullable<Int4>
}

#[derive(Debug, Serialize, Deserialize, Insertable)]
#[diesel(table_name = intern_students)]
pub struct NewInternStudent {
    pub control_number: String,
    pub full_name: String,
    pub semester_id: i32,
    pub accumulated_hours: i32,
}

// Assigned Tutors
#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone)]
#[diesel(table_name = assigned_tutors)]
pub struct AssignedTutor {
    pub id: i32,
    pub full_name: String,
    pub school_id: i32,
}

#[derive(Debug, Serialize, Deserialize, Insertable)]
#[diesel(table_name = assigned_tutors)]
pub struct NewAssignedTutor {
    pub full_name: String,
    pub school_id: i32,
}

// Practices
#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone)]
#[diesel(table_name = practices)]
#[serde_as]
pub struct Practice {
    pub id: i64,
    pub school_id: i32,
    pub student_id: i32,
    pub group_teacher_id: i32,
    #[serde_as(as = "Option<TimestampSeconds>")]
    pub initial_date: Option<NaiveDateTime>,
    #[serde_as(as = "Option<TimestampSeconds>")]
    pub final_date: Option<NaiveDateTime>,
    pub accompanying_teacher_id: i32,
    pub grade_and_group: String,
    pub assigned_tutor_id: i32,
    pub practice_hours: i32,
}


#[derive(Debug, Serialize, Deserialize, Queryable, Clone)]
#[diesel(table_name = practices)]
#[serde_as]
pub struct NewPractice {
    pub school_id: i32,
    pub student_id: i32,
    pub group_teacher_id: i32,
    #[serde_as(as = "Option<TimestampSeconds>")]
    pub initial_date: Option<NaiveDateTime>,
    #[serde_as(as = "Option<TimestampSeconds>")]
    pub final_date: Option<NaiveDateTime>,
    pub accompanying_teacher_id: i32,
    pub grade_and_group: String,
    pub assigned_tutor_id: i32,
    pub practice_hours: i32,
}

// Incluir modelos para todas las demás tablas de manera similar...