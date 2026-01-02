# 🚀 Hướng Dẫn Thử Nghiệm Elasticsearch Search

## Bước 1: Khởi động Elasticsearch

```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  docker.elastic.co/elasticsearch/elasticsearch:8.12.2
```

Kiểm tra Elasticsearch đã sẵn sàng:
```bash
curl http://localhost:9200/_cluster/health
```

## Bước 2: Khởi động RabbitMQ

```bash
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3.13-management
```

Truy cập RabbitMQ Management: http://localhost:15672 (guest/guest)

## Bước 3: Khởi động các Services

### Terminal 1: Search Service
```bash
cd search-service
pnpm start:dev
# Chờ cho đến khi thấy: "Search service running on port 3001"
```

### Terminal 2: Song Service
```bash
cd song-service
pnpm start:dev
# Chờ cho đến khi thấy: "Song service running on port 3003"
```

### Terminal 3: API Gateway
```bash
cd api_gateway
pnpm start:dev
# Chờ cho đến khi thấy: "API Gateway running on port 3000"
```

## Bước 4: Test Search API

### 4.1 Tạo một Album (bắt buộc trước)

```bash
curl -X POST http://localhost:3000/albums \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Midnights",
    "release_date": "2022-10-21",
    "artists": ["artist-id-here"],
    "cover_url": "https://example.com/cover.jpg"
  }'
```

Lưu `album-id` từ response

### 4.2 Tạo một Song

```bash
curl -X POST http://localhost:3000/songs/{album-id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Anti-Hero",
    "durationSeconds": 228,
    "audioUrl": "https://example.com/song.mp3",
    "trackNumber": 1,
    "bitrate": 320
  }'
```

**⏳ Đợi 1-2 giây để Elasticsearch indexing**

### 4.3 Test Search - Tất cả

```bash
curl "http://localhost:3000/search?q=anti-hero"
```

**Response:**
```json
{
  "total": 1,
  "results": [
    {
      "type": "song",
      "id": "song-id",
      "title": "Anti-Hero",
      "artist": "Artist Name",
      "album": "Midnights",
      "duration": 228,
      "score": 2.5
    }
  ]
}
```

### 4.4 Test Search - Chỉ Songs

```bash
curl "http://localhost:3000/search/songs?q=anti"
```

**Response:**
```json
{
  "total": 1,
  "items": [
    {
      "id": "song-id",
      "title": "Anti-Hero",
      "artist": "Taylor Swift",
      "album": "Midnights",
      "duration": 228,
      "score": 2.5
    }
  ]
}
```

### 4.5 Test Search - Fuzzy Matching (Typo)

```bash
curl "http://localhost:3000/search/songs?q=antihero"  # Không có dấu gạch
# Hoặc
curl "http://localhost:3000/search/songs?q=anti-hro"   # Thiếu ký tự
# Hoặc
curl "http://localhost:3000/search/songs?q=anti-heroo" # Thừa ký tự
```

Tất cả đều sẽ tìm thấy "Anti-Hero" vì fuzzy matching!

### 4.6 Test Search - Pagination

```bash
curl "http://localhost:3000/search/songs?q=taylor&from=0&size=10"
```

- `from=0`: Bắt đầu từ kết quả thứ 1
- `size=10`: Trả về 10 kết quả trên trang

## Bước 5: Test Indexing - Kiểm Tra Dữ Liệu

### Xem tất cả Songs trong Elasticsearch

```bash
curl http://localhost:9200/songs/_search?pretty
```

### Xem số lượng Songs

```bash
curl http://localhost:9200/songs/_count
```

### Xem Mappings (Schema)

```bash
curl http://localhost:9200/songs/_mapping?pretty
```

## Bước 6: Monitoring

### RabbitMQ Management UI
```
http://localhost:15672
Username: guest
Password: guest
```

Tìm tab "Queues" để xem message queue

### Elasticsearch Health
```bash
curl http://localhost:9200/_cluster/health
```

**Tất cả services running:**
- API Gateway: http://localhost:3000
- Search Service: http://localhost:3001
- Song Service: http://localhost:3003
- Elasticsearch: http://localhost:9200
- RabbitMQ: http://localhost:15672

## Troubleshooting

### Elasticsearch Connection Refused
```bash
# Check if Elasticsearch is running
docker ps | grep elasticsearch

# Restart if needed
docker restart elasticsearch
```

### RabbitMQ Connection Refused
```bash
# Check if RabbitMQ is running
docker ps | grep rabbitmq

# Restart if needed
docker restart rabbitmq
```

### No Search Results
1. Kiểm tra logs của search-service: `Search error: ...`
2. Đảm bảo song đã được tạo
3. Đợi 1-2 giây để indexing
4. Kiểm tra: `curl http://localhost:9200/songs/_count`

### "Index not found" Error
- Elasticsearch indices tạo tự động khi search service khởi động
- Hoặc khi dữ liệu được indexing lần đầu

## API Endpoints Tóm Tắt

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| GET | `/search?q=query` | Search tất cả |
| GET | `/search/songs?q=query` | Search songs |
| GET | `/search/artists?q=query` | Search artists |
| GET | `/search/albums?q=query` | Search albums |
| GET | `/search/playlists?q=query` | Search playlists |

Tất cả hỗ trợ:
- `from`: pagination offset (default: 0)
- `size`: results per page (default: 20)

## Next Steps

✅ **Hoàn thành:**
- [x] Elasticsearch indexing songs
- [x] API Gateway search endpoints
- [x] RabbitMQ message integration
- [x] Fuzzy matching support

⏳ **TODO:**
- [ ] Integrate Artists search
- [ ] Integrate Albums search
- [ ] Integrate Playlists search
- [ ] Add search to Frontend
- [ ] Setup autocomplete suggestions
