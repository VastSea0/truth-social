# Truth Social

Truth Social, Rust ve React kullanılarak geliştirilmiş bir sosyal medya platformudur. Kullanıcılar, gerçekleri paylaşabilir, beğenebilir ve yorum yapabilirler. Bu proje, Rust backend ve React frontend ile tam bir sosyal medya deneyimi sunar.

![Screen Shot 2024-09-23 at 00 01 27](https://github.com/user-attachments/assets/49d8745e-16fd-4013-aa86-febdb647f8af)


## İçindekiler

- [Özellikler](#özellikler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [API Endpoints](#api-endpoints)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

## Özellikler

- Kullanıcılar gerçekleri paylaşabilir.
- Gerçeklere beğeni ekleyebilir.
- Gerçeklere yorum yapabilir.
- Kullanıcı profilleri görüntülenebilir.

## Kurulum

### Gereksinimler

- Rust
- Cargo
- Node.js
- npm veya yarn

### Backend Kurulumu

1. Bu projeyi klonlayın:
    ```sh
    git clone https://github.com/vastsea0/truth-social.git
    cd truth-social/backend
    ```

2. Gerekli bağımlılıkları yükleyin:
    ```sh
    cargo build
    ```

3. Backend sunucusunu başlatın:
    ```sh
    cargo run
    ```

### Frontend Kurulumu

1. Frontend dizinine gidin:
    ```sh
    cd ../frontend
    ```

2. Gerekli bağımlılıkları yükleyin:
    ```sh
    npm install
    ```

3. Frontend uygulamasını başlatın:
    ```sh
    npm start
    ```

## Kullanım

1. Backend sunucusu `http://localhost:8000` adresinde çalışacaktır.
2. Frontend uygulaması `http://localhost:3000` adresinde çalışacaktır.
3. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı kullanabilirsiniz.

## API Endpoints

### GET /

- Açıklama: Hoş geldiniz mesajı döner.
- URL: `http://localhost:8000/`
- Metot: `GET`
- Yanıt:
    ```json
    {
        "message": "Welcome to Truth Social!"
    }
    ```

### GET /truths

- Açıklama: Tüm gerçekleri döner.
- URL: `http://localhost:8000/truths`
- Metot: `GET`
- Yanıt:
    ```json
    [
        {
            "id": 1,
            "user_id": 1,
            "content": "This is a truth.",
            "likes": 0,
            "category": "general",
            "comments": []
        }
    ]
    ```

### POST /truth

- Açıklama: Yeni bir gerçek oluşturur.
- URL: `http://localhost:8000/truth`
- Metot: `POST`
- Gövde:
    ```json
    {
        "user_id": 1,
        "content": "This is a new truth.",
        "category": "general"
    }
    ```
- Yanıt:
    ```json
    {
        "id": 2,
        "user_id": 1,
        "content": "This is a new truth.",
        "likes": 0,
        "category": "general",
        "comments": []
    }
    ```

### POST /like/:truth_id

- Açıklama: Bir gerçeğe beğeni ekler.
- URL: `http://localhost:8000/like/:truth_id`
- Metot: `POST`
- Yanıt:
    ```json
    {
        "id": 1,
        "user_id": 1,
        "content": "This is a truth.",
        "likes": 1,
        "category": "general",
        "comments": []
    }
    ```

### POST /comment

- Açıklama: Bir gerçeğe yorum ekler.
- URL: `http://localhost:8000/comment`
- Metot: `POST`
- Gövde:
    ```json
    {
        "user_id": 1,
        "truth_id": 1,
        "content": "This is a comment."
    }
    ```
- Yanıt:
    ```json
    {
        "id": 1,
        "user_id": 1,
        "content": "This is a comment."
    }
    ```

### GET /user/:user_id

- Açıklama: Bir kullanıcının profilini döner.
- URL: `http://localhost:8000/user/:user_id`
- Metot: `GET`
- Yanıt:
    ```json
    {
        "id": 1,
        "username": "alice",
        "bio": "Truth seeker"
    }
    ```

## Katkıda Bulunma

Katkıda bulunmak isterseniz, lütfen bir pull request gönderin veya bir issue açın. Her türlü katkı memnuniyetle karşılanır!

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.
