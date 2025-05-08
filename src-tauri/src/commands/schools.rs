use crate::db::connection::establish_connection;
use crate::db::models::{School, NewSchool};
use crate::schema::schools::dsl::{schools, school_name, address,cct,director_name,zone,sector};
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

    let new_school = NewSchool {
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
            println!("✅ Escuelas obtenidas correctamente.");
            Ok(school_list)
        },
        Err(e) => {
            println!("❌ Error al obtener escuelas: {:?}", e);
            Err(format!("Error de base de datos: {}", e))
        }
    }
}