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
use twello::{
    create_workspace,
    find_workspace,
    create_board,
    find_boards,
    find_board,
};
use uuid::Uuid;

struct AppState {
    conn: PgConnection,
}

type Request = HttpRequest<AppState>;
type Response = HttpResponse;

fn main() {
    dotenv().ok();

    let create_app = || {
        // Each thread needs own connection
        let database_url = env::var("TRECLO_DATABASE_URL")
            .expect("Must set TRECLO_DATABASE_URL");
        let conn = PgConnection::establish(&database_url)
            .expect("Error connecting to database");

        App::with_state(AppState { conn })
            .route("hello", Method::GET, hello)
            .scope("api", |api| { api
                .nested("v1", |v1| { v1
                    .nested("boards", |boards| { boards
                        .resource("", |r| {
                            r.method(Method::POST).f(post_boards);
                            r.method(Method::GET).f(get_boards);
                        })
                        .resource("{identifier}", |r| {
                            r.method(Method::GET).f(get_board);
                        })
                    })
                    .nested("workspaces", |workspaces| { workspaces
                        .resource("", |r| {
                            r.method(Method::POST).f(post_workspaces);
                        })
                        .resource("{identifier}", |r| {
                            r.method(Method::GET).f(get_workspace);
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

fn hello(_req: Request) -> Response {
    Response::Ok().body("
        <!doctype html>
        <html>
            <head><title>Hello, Twello!</title></head>
            <body><h1>Hello, Twello!</h1></body>
        </html>
    ")
}

fn post_workspaces(req: &Request) -> Response {
    let workspace = create_workspace(&req.state().conn);
    Response::Ok().json(workspace)
}

fn get_workspace(req: &Request) -> Response {
    match parse_identifier(req.match_info().get("identifier")) {
        Some(parsed) => match find_workspace(&req.state().conn, parsed) {
            Some(workspace) => Response::Ok().json(workspace),
            None => Response::NotFound().finish(),
        },
        None => Response::BadRequest().finish(),
    }
}

fn get_boards(req: &Request) -> Response {
    let conn = &req.state().conn;
    let body = format!("{:?}", find_boards(conn, 4));

    Response::Ok().body(body)
}

fn post_boards(req: &Request) -> Response {
    let conn = &req.state().conn;

    match parse_identifier(req.query().get("workspace").map(|s| s.as_str())) {
        Some(ws_id) => match find_workspace(conn, ws_id) {
            Some(workspace) => {
                let board = create_board(conn, workspace.id);
                Response::Ok().json(board)
            },
            None => Response::NotFound().finish(),
        }
        None => Response::BadRequest().finish(),
    }
}

fn get_board(req: &Request) -> Response {
    match parse_identifier(req.match_info().get("identifier")) {
        Some(parsed) => match find_board(&req.state().conn, parsed) {
            Some(board) => Response::Ok().json(board),
            None => Response::NotFound().finish(),
        },
        None => Response::BadRequest().finish(),
    }
}

fn parse_identifier(i: Option<&str>) -> Option<Uuid> {
    match i {
        Some(identifier) => match Uuid::parse_str(identifier) {
            Ok(parsed) => Some(parsed),
            Err(_) => None,
        },
        None => None,
    }
}
