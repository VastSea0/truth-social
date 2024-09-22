#![feature(decl_macro)]
use rocket::{get, launch, post, routes, Build, Rocket};
use rocket::serde::json::Json;
use rocket::State;
use rocket_cors::{AllowedOrigins, CorsOptions};
use serde::{Serialize, Deserialize};
use std::sync::Mutex;

mod components;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct User {
    id: u32,
    username: String,
    bio: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Truth {
    id: u32,
    user_id: u32,
    content: String,
    likes: u32,
    category: String,
    comments: Vec<Comment>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Comment {
    id: u32,
    user_id: u32,
    content: String,
}

#[derive(Serialize, Deserialize)]
struct Message {
    message: String,
}

#[derive(Serialize, Deserialize)]
struct CreateTruthRequest {
    user_id: u32,
    content: String,
    category: String,
}

#[derive(Serialize, Deserialize)]
struct CreateCommentRequest {
    user_id: u32,
    truth_id: u32,
    content: String,
}

type AppState = Mutex<(Vec<User>, Vec<Truth>)>;

#[get("/")]
fn hello() -> Json<Message> {
    Json(Message {
        message: String::from("Welcome to Truth Social!"),
    })
}

#[get("/truths")]
fn get_truths(state: &State<AppState>) -> Json<Vec<Truth>> {
    let (_, truths) = state.lock().unwrap().clone();
    Json(truths)
}

#[post("/truth", data = "<request>")]
fn create_truth(request: Json<CreateTruthRequest>, state: &State<AppState>) -> Json<Truth> {
    let mut state = state.lock().unwrap();
    let (_, ref mut truths) = *state;
    
    let new_truth = Truth {
        id: truths.len() as u32 + 1,
        user_id: request.user_id,
        content: request.content.clone(),
        likes: 0,
        category: request.category.clone(),
        comments: Vec::new(),
    };
    
    truths.push(new_truth.clone());
    Json(new_truth)
}

#[post("/like/<truth_id>")]
fn like_truth(truth_id: u32, state: &State<AppState>) -> Json<Truth> {
    let mut state = state.lock().unwrap();
    let (_, ref mut truths) = *state;
    
    let truth = truths.iter_mut().find(|t| t.id == truth_id).expect("Truth not found");
    truth.likes += 1;
    
    Json(truth.clone())
}

#[post("/comment", data = "<request>")]
fn create_comment(request: Json<CreateCommentRequest>, state: &State<AppState>) -> Json<Comment> {
    let mut state = state.lock().unwrap();
    let (_, ref mut truths) = *state;
    
    let truth = truths.iter_mut().find(|t| t.id == request.truth_id).expect("Truth not found");
    
    let new_comment = Comment {
        id: truth.comments.len() as u32 + 1,
        user_id: request.user_id,
        content: request.content.clone(),
    };
    
    truth.comments.push(new_comment.clone());
    Json(new_comment)
}

#[get("/user/<user_id>")]
fn get_user(user_id: u32, state: &State<AppState>) -> Json<User> {
    let (users, _) = state.lock().unwrap().clone();
    let user = users.iter().find(|u| u.id == user_id).expect("User not found");
    Json(user.clone())
}

#[launch]
fn rocket<T: std::marker::Send + 'static>() -> Rocket<Build> {
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

    let initial_state = Mutex::new((
        vec![
            User { id: 1, username: String::from("alice"), bio: String::from("Truth seeker") },
            User { id: 2, username: String::from("bob"), bio: String::from("Love spreading truth") },
        ],
        Vec::<T>::new(),
    ));

    rocket::build()
        .manage(initial_state)
        .mount("/", routes![hello, get_truths, create_truth, like_truth, create_comment, get_user])
        .attach(cors)
}