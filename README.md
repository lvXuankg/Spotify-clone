# 🎵 Spotify Clone - Microservices Architecture

A full-featured Spotify clone built with **NestJS microservices**, **Next.js frontend**, and modern cloud technologies.

![Architecture](./assets/architecture.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Services](#-services)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)

## ✨ Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role management
- 🎵 **Music Streaming** - Stream songs with range request support
- 🔍 **Full-text Search** - Elasticsearch-powered search across songs, artists, albums, playlists
- 📝 **Playlist Management** - Create, edit, and share playlists
- ❤️ **Library** - Like songs, follow artists, save albums
- 👤 **User Profiles** - Profile management and preferences
- 🎨 **Modern UI** - Responsive Next.js frontend with Tailwind CSS
- 📊 **Admin Panel** - Full CRUD management for users, songs, playlists
- ⚡ **Redis Caching** - Production-grade caching for optimal performance
- 📨 **Message Queue** - RabbitMQ for async microservice communication

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| NestJS | Microservices framework |
| PostgreSQL | Primary database (Supabase) |
| Prisma | ORM |
| RabbitMQ | Message broker |
| Redis | Caching layer |
| Elasticsearch | Full-text search |
| Cloudinary | Media file storage |
| JWT | Authentication |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | State management |
| React Query | Data fetching |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Local orchestration |

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Next.js)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (NestJS)                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │  Auth   │ │  Redis  │ │ Rate    │ │ Logging │ │ Routing │  │
│  │  Guard  │ │ Cache   │ │ Limit   │ │         │ │         │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
            ┌───────────────┐       ┌───────────────┐
            │   RabbitMQ    │       │     Redis     │
            │ Message Queue │       │    Caching    │
            └───────────────┘       └───────────────┘
                    │
        ┌───────────┼───────────┬───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│    Auth     │    User     │   Artist    │    Song     │   Album     │
│   Service   │   Service   │   Service   │   Service   │   Service   │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
        │           │           │           │           │
        └───────────┴───────────┴───────────┴───────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
            ┌───────────────┐       ┌───────────────┐
            │  PostgreSQL   │       │ Elasticsearch │
            │   (Supabase)  │       │  Full-text    │
            └───────────────┘       └───────────────┘
```

## 📦 Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 8.x
- **Docker** & **Docker Compose**
- **Supabase** account (for PostgreSQL)
- **Cloudinary** account (for file storage)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/lvXuankg/Spotify-clone.git
cd Spotify-clone
```

### 2. Start infrastructure services

```bash
# Start RabbitMQ, Redis, Elasticsearch
docker-compose up -d

# Include Kibana for development (optional)
docker-compose --profile dev up -d
```

### 3. Configure environment variables

Copy `.env.example` to `.env` in each service and update values:

```bash
# For each service directory
cp .env.example .env
```

### 4. Install dependencies

```bash
# Root
pnpm install

# Install all services
cd api_gateway && pnpm install && cd ..
cd auth-service && pnpm install && cd ..
cd user-service && pnpm install && cd ..
cd file-service && pnpm install && cd ..
cd artist-service && pnpm install && cd ..
cd album-service && pnpm install && cd ..
cd song-service && pnpm install && cd ..
cd playlist-service && pnpm install && cd ..
cd library-service && pnpm install && cd ..
cd stream-service && pnpm install && cd ..
cd search-service && pnpm install && cd ..
cd frontend-spotify && pnpm install && cd ..
```

### 5. Run database migrations

```bash
# For each service with Prisma
cd auth-service && npx prisma migrate deploy && cd ..
cd user-service && npx prisma migrate deploy && cd ..
# ... repeat for other services
```

### 6. Start the services

```bash
# Terminal 1 - API Gateway
cd api_gateway && pnpm run start:dev

# Terminal 2 - Auth Service
cd auth-service && pnpm run start:dev

# Terminal 3-10 - Other microservices
cd user-service && pnpm run start:dev
cd file-service && pnpm run start:dev
cd artist-service && pnpm run start:dev
cd album-service && pnpm run start:dev
cd song-service && pnpm run start:dev
cd playlist-service && pnpm run start:dev
cd library-service && pnpm run start:dev
cd stream-service && pnpm run start:dev
cd search-service && pnpm run start:dev

# Terminal 11 - Frontend
cd frontend-spotify && pnpm run dev
```

### 7. Migrate data to Elasticsearch

```powershell
# Windows PowerShell
.\migrate-elasticsearch.ps1
```

### 8. Access the application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Gateway | http://localhost:8080/api |
| RabbitMQ Management | http://localhost:15672 |
| Kibana | http://localhost:5601 |
| Elasticsearch | http://localhost:9200 |

## 📁 Project Structure

```
Spotify-clone/
├── api_gateway/          # API Gateway - Request routing & auth
├── auth-service/         # Authentication & JWT management
├── user-service/         # User profile management
├── file-service/         # File upload (Cloudinary)
├── artist-service/       # Artist CRUD operations
├── album-service/        # Album management
├── song-service/         # Song metadata & CRUD
├── playlist-service/     # Playlist management
├── library-service/      # User library (likes, saves)
├── stream-service/       # Music streaming
├── search-service/       # Elasticsearch integration
├── frontend-spotify/     # Next.js frontend
├── assets/              # Static assets
├── docker-compose.yml   # Docker infrastructure
└── *.json               # Elasticsearch mappings
```

## 🔧 Services

### API Gateway (Port 8080)
Central entry point handling:
- Request routing to microservices
- JWT authentication
- Redis caching
- Rate limiting
- Logging

### Auth Service (Port 3001)
- User registration/login
- JWT token generation
- Password management
- Role-based access control

### User Service (Port 3002)
- Profile management
- User preferences
- Admin user management

### File Service (Port 3004)
- File upload to Cloudinary
- Image/audio processing
- Media URL generation

### Artist Service
- Artist CRUD
- Artist following
- Top tracks

### Album Service
- Album CRUD
- Album-artist relationships

### Song Service
- Song metadata CRUD
- Album/artist associations

### Playlist Service
- Playlist CRUD
- Song ordering
- Public/private playlists

### Library Service
- Liked songs
- Saved albums
- Following lists
- Listening history

### Stream Service
- Audio streaming
- Play count tracking
- Range request support

### Search Service
- Elasticsearch integration
- Full-text search
- Search suggestions
- Multi-index search (songs, artists, albums, playlists)

## 📖 API Documentation

All API endpoints are available through the **API Gateway** at `http://localhost:8080/api`. The API uses JWT authentication via Bearer tokens in the Authorization header. Interactive Swagger documentation is available at `http://localhost:8080/docs` during development.

### 🔐 Authentication APIs

The authentication system handles user registration, login, and token management. Users can register with email and password, and upon successful login, receive access tokens (valid for 15 minutes) and refresh tokens (valid for 30 days). These tokens are also stored in httpOnly secure cookies to prevent XSS attacks. The system supports logout from all devices and automatic token refresh without requiring re-authentication. All authentication endpoints return user data along with token information.

**Related endpoints:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/logoutAllDevices`, `POST /api/auth/refreshToken`

### 👤 User Management APIs

User management provides profile access and administrative controls. Authenticated users can retrieve and update their own profile information including username and avatar. Admin users have additional capabilities to view all users with pagination and search, modify user roles (upgrading to memberVip or admin status), and remove users from the system. All profile updates are immediately reflected and admin actions are logged for auditing purposes.

**Related endpoints:** `GET /api/user/profile`, `PATCH /api/user/profile`, `GET /api/user/all` (admin), `PATCH /api/user/:userId/role` (admin), `DELETE /api/user/:userId` (admin)

### 🎤 Artist Management APIs

Artist management allows browsing and administration of artist profiles. All authenticated users can retrieve the complete list of artists with pagination support and view detailed information about specific artists including their biography and associated albums. Admin users can create new artist profiles, update existing artist information, and remove artists from the system. Artist data includes metadata, imagery, and relationships to albums and songs.

**Related endpoints:** `GET /api/artist`, `GET /api/artist/:id`, `POST /api/artist` (admin), `PATCH /api/artist/:id` (admin), `DELETE /api/artist/:id` (admin)

### 💿 Album Management APIs

Album management encompasses the organization of songs into albums with artist associations. Users can browse albums with various sorting options, view detailed album information including track listings and release dates, and discover albums by specific artists. Admin users can create albums for artists, update album metadata and cover artwork, and delete albums when needed. The system supports filtering and pagination for efficient content discovery.

**Related endpoints:** `GET /api/album`, `GET /api/album/:albumId`, `GET /api/album/list/:artistId`, `POST /api/album/:artistId` (admin), `PATCH /api/album/:albumId` (admin), `DELETE /api/album/:albumId` (admin)

### 🎵 Song Management APIs

Song management provides core music content operations including metadata storage and retrieval. Users can access all songs with pagination, retrieve individual song details, and discover songs within albums. The system supports both direct searches and album-based browsing for organized content discovery. Admin users can upload new songs, update metadata like title and duration, and remove songs from the catalog. Each song maintains relationships with albums and artists.

**Related endpoints:** `GET /api/song/all`, `GET /api/song/:id`, `GET /api/song/album/:albumId`, `GET /api/song/search`, `POST /api/song/:albumId` (admin), `PATCH /api/song/:id` (admin), `DELETE /api/song/:id` (admin)

### 📋 Playlist Management APIs

Playlist management enables users to create personalized collections of songs with full control over visibility and content. Users can create new playlists, manage their existing playlists, view public playlists from other users, and add or remove songs from their collections. The system supports both private playlists for personal use and public playlists for community sharing. Each playlist maintains user ownership, creation timestamps, and can contain multiple songs in a specific order.

**Related endpoints:** `POST /api/playlist`, `PATCH /api/playlist/:id`, `DELETE /api/playlist/:id`, `POST /api/playlist/:playlistId/song/:songId`, `DELETE /api/playlist/:playlistId/song/:songId`, `GET /api/playlist/get-my-playlists`, `GET /api/playlist/public`, `GET /api/playlist/:id`

### 🎧 Streaming & Playback Analytics APIs

Streaming APIs track user listening activity and provide personalized analytics. Users can record play events to build listening history, retrieve their play history with date filtering, and view recently played songs. The system generates personalized top songs lists based on listening patterns over various time periods (last week, month, quarter, year, or all-time) and streaming statistics including total plays, unique songs discovered, and total duration listened. Global charts show the most-streamed songs across all users, helping surface popular content. Users can clear their history at any time.

**Related endpoints:** `POST /api/stream/play`, `GET /api/stream/history`, `GET /api/stream/recently-played`, `GET /api/stream/top-songs`, `GET /api/stream/stats`, `GET /api/stream/song/:songId/play-count`, `GET /api/stream/charts`, `DELETE /api/stream/history`

### 🔍 Search APIs

Search functionality leverages Elasticsearch for comprehensive full-text search across the music catalog. Users can perform global searches that return results from songs, artists, albums, and playlists simultaneously, or narrow searches to specific content types. Search supports pagination and result limiting for efficient data retrieval. The system returns ranked results based on relevance, helping users quickly find the content they're looking for from the vast music library.

**Related endpoints:** `GET /api/search`, `GET /api/search/songs`, `GET /api/search/artists`, `GET /api/search/albums`, `GET /api/search/playlists`

### 📁 File Management APIs

File management handles media uploads and metadata storage using Cloudinary for cloud-based storage. Users first request a presigned URL to upload files directly to Cloudinary, then save file metadata to the database after successful upload. This two-step process ensures efficient file storage with proper tracking. The system supports various media types and file sizes, with metadata including file names, MIME types, sizes, and entity relationships. Admin users can delete files when they're no longer needed.

**Related endpoints:** `POST /api/file/presignedUrl`, `POST /api/file/saveMetadata`, `DELETE /api/file` (admin for all files, users for own files)

### Error Responses

All endpoints return standardized error format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest"
}
```

Common HTTP status codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **500**: Internal Server Error

## ⚙️ Environment Variables

Each service has a `.env.example` file. Key variables:

### API Gateway
```env
PORT=8080
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
*_RABBITMQ_URL=amqp://admin:1234@localhost:5672
```

### Microservices
```env
DATABASE_URL=postgresql://...  # Supabase connection
DIRECT_URL=postgresql://...    # Direct connection for migrations
RABBITMQ_URL=amqp://admin:1234@localhost:5672
HEALTH_CHECK_PORT=300x
```

### Search Service
```env
ELASTICSEARCH_NODE=http://localhost:9200
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🐳 Docker Commands

```bash
# Start all infrastructure
docker-compose up -d

# Start with Kibana (dev profile)
docker-compose --profile dev up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f elasticsearch
docker-compose logs -f rabbitmq
docker-compose logs -f redis
```

## 📊 Health Checks

```bash
# Elasticsearch
curl http://localhost:9200/_cluster/health

# RabbitMQ
curl -u admin:1234 http://localhost:15672/api/healthchecks/node

# Redis
redis-cli ping
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ by [lvXuankg](https://github.com/lvXuankg)**

