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

### Authentication
```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login & get JWT
POST /api/auth/refresh      # Refresh token
```

### Songs
```
GET    /api/song            # Get all songs
GET    /api/song/:id        # Get song by ID
POST   /api/song            # Create song (Admin)
PUT    /api/song/:id        # Update song (Admin)
DELETE /api/song/:id        # Delete song (Admin)
```

### Search
```
GET /api/search?q=query     # Search all
GET /api/search/songs       # Search songs
GET /api/search/artists     # Search artists
GET /api/search/albums      # Search albums
GET /api/search/playlists   # Search playlists
```

### Playlists
```
GET    /api/playlist             # Get user playlists
GET    /api/playlist/:id         # Get playlist details
POST   /api/playlist             # Create playlist
PUT    /api/playlist/:id         # Update playlist
DELETE /api/playlist/:id         # Delete playlist
POST   /api/playlist/:id/songs   # Add songs
DELETE /api/playlist/:id/songs   # Remove songs
```

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

