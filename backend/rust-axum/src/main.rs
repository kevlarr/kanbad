use std::net::SocketAddr;

use axum::{
    http::{header::CONTENT_TYPE, HeaderValue, Method},
    // response::IntoResponse,
    routing::{get, post},
    // Json,
    Router,
};
use dotenvy::dotenv;
use tower_http::cors::CorsLayer;

use kanbad::handlers::*;

#[tokio::main]
async fn main() {
    dotenv().expect(".env file not found");

    let state = AppState::new().await;

    let addr = SocketAddr::from(([127, 0, 0, 1], 30001));
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST])
        .allow_headers([CONTENT_TYPE]);

    // Nested routers would work, as well
    let app = Router::new()
        .nest("/api", Router::new()
            .with_state(state)
            .layer(cors)
            // .route("/workspaces", post(create_workspace))
            .route("/workspaces/:uuid", get(get_workspace))
        );

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// async fn json() -> impl IntoResponse {
//     Json(vec!["one", "two", "three"])
// }
