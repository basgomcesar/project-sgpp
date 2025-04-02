use crate::db::connection::DbPool;
use crate::db::models::User;
use diesel::prelude::*;

pub fn get_users(pool: &DbPool) -> Vec<User> {
    use crate::db::schema::users::dsl::*;
    
    let conn = pool.get().expect("Error obteniendo la conexión");
    users.load::<User>(&conn).expect("Error al obtener usuarios")
}
