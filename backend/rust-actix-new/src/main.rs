use std::io;
use std::env;
use std::time::Duration;

use actix_web::{App, HttpServer, Responder, get, post};
use actix_web::http::header;
use actix_web::middleware::Logger;
use actix_web::web::{Data, Json, Path, Query, scope};
use actix_cors::Cors;
use dotenvy::dotenv;
use env_logger::Env;
use serde::Deserialize;
use sqlx::postgres::{PgPool, PgPoolOptions};
use uuid::Uuid;

use kanbad::store;

#[derive(Clone)]
pub struct State {
    pub pool: PgPool,
}

impl State {
    pub async fn new() -> Self {
        let db_url = env::var("DATABASE_URL")
            .expect("DATABASE_URL not set");

        let pool = PgPoolOptions::new()
            .acquire_timeout(Duration::from_secs(5))
            .max_connections(5)
            .connect(&db_url)
            .await
            .expect("failed to connect to database");

        State { pool }
    }
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    dotenv().expect(".env file not found");
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    let state = State::new().await;

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://127.0.0.1:3000")
            .allowed_origin("http://0.0.0.0:3000")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![header::ACCEPT])
            .allowed_header(header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .app_data(Data::new(state.clone()))
            .wrap(cors)
            .service(
                scope("/api")
                    .service(create_board)
                    .service(get_boards)
                    .service(create_card)
                    .service(get_cards)
                    .service(create_workspace)
                    .service(get_workspace)
            )
    })
        .bind(("127.0.0.1", 3001))?
        .run()
        .await?;

    Ok(())
}

// TODO: Error responses and no `unwrap` in store methods
#[derive(Deserialize)]
pub struct ByWorkspace {
    workspace: Uuid,
}

#[get("/boards")]
pub async fn get_boards(
    state: Data<State>,
    query: Query<ByWorkspace>,
) -> impl Responder {
    Json(store::Board::find_all(&state.pool, &query.workspace).await)
}

#[post("/boards")]
pub async fn create_board(
    state: Data<State>,
    board: Json<store::NewBoard>,
) -> impl Responder {
    Json(board.create(&state.pool).await)
}

#[get("/cards")]
pub async fn get_cards(
    state: Data<State>,
    query: Query<ByWorkspace>,
) -> impl Responder {
    Json(store::Card::find_all(&state.pool, &query.workspace).await)
}

#[post("/cards")]
pub async fn create_card(
    state: Data<State>,
    card: Json<store::NewCard>,
) -> impl Responder {
    Json(card.create(&state.pool).await)
}

#[post("/workspaces")]
pub async fn create_workspace(
    state: Data<State>,
) -> impl Responder {
    Json(store::NewWorkspace.create(&state.pool).await)
}

#[derive(Deserialize)]
pub struct WorkspacePath {
    workspace_uuid: Uuid,
}

#[get("/workspaces/{workspace_uuid}")]
pub async fn get_workspace(
    state: Data<State>,
    path: Path<WorkspacePath>,
) -> impl Responder {
    Json(store::Workspace::find(&state.pool, &path.workspace_uuid).await)
}
