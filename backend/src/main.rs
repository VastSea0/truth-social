// main.rs
#![feature(decl_macro)]

use std::fmt::format;

use components::vector::initialize_vector;
use rocket::{form, get, launch, post, routes, Build, Rocket};
use rocket::serde::json::Json;
use rocket_cors::{AllowedOrigins, CorsOptions};
use serde::{Serialize, Deserialize};

mod components;

// Serileştirilebilir ve Deserileştirilebilir özelliğine sahip Message, Request ve Response yapıları tanımlanıyor.
#[derive(Serialize, Deserialize)]
struct Message {
    message: String,
}


// Request ve Response yapıları tanımlanıyor.
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
        message: String::from("Merhaba, Dünya!"),
    })
     
}


// POST metodu ile çağrıldığında "Merhaba, {name}!" mesajını döndüren greet fonksiyonu tanımlanıyor.
#[post("/truth", data = "<request>")]
fn greet(request: Json<Request>) -> Json<Response> {
    // Gelen isteği bir değişkene atama
    let received_request = request.clone().into_inner();
    // Gelen isteği ekrana yazdırma

    println!("Merhaba, {:#?}!", received_request);

    // Gelen isteği JSON formatında döndürme
    Json(Response {
        greeting: format!("Merhaba, {}!", request.name),
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
        .mount("/", routes![hello, greet])
        .attach(cors)
    
   
}