use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_with::serde_as;
use diesel::{Queryable, Insertable, AsChangeset, Identifiable, Selectable};
use crate::schema::*;
use diesel::sql_types::{Integer, Text, Nullable, BigInt};
use diesel::QueryableByName;



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

#[derive(AsChangeset,Debug, Serialize, Deserialize, Insertable)]
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
#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone,Selectable)]
#[diesel(table_name = practices)]
#[serde_as]
pub struct Practice {
    pub id: i64,
    pub school_id: Option<i32>,  
    pub student_id: Option<i32>,  
    pub group_teacher_id: Option<i32>,  
    #[serde_as(as = "Option<TimestampSeconds>")]
    pub initial_date: Option<NaiveDateTime>, 
    #[serde_as(as = "Option<TimestampSeconds>")]
    pub final_date: Option<NaiveDateTime>,  
    pub accompanying_teacher_id: Option<i32>,  
    pub grade_and_group: Option<String>,  
    pub assigned_tutor_id: Option<i32>,  
    pub practice_hours: Option<i32>,  
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
// Schools
#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone)]
#[diesel(table_name = schools)]
pub struct School {
    pub id: i32,
    pub cct: Option<String>,              // Nullable<Varchar>
    pub school_name: Option<String>,     // Nullable<Varchar>
    pub director_name: Option<String>,   // Nullable<Varchar>
    pub address: Option<String>,         // Nullable<Varchar>
    pub sector: Option<String>,          // Nullable<Varchar>
    pub zone: Option<String>,            // Nullable<Varchar>
    pub locality: Option<String>,        // Nullable<Varchar>
    pub sector_cheif_id: Option<i32>,    // Nullable<Int4>
    pub zone_supervisor: Option<i32>,    // Nullable<Int4>
    pub context_id: Option<i32>,         // Nullable<Int4>
}

#[derive(Debug, Serialize, Deserialize, Insertable)]
#[diesel(table_name = schools)]
pub struct NewSchool {
    pub cct: Option<String>,
    pub school_name: Option<String>,
    pub director_name: Option<String>,
    pub address: Option<String>,
    pub sector: Option<String>,
    pub zone: Option<String>,
    pub locality: Option<String>,
    pub sector_cheif_id: Option<i32>,
    pub zone_supervisor: Option<i32>,
    pub context_id: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone)]
#[diesel(table_name = contexts)]
pub struct Context {
    pub id: i32,
    pub context_name: Option<String>,              // Nullable<Varchar>
}

#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone)]
#[diesel(table_name = sector_chiefs)]
pub struct SectorChief {
    pub id: i32,
    pub full_name: Option<String>, // Nullable<Varchar>
}
#[derive(Debug, Serialize, Deserialize, Insertable)]
#[diesel(table_name = sector_chiefs)]
pub struct NewSectorChief {
    pub full_name: String,
}
#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone)]
#[diesel(table_name = zone_supervisors)]
pub struct ZoneSupervisor {
    pub id: i32,
    pub full_name: Option<String>, // Nullable<Varchar>
}

#[derive(Debug, Serialize, Deserialize, Insertable)]
#[diesel(table_name = zone_supervisors)]
pub struct NewZoneSupervisor {
    pub full_name: String,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone)]
#[diesel(table_name = group_teachers)]
pub struct Teacher {
    pub id: i32,
    pub full_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Clone, Insertable, AsChangeset, Selectable)]
#[diesel(table_name = group_teachers)]
pub struct NewTeacher {
    pub full_name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Clone)]
pub struct SchoolWithDetails {
    pub school:School,
    pub sector_chief:SectorChief,
    pub zone_supervisor:ZoneSupervisor,
    pub context:Context,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone, Selectable)]
#[diesel(table_name = groups)]
pub struct Group {
    pub id: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub course_name: Option<String>, // max_length = 500
    pub teacher_id: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, Insertable)]
#[diesel(table_name = groups)]
pub struct NewGroup {
    pub course_name: String,
    pub teacher_id: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StudentInfo {
    pub id: i32,
    pub name: String,
    pub control_number: String,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct GroupWithStudents {
    pub group_id: i32,
    pub course_name: String,
    pub teacher_name: String,
    pub students: Vec<StudentInfo>,
}
#[derive(QueryableByName, Debug, Serialize, Deserialize)]
pub struct RawRow {
    #[sql_type = "diesel::sql_types::Integer"]
    pub group_id: i32,
    #[sql_type = "diesel::sql_types::Text"]
    pub course_name: String,
    #[sql_type = "diesel::sql_types::Text"]
    pub teacher_name: String,
    #[sql_type = "diesel::sql_types::Nullable<diesel::sql_types::Integer>"]
    pub student_id: Option<i32>,
    #[sql_type = "diesel::sql_types::Nullable<diesel::sql_types::Text>"]
    pub student_name: Option<String>,
    #[sql_type = "diesel::sql_types::Nullable<diesel::sql_types::Text>"]
    pub control_number: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, QueryableByName)]
pub struct GroupWithDetails {
    #[sql_type = "Integer"]
    pub id: i32,

    #[sql_type = "Text"]
    pub course_name: String,

    #[sql_type = "Integer"]
    pub teacher_id: i32,

    #[sql_type = "Text"]
    pub teacher_name: String,

    #[sql_type = "BigInt"]
    pub student_count: i64,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Identifiable, Clone)]
#[diesel(table_name = groups)]
pub struct GroupResult {
    pub id: i32,
    pub course_name: Option<String>,
    pub teacher_id: Option<i32>,
}


