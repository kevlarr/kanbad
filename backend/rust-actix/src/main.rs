use actix_web::{
    http::Method,
    server,
    App,
    HttpRequest,
    HttpResponse
};

fn hello(_req: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().body("
        <!doctype html>
        <html>
            <head><title>Hello, Twello!</title></head>
            <body><h1>Hello, Twello!</h1></body>
        </html>
    ")
}

fn main() {
    server::new(|| {
        App::new().route("hello", Method::GET, hello)
    }).bind("127.0.0.1:1337")
        .unwrap()
        .run();
}
