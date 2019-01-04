extern crate dotenv;

use actix_web::{
    http::Method,
    server,
    App,
    HttpRequest,
    HttpResponse
};
use diesel::{pg::PgConnection, prelude::*};
use dotenv::dotenv;
use std::env;
use twello::{create_workspace};

struct AppState {
    conn: PgConnection,
}

type Request = HttpRequest<AppState>;

fn hello(_req: Request) -> HttpResponse {
    HttpResponse::Ok().body("
        <!doctype html>
        <html>
            <head><title>Hello, Twello!</title></head>
            <body><h1>Hello, Twello!</h1></body>
        </html>
    ")
}

fn post_workspaces(req: &Request) -> HttpResponse {
    let workspace = create_workspace(&req.state().conn);
    HttpResponse::Ok().json(workspace)
}

fn main() {
    dotenv().ok();

    let create_app = || {
        // Each thread needs own connection
        let database_url = env::var("DATABASE_URL")
            .expect("Must set DATABASE_URL");
        let conn = PgConnection::establish(&database_url)
            .expect("Error connecting to database");

        App::with_state(AppState { conn })
            .route("hello", Method::GET, hello)
            .scope("api", |api| { api
                .nested("v1", |v1| { v1
                    .resource("workspaces", |r| {
                        r.method(Method::POST).f(post_workspaces)
                    })
                })
            })
    };

    server::new(create_app)
        .bind("127.0.0.1:1337")
        .unwrap()
        .run();
}
