use diesel::prelude::*;
use diesel::pg::PgConnection;
use std::env;

pub fn establish_connection() -> PgConnection {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL no está definido");
    PgConnection::establish(&database_url)
        .expect("Error conectando a la base de datos")
}
