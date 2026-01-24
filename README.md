# Islamic App Backend

A robust NestJS-based backend for the Islamic App project, featuring MongoDB integration via Typegoose, centralized configuration, and modern performance/security best practices.

## 🚀 Features

- **Framework**: [NestJS](https://nestjs.com/) (v11+)
- **Database**: MongoDB with [Typegoose](https://typegoose.github.io/typegoose/) for safe, class-based modeling.
- **Authentication**:
  - **Google OAuth2**: Integrated social login.
  - **Dual Token System**: Short-lived Access Tokens (1 day) and Long-lived Refresh Tokens (30 days).
  - **Redis Persistence**: Refresh tokens stored in Redis with automatic TTL expiration.
- **Security**:
  - Rate Limiting via `@nestjs/throttler`.
  - CORS with dynamic whitelisting.
  - Custom `UserGuard` for stateless JWT verification.
- **Infrastructure**:
  - **Dockerized**: Full containerization with `Dockerfile` and `docker-compose.yml`.
  - **Versioning**: URI-based API versioning (starting with `/v1`).
  - **Global Prefix**: All API endpoints prefixed with `/api`.
- **Documentation**: Interactive API documentation via [Swagger](https://swagger.io/).

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v22 recommended)
- [Docker](https://www.docker.com/) & Docker Compose
- [Google Cloud Console Account](https://console.cloud.google.com/) (for OAuth Client credentials)

## ⚙️ Configuration

The application uses an environment-based configuration system. Create a `.env` file in the root directory based on the following keys:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment (development, production) | `development` |
| `PORT` | Server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://mongodb:27017/islamic_app` |
| `REDIS_HOST` | Redis server hostname | `redis` |
| `REDIS_PORT` | Redis server port | `6379` |
| `REDIS_PASSWORD`| Redis authentication password | `password` |
| `JWT_SECRET` | Secret key for signing tokens | `super-secret-key` |
| `JWT_EXPIRES_IN` | Access token lifespan | `1d` |
| `JWT_REFRESH_EXPIRES_IN`| Refresh token lifespan | `30d` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Required |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Required |
| `GOOGLE_CALLBACK_URL` | Redirect URI for Google Auth | `http://localhost:3000/api/v1/auth/google/callback` |

## 🏗️ Getting Started

### 🐳 Running with Docker (Recommended)

1.  **Configure environment**: Ensure your `.env` is set up (use `mongodb` and `redis` as hosts).
2.  **Launch services**:
    ```bash
    docker-compose up --build
    ```
The app will be available at `http://localhost:3000`.

### 💻 Running Locally

1.  **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```
2.  **Start application**:
    ```bash
    # development mode
    npm run start:dev
    ```

## 🛣️ API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/docs` | `GET` | **Swagger Documentation** |
| `/api/v1/auth/google` | `GET` | Initiate Google Login |
| `/api/v1/auth/refresh` | `POST` | Refresh Access Token (Header: `x-refresh-token`) |
| `/api/v1/users/me` | `GET` | Get current authenticated user profile |
| `/api/v1/health` | `GET` | Service Health Check |

## 🛡️ License

UNLICENSED
