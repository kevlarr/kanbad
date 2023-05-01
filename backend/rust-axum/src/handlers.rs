use std::env;
use std::time::Duration;

use axum::body::Body;
use axum::extract::State;
use sqlx::postgres::{PgPool, PgPoolOptions};
use axum::response::IntoResponse;

// use crate::store;


#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
}

impl AppState {
    pub async fn new() -> Self {
        let db_url = env::var("DATABASE_URL")
            .expect("DATABASE_URL not set");

        let pool = PgPoolOptions::new()
            .acquire_timeout(Duration::from_secs(5))
            .max_connections(5)
            .connect(&db_url)
            .await
            .expect("failed to connect to database");

        AppState { pool }
    }
}

pub async fn create_workspace(
    State(state): State<AppState>,
) -> impl IntoResponse {
    "created workspace".to_owned()
}

pub async fn get_workspace(/*State(state): State<AppState>*/) {
}
