use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use std::env;

pub fn establish_connection() -> SqliteConnection {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL no está definido");
    SqliteConnection::establish(&database_url)
        .expect("Error conectando a la base de datos")
}
