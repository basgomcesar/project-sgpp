use diesel::prelude::*;
use diesel::pg::PgConnection;
use std::env;
use dotenvy::dotenv;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();
    
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL debe estar definida en .env");
    
    let conn = PgConnection::establish(&database_url)
        .expect("Error al conectar a PostgreSQL");
    
    println!("✅ Conexión a PostgreSQL establecida correctamente");
    conn
}
