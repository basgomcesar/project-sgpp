use std::fmt::format;

use crate::db::connection::establish_connection;
use crate::db::models::{School, NewSchool, Context, SchoolWithDetails, SectorChief, ZoneSupervisor,NewAssignedTutor,AssignedTutor,NewZoneSupervisor};
use crate::db::models::AccompanyingTeacher;
use crate::schema::schools::dsl::{schools,id};
use crate::schema::accompanying_teacher::dsl::accompanying_teacher;
use crate::schema::contexts::dsl::contexts;
use crate::schema::assigned_tutors;
use crate::schema::{ sector_chiefs, zone_supervisors};
use diesel::result::Error::NotFound;
use diesel::{RunQueryDsl, QueryDsl, ExpressionMethods};
use tauri::command;


#[command]
pub fn create_school(
    name_new: String,
    address_new: String,
    cct_new: Option<String>,
    director_name_new: Option<String>,
    sector_new: Option<String>,
    zone_new: Option<String>,

) -> Result<bool, String> {
    let conn = &mut establish_connection();
    
    println!("🔵 Datos recibidos:");
    println!("Nombre: {}", name_new);
    println!("Dirección: {}", address_new);
    println!("CCT: {:?}", cct_new);
    println!("Nombre del director: {:?}", director_name_new);
    println!("Sector: {:?}", sector_new);
    println!("Zona: {:?}", zone_new);

    let new_school: NewSchool = NewSchool {
        cct: cct_new,
        school_name: Some(name_new),
        director_name: director_name_new,
        address: Some(address_new),
        sector: sector_new,
        zone: zone_new,
        locality: None,
        sector_cheif_id: None,
        zone_supervisor: None,
        context_id: None,
    };

    match diesel::insert_into(schools)
        .values(&new_school)
        .execute(conn)
    {
        Ok(rows_affected) => {
            println!("✅ Insertado correctamente. Filas afectadas: {}", rows_affected);
            Ok(rows_affected > 0)
        },
        Err(e) => {
            println!("❌ Error al insertar: {:?}", e);
            Err(format!("Error de base de datos: {}", e))
        }
    }
}

//Funcion para obtener todas las escuelas
#[command]
pub fn get_schools() -> Result<Vec<School>, String> {
    let conn = &mut establish_connection();
    
    match schools.load::<School>(conn) {
        Ok(school_list) => {
            Ok(school_list)
        },
        Err(e) => {
            Err(format!("Error de base de datos: {}", e))
        }
    }
}

#[command]
pub fn get_school_by_id(school_id: i32) -> Result<SchoolWithDetails, String> {
    use crate::schema::{schools, sector_chiefs, zone_supervisors, contexts};
    use diesel::prelude::*;

    let conn = &mut establish_connection();

    let result = schools::table
        .find(school_id)
        .left_join(sector_chiefs::table.on(schools::sector_cheif_id.eq(sector_chiefs::id.nullable())))
        .left_join(zone_supervisors::table.on(schools::zone_supervisor.eq(zone_supervisors::id.nullable())))
        .left_join(contexts::table.on(schools::context_id.eq(contexts::id.nullable())))
        .select((
            schools::id,
            schools::cct,
            schools::school_name,
            schools::director_name,
            schools::address,
            schools::sector,
            schools::zone,
            schools::locality,
            schools::sector_cheif_id,
            schools::zone_supervisor,
            schools::context_id,
            sector_chiefs::id.nullable(),
            sector_chiefs::full_name.nullable(),
            zone_supervisors::id.nullable(),
            zone_supervisors::full_name.nullable(),
            contexts::id.nullable(),
            contexts::context_name.nullable(),
        ))
        .first::<(
            i32, Option<String>, Option<String>, Option<String>, Option<String>, 
            Option<String>, Option<String>, Option<String>, Option<i32>, Option<i32>, 
            Option<i32>, Option<i32>, Option<String>, Option<i32>, Option<String>, 
            Option<i32>, Option<String>
        )>(conn);

    match result {
        Ok((
            school_id,  // Cambiado de id a school_id para evitar conflicto con el struct id
            cct,
            school_name,
            director_name,
            address,
            sector,
            zone,
            locality,
            sector_cheif_id,
            zone_supervisor,
            context_id,
            sector_chief_id,
            sector_chief_name,
            zone_supervisor_id,
            zone_supervisor_name,
            _context_id_2,  // Usamos _ para indicar que no lo usamos
            context_name,
        )) => {
            Ok(SchoolWithDetails {
                school: School {
                    id: school_id,
                    cct,
                    school_name,
                    director_name,
                    address,
                    sector,
                    zone,
                    locality,
                    sector_cheif_id,
                    zone_supervisor,
                    context_id,
                },
                sector_chief: SectorChief {
                    id: sector_chief_id.unwrap_or(0),
                    full_name: sector_chief_name,  // Ya es Option<String>
                },
                zone_supervisor: ZoneSupervisor {
                    id: zone_supervisor_id.unwrap_or(0),
                    full_name: zone_supervisor_name,  // Ya es Option<String>
                },
                context: Context {
                    id: context_id.unwrap_or(0),  // Usamos context_id en lugar de context_id_2
                    context_name,  // Ya es Option<String>
                },
            })
        }
        Err(diesel::result::Error::NotFound) => {
            println!("❌ Escuela con ID {} no encontrada", school_id);
            Err(format!("Escuela con ID {} no encontrada", school_id))
        }
        Err(e) => {
            println!("❌ Error al obtener escuela: {:?}", e);
            Err(format!("Error de base de datos: {}", e))
        }
    }
}

#[command]
pub fn get_all_contexts() -> Result<Vec<Context>,String>{
    let conn = &mut  establish_connection();
    
    match contexts.load::<Context>(conn) {
        Ok(context_list) => {
            Ok(context_list)
        },
        Err(e) => {
            Err(format!("Error de base de datos: {}", e))
        }
    }
}

#[command]
pub fn create_tutor(name_new: String, id_school: i32) -> Result<bool, String> {
    use crate::schema::assigned_tutors::dsl::*;
    
    let conn = &mut establish_connection();
    
    let new_tutor = NewAssignedTutor {
        full_name: name_new,
        school_id: id_school,
    };

    diesel::insert_into(assigned_tutors)
        .values(&new_tutor)
        .execute(conn)
        .map(|rows_affected| rows_affected > 0)
        .map_err(|e| format!("Error de base de datos: {}", e))
}

#[command]
pub fn get_tutors_by_school_id(id_school: i32) -> Result<Vec<AssignedTutor>, String> {
    let conn = &mut establish_connection();
    
    match assigned_tutors::table
        .filter(assigned_tutors::dsl::school_id.eq(id_school))
        .load::<AssignedTutor>(conn) 
    {
        Ok(tutor_list) => Ok(tutor_list),
        Err(e) => Err(format!("Error al obtener tutores: {}", e))
    }
}

#[command]
pub fn get_accompanying_teachers() -> Result<Vec<AccompanyingTeacher>, String> {
    let conn = &mut establish_connection();
    
    match accompanying_teacher.load::<AccompanyingTeacher>(conn) {
        Ok(teachers_list) => Ok(teachers_list),
        Err(e) => Err(format!("Error de base de datos: {}", e)),
    }
}

#[command]
pub fn delete_tutor(tutor_id: i32) -> Result<bool, String> {
    use crate::schema::assigned_tutors::dsl::*;
    use diesel::delete;

    let conn = &mut establish_connection();

    match delete(assigned_tutors.filter(id.eq(tutor_id)))
        .execute(conn) 
    {
        Ok(rows_affected) => {
            if rows_affected > 0 {
                Ok(true)
            } else {
                Err(format!("No se encontró un tutor con ID {}", tutor_id))
            }
        },
        Err(e) => Err(format!("Error al eliminar el tutor: {}", e)),
    }
}

#[command]
pub fn create_zone_supervisor(
    new_full_name: String,
) -> Result<bool, String> {
    use crate::schema::zone_supervisors::dsl::*;
    
    let conn = &mut establish_connection();
    
    let new_supervisor = NewZoneSupervisor {
        full_name: Some(new_full_name),
    };
    diesel::insert_into(zone_supervisors)
        .values(&new_supervisor)
        .execute(conn)
        .map(|rows_affected| rows_affected > 0)
        .map_err(|e| format!("Error de base de datos: {}", e))
}

#[command]
pub fn get_zone_supervisors() -> Result<Vec<ZoneSupervisor>, String> {
    let conn = &mut establish_connection();
    
    match zone_supervisors::table.load::<ZoneSupervisor>(conn) {
        Ok(supervisors_list) => Ok(supervisors_list),
        Err(e) => Err(format!("Error de base de datos: {}", e)),
    }
}