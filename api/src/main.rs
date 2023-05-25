use std::io;
use std::env;
use std::time::Duration;

use actix_web::{App, HttpServer, HttpResponse, Responder, get, post, patch, delete};
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
        let logger = Logger::new("%a %{User-Agent}i");
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://127.0.0.1:3000")
            .allowed_origin("http://0.0.0.0:3000")
            .allowed_methods(vec!["GET", "POST", "PATCH", "DELETE"])
            .allowed_headers(vec![header::ACCEPT])
            .allowed_header(header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .app_data(Data::new(state.clone()))
            .wrap(cors)
            .wrap(logger)
            .service(
                scope("/api")
                    .service(get_boards)
                    .service(update_boards)
                    .service(create_board)
                    .service(update_board)
                    .service(delete_board)
                    .service(get_cards)
                    .service(update_cards)
                    .service(create_card)
                    .service(update_card)
                    .service(delete_card)
                    .service(get_workspaces)
                    .service(update_workspaces)
                    .service(create_workspace)
                    .service(get_workspace)
                    .service(update_workspace)
            )
    })
        .bind(("127.0.0.1", 3001))?
        .run()
        .await?;

    Ok(())
}

#[derive(Deserialize)]
pub struct BoardPath {
    board_uuid: Uuid,
}

#[derive(Deserialize)]
pub struct CardPath {
    card_uuid: Uuid,
}

#[derive(Deserialize)]
pub struct WorkspacePath {
    workspace_uuid: Uuid,
}

#[derive(Deserialize)]
pub struct ByCreator {
    creator: Uuid,
}

#[derive(Deserialize)]
pub struct ByWorkspace {
    workspace: Uuid,
}

// TODO: Error responses and no `unwrap` in store methods
#[get("/boards")]
pub async fn get_boards(
    state: Data<State>,
    query: Query<ByWorkspace>,
) -> impl Responder {
    Json(store::boards::find_all(&state.pool, &query.workspace).await)
}

#[patch("/boards")]
pub async fn update_boards(
    state: Data<State>,
    params: Json<Vec<store::boards::BoardLocationUpdate>>,
) -> impl Responder {
    Json(store::boards::update_locations(&state.pool, &params).await)
}

#[post("/boards")]
pub async fn create_board(
    state: Data<State>,
    board: Json<store::boards::NewBoard>,
) -> impl Responder {
    Json(store::boards::create(&state.pool, &board).await)
}

#[patch("/boards/{board_uuid}")]
pub async fn update_board(
    state: Data<State>,
    path: Path<BoardPath>,
    params: Json<store::boards::BoardUpdate>,
) -> impl Responder {
    Json(store::boards::update(&state.pool, &path.board_uuid, &params).await)
}

#[delete("/boards/{board_uuid}")]
pub async fn delete_board(
    state: Data<State>,
    path: Path<BoardPath>,
) -> impl Responder {
    if store::boards::delete(&state.pool, &path.board_uuid).await {
        HttpResponse::NoContent()
    } else {
        HttpResponse::NotFound()
    }
}

#[get("/cards")]
pub async fn get_cards(
    state: Data<State>,
    query: Query<ByWorkspace>,
) -> impl Responder {
    Json(store::cards::find_all(&state.pool, &query.workspace).await)
}

#[post("/cards")]
pub async fn create_card(
    state: Data<State>,
    card: Json<store::cards::NewCard>,
) -> impl Responder {
    Json(store::cards::create(&state.pool, &card).await)
}

#[patch("/cards")]
pub async fn update_cards(
    state: Data<State>,
    params: Json<Vec<store::cards::CardLocationUpdate>>,
) -> impl Responder {
    Json(store::cards::update_locations(&state.pool, &params).await)
}

#[patch("/cards/{card_uuid}")]
pub async fn update_card(
    state: Data<State>,
    path: Path<CardPath>,
    params: Json<store::cards::CardUpdate>,
) -> impl Responder {
    Json(store::cards::update(&state.pool, &path.card_uuid, &params).await)
}

#[delete("/cards/{card_uuid}")]
pub async fn delete_card(
    state: Data<State>,
    path: Path<CardPath>,
) -> impl Responder {
    if store::cards::delete(&state.pool, &path.card_uuid).await {
        HttpResponse::NoContent()
    } else {
        HttpResponse::NotFound()
    }
}

#[get("/workspaces")]
pub async fn get_workspaces(
    state: Data<State>,
    query: Query<ByCreator>,
) -> impl Responder {
    Json(store::workspaces::find_all(&state.pool, &query.creator).await)
}

#[post("/workspaces")]
pub async fn create_workspace(
    state: Data<State>,
    workspace: Json<store::workspaces::NewWorkspace>,
) -> impl Responder {
    Json(store::workspaces::create(&state.pool, &workspace).await)
}

#[patch("/workspaces")]
pub async fn update_workspaces(
    state: Data<State>,
    params: Json<Vec<store::workspaces::WorkspaceLocationUpdate>>,
) -> impl Responder {
    Json(store::workspaces::update_locations(&state.pool, &params).await)
}

#[get("/workspaces/{workspace_uuid}")]
pub async fn get_workspace(
    state: Data<State>,
    path: Path<WorkspacePath>,
) -> impl Responder {
    Json(store::workspaces::find(&state.pool, &path.workspace_uuid).await)
}

#[patch("/workspaces/{workspace_uuid}")]
pub async fn update_workspace(
    state: Data<State>,
    path: Path<WorkspacePath>,
    params: Json<store::workspaces::WorkspaceUpdate>,
) -> impl Responder {
    Json(store::workspaces::update(&state.pool, &path.workspace_uuid, &params).await)
}
