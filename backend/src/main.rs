#![feature(decl_macro)]

use rocket::{get, launch, post, routes, Build, Rocket};
use rocket::serde::json::Json;
use rocket::State;
use rocket_cors::{AllowedOrigins, CorsOptions};
use serde::{Serialize, Deserialize};
use std::sync::Mutex;

mod components;

// Serileştirilebilir ve Deserileştirilebilir özelliğine sahip Message, Request ve Response yapıları tanımlanıyor.
#[derive(Serialize, Deserialize)]
struct Message {
    message: String,
}

// Request yapısı tanımlanıyor.
#[derive(Serialize, Deserialize, Clone, Debug)]
struct Request {
    name: String,
    id: u32,
}

// Response yapısı tanımlanıyor.
#[derive(Serialize, Deserialize, Clone)]
struct Response {
    greeting: String,
}

// GET metodu ile çağrıldığında "Merhaba, Dünya!" mesajını döndüren hello fonksiyonu tanımlanıyor.
#[get("/")]
fn hello() -> Json<Message> {
    Json(Message {
        message: String::from("Welcome to Truth Socaial!"),
    })
}

#[post("/truth", data = "<request>")]
fn greet(request: Json<Request>, state: &State<Mutex<Vec<(u32, String, String)>>>) -> Json<Response> {
    // Gelen isteği bir değişkene atama
    let received_request = request.clone().into_inner();
    // Gelen isteği JSON formatına dönüştürme
    let json_request = components::converter::convert_to_json(received_request.id, received_request.name.clone(), format!("{:?}", received_request));

    // Vektöre ekleme
    let mut vec = state.lock().unwrap();
    components::vector::add_tuple_to_vector(&mut vec, received_request.id, received_request.name.clone(), json_request.clone());

    Json(Response {
        greeting: format!("{}!", received_request.name),
    })
}

#[launch]
fn rocket() -> Rocket<Build> {
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec![rocket::http::Method::Get, rocket::http::Method::Post]
                .into_iter()
                .map(From::from)
                .collect()
        )
        .allow_credentials(true)
        .to_cors()
        .expect("CORS yapılandırması oluşturulurken hata");

    rocket::build()
        .manage(Mutex::new(components::vector::initialize_vector()))
        .mount("/", routes![hello, greet])
        .attach(cors)
}