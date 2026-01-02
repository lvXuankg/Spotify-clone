# Elasticsearch Data Migration Guide

## Overview

Hệ thống đã cung cấp REST API endpoints để đồng hóa dữ liệu từ PostgreSQL database sang Elasticsearch. Tất cả endpoints đều trên search-service tại `/search/migration`.

## Prerequisites

1. ✅ Search service đang chạy (port 3001)
2. ✅ Elasticsearch đang chạy (port 9200)
3. ✅ RabbitMQ đang chạy (port 5672)
4. ✅ PostgreSQL database đã được populate với dữ liệu

## Migration Endpoints

### 1. **Migrate Songs**
```bash
POST /search/migration/songs
Content-Type: application/json

{
  "batchSize": 100
}
```

**Response:**
```json
{
  "total": 150,
  "indexed": 150
}
```

### 2. **Migrate Artists**
```bash
POST /search/migration/artists
Content-Type: application/json

{
  "batchSize": 100
}
```

### 3. **Migrate Albums**
```bash
POST /search/migration/albums
Content-Type: application/json

{
  "batchSize": 100
}
```

### 4. **Migrate Playlists**
```bash
POST /search/migration/playlists
Content-Type: application/json

{
  "batchSize": 100
}
```

### 5. **Migrate All Data** (Recommended)
```bash
POST /search/migration/all
Content-Type: application/json

{
  "batchSize": 100
}
```

**Response:**
```json
{
  "songs": {
    "total": 150,
    "indexed": 150
  },
  "artists": {
    "total": 45,
    "indexed": 45
  },
  "albums": {
    "total": 60,
    "indexed": 60
  },
  "playlists": {
    "total": 80,
    "indexed": 80
  },
  "startTime": "2026-01-02T10:30:00.000Z",
  "endTime": "2026-01-02T10:32:15.500Z"
}
```

### 6. **Clear All Indices** ⚠️ (CAUTION!)
```bash
POST /search/migration/clear
```

**Response:**
```json
{
  "message": "All indices cleared"
}
```

### 7. **Re-initialize and Migrate** (Clear + Migrate)
```bash
POST /search/migration/reinitialize
Content-Type: application/json

{
  "batchSize": 100
}
```

This endpoint:
1. Clears all existing indices
2. Initializes fresh indices with proper mappings
3. Migrates all data from database

## Usage Examples

### Using cURL

**Migrate All Data:**
```bash
curl -X POST http://localhost:3001/search/migration/all \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 100}'
```

**Re-initialize and Migrate:**
```bash
curl -X POST http://localhost:3001/search/migration/reinitialize \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 100}'
```

**Migrate Songs Only:**
```bash
curl -X POST http://localhost:3001/search/migration/songs \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 50}'
```

### Using Postman

1. Create new POST request
2. URL: `http://localhost:3001/search/migration/all`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "batchSize": 100
}
```

### Using JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:3001/search/migration/all', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ batchSize: 100 })
});

const result = await response.json();
console.log(result);
```

### Using Python

```python
import requests

response = requests.post(
  'http://localhost:3001/search/migration/all',
  json={'batchSize': 100}
)

print(response.json())
```

## Batch Size Recommendation

**Batch Size** controls how many documents are fetched from database at once:

- **50-100**: Safe for small/medium datasets, slower but more memory efficient
- **100-200**: Good balance for most cases
- **200+**: For large datasets with good server resources

```bash
# Fast migration with larger batches
curl -X POST http://localhost:3001/search/migration/all \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 200}'
```

## Production-Grade Migration Strategy

### Step 1: Clear Old Indices (Optional)
```bash
curl -X POST http://localhost:3001/search/migration/clear \
  -H "Content-Type: application/json"
```

### Step 2: Reinitialize with Fresh Data
```bash
curl -X POST http://localhost:3001/search/migration/reinitialize \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 150}'
```

### Step 3: Verify Migration
```bash
# Check indexed documents
curl -X GET "http://localhost:9200/songs/_count"
curl -X GET "http://localhost:9200/artists/_count"
curl -X GET "http://localhost:9200/albums/_count"
curl -X GET "http://localhost:9200/playlists/_count"
```

### Step 4: Test Search
```bash
# Search for a song
curl -X GET "http://localhost:3001/search?q=song_name"

# Search for artists
curl -X GET "http://localhost:3001/search/artists?q=artist_name"
```

## Monitoring Migration Progress

Watch the service logs for progress updates:

```
[SearchMigrationService] Starting songs migration...
[SearchMigrationService] Migrated 100/1500 songs
[SearchMigrationService] Migrated 200/1500 songs
...
[SearchMigrationService] ✅ Songs migration completed: 1500/1500 indexed
```

## Elasticsearch Verification

### Check Index Count
```bash
# Count documents in each index
curl -X GET "http://localhost:9200/songs/_count"
curl -X GET "http://localhost:9200/artists/_count"
curl -X GET "http://localhost:9200/albums/_count"
curl -X GET "http://localhost:9200/playlists/_count"
```

### View Sample Documents
```bash
# Get first 10 songs
curl -X GET "http://localhost:9200/songs/_search?size=10"

# Search for specific song
curl -X GET "http://localhost:9200/songs/_search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "multi_match": {
        "query": "song_title",
        "fields": ["title", "artist"]
      }
    }
  }'
```

### Monitor Elasticsearch Health
```bash
# Cluster health
curl -X GET "http://localhost:9200/_cluster/health"

# Index stats
curl -X GET "http://localhost:9200/_stats"
```

## Troubleshooting

### Migration Fails with "Connection Refused"
- Check if Elasticsearch is running: `docker ps | grep elasticsearch`
- Verify database connection in `.env`
- Check RabbitMQ logs if using event-based indexing

### Some Documents Not Indexed
- Check logs for "Error indexing" messages
- Common causes:
  - Missing required fields (e.g., artist for a song)
  - Invalid data types
  - Elasticsearch version compatibility

**Solution:**
```bash
# Retry migration with smaller batch size
curl -X POST http://localhost:3001/search/migration/all \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 50}'
```

### Elasticsearch Index Out of Space
- Check disk space: `curl -X GET "http://localhost:9200/_cat/nodes?v"`
- Clear old indices if not needed
- Increase Elasticsearch storage

## Performance Optimization

### For Large Datasets (1M+ documents)

1. **Increase Batch Size:**
```bash
curl -X POST http://localhost:3001/search/migration/all \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 500}'
```

2. **Temporary Index Settings:**
```bash
# Disable refresh during migration
curl -X PUT "http://localhost:9200/songs/_settings" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "index.refresh_interval": "-1"
    }
  }'

# After migration, re-enable refresh
curl -X PUT "http://localhost:9200/songs/_settings" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "index.refresh_interval": "1s"
    }
  }'
```

## Automated Migration Script

Create a `migrate.sh` file:

```bash
#!/bin/bash

echo "Starting Elasticsearch Migration..."
echo "=================================="

# Set variables
MIGRATION_URL="http://localhost:3001/search/migration"
BATCH_SIZE=150

echo "1. Reinitializing indices..."
curl -X POST "$MIGRATION_URL/reinitialize" \
  -H "Content-Type: application/json" \
  -d "{\"batchSize\": $BATCH_SIZE}"

echo "\n2. Waiting for migration to complete..."
sleep 5

echo "\n3. Verifying migration..."
echo "Songs: $(curl -s -X GET "http://localhost:9200/songs/_count" | grep -o '"count":[0-9]*')"
echo "Artists: $(curl -s -X GET "http://localhost:9200/artists/_count" | grep -o '"count":[0-9]*')"
echo "Albums: $(curl -s -X GET "http://localhost:9200/albums/_count" | grep -o '"count":[0-9]*')"
echo "Playlists: $(curl -s -X GET "http://localhost:9200/playlists/_count" | grep -o '"count":[0-9]*')"

echo "\n✅ Migration completed!"
```

Run it:
```bash
chmod +x migrate.sh
./migrate.sh
```

## Next Steps After Migration

1. **Test search functionality** in frontend
2. **Monitor performance** - check Elasticsearch query performance
3. **Set up index refresh schedule** for incremental updates
4. **Configure backups** for indices
5. **Add monitoring alerts** for index health

## Support & Monitoring

- **Search Service Logs**: Check for errors during migration
- **Elasticsearch Logs**: Monitor at `/var/log/elasticsearch/elasticsearch.log`
- **RabbitMQ Dashboard**: http://localhost:15672 (admin:admin)
- **Kibana**: http://localhost:5601 - Visual query and index management
