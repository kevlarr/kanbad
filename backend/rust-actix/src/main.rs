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
use twello::{create_workspace, find_workspace};
use uuid::Uuid;

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

fn get_workspace(req: &Request) -> HttpResponse {
    match req.match_info().get("identifier") {
        Some(identifier) => match Uuid::parse_str(identifier) {
            Ok(parsed) => match find_workspace(&req.state().conn, parsed) {
                Some(workspace) => HttpResponse::Ok().json(workspace),
                None => HttpResponse::NotFound().finish(),
            },
            Err(_) => HttpResponse::BadRequest().finish(),
        },
        None => HttpResponse::BadRequest().finish(),
    }
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
                    .nested("workspaces", |workspaces| { workspaces
                        .resource("", |r| { r
                            .method(Method::POST).f(post_workspaces)
                        })
                        .resource("{identifier}", |r| { r
                            .method(Method::GET).f(get_workspace)
                        })
                    })
                })
            })
    };

    server::new(create_app)
        .bind("127.0.0.1:1337")
        .unwrap()
        .run();
}
