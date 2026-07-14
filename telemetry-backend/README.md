# 🏍️ Two-Wheeler Telemetry & Spatial Wear Predictor

A spatial data engineering backend that simulates motorcycle telemetry collection — generating GPS trip routes, storing them in a PostGIS-enabled PostgreSQL database, and serving them through an async FastAPI REST API.

Built as a learning project to explore **spatial data pipelines** from data generation to API consumption.

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Mock Data Generator│     │   FastAPI (Async)     │     │   PostgreSQL    │
│                     │     │                       │     │   + PostGIS     │
│  • GPS LineStrings  │────▶│  POST /api/v1/trips   │────▶│                 │
│  • Telemetry CSV    │     │  GET  /api/v1/trips   │◀────│  • riders       │
│                     │     │  GET  /trips/:id/tele │     │  • trips        │
│  (GeoPandas +       │     │                       │     │  • telemetry    │
│   Shapely)          │     │  (Pydantic +          │     │    _logs        │
│                     │     │   GeoAlchemy2)        │     │                 │
└─────────────────────┘     └──────────────────────┘     └─────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Data Generation | GeoPandas, Shapely, NumPy | Generate mock GPS routes & sensor readings |
| Database | PostgreSQL 15 + PostGIS 3.4 | Spatial data storage with geometry indexing |
| ORM | SQLAlchemy 2.0 + GeoAlchemy2 | Python models mapped to spatial DB columns |
| API | FastAPI (async) + Uvicorn | Non-blocking REST endpoints |
| Validation | Pydantic | Request/response schema validation |

## Prerequisites

- Python 3.10+
- Docker (for PostgreSQL + PostGIS)
- Git

## Quick Start

### 1. Clone & set up virtual environment

```bash
git clone https://github.com/<your-username>/telemetry-backend.git
cd telemetry-backend

python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Start PostGIS database

```bash
docker run -d \
  --name postgis \
  -e POSTGRES_USER=geo_user \
  -e POSTGRES_PASSWORD=geo_pass \
  -e POSTGRES_DB=spatial_db \
  -p 5432:5432 \
  postgis/postgis:15-3.4
```

### 3. Initialize the database

```bash
python init_db.py
```

This enables the PostGIS extension and creates the `riders`, `trips`, and `telemetry_logs` tables.

### 4. Generate mock data

```bash
python generate_mock_trips.py
```

Outputs:
- `mock_trips.geojson` — 20 GPS trip routes as GeoJSON LineStrings
- `mock_telemetry.csv` — Per-waypoint sensor readings (voltage, RPM, etc.)

> 💡 You can visualize `mock_trips.geojson` at [geojson.io](https://geojson.io) to see the routes on a map.

### 5. Start the API server

```bash
uvicorn main:app --reload
```

API docs available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 6. Ingest mock data into the database

In a separate terminal (with venv activated):

```bash
python ingest_mock_data.py
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/trips` | Create a new trip with route geometry and telemetry readings |
| `GET` | `/api/v1/trips` | List all trips |
| `GET` | `/api/v1/trips/{trip_id}/telemetry` | Get telemetry logs for a specific trip |

### Example: Create a trip

```json
POST /api/v1/trips
{
  "rider_id": "rider-001",
  "route_coordinates": [[120.97, 14.59], [120.98, 14.60], [120.99, 14.61]],
  "start_time": "2026-07-01T08:00:00",
  "end_time": "2026-07-01T08:30:00",
  "distance_km": 3.5,
  "telemetry": [
    {
      "lat": 14.59, "lon": 120.97,
      "timestamp": "2026-07-01T08:00:00",
      "voltage": 12.6, "rpm": 3500
    }
  ]
}
```

## Project Structure

```
telemetry-backend/
├── generate_mock_trips.py   # Mock GPS & telemetry data generator
├── models.py                # SQLAlchemy + GeoAlchemy2 ORM models
├── database.py              # Async database engine & session config
├── init_db.py               # Database initialization script
├── schemas.py               # Pydantic request/response models
├── main.py                  # FastAPI application & endpoints
├── ingest_mock_data.py      # Script to POST mock data to the API
├── requirements.txt         # Python dependencies
└── README.md
```

## Database Schema

```
riders
├── id (PK, UUID)
├── name (VARCHAR)
└── vehicle_type (VARCHAR)

trips
├── id (PK, UUID)
├── rider_id (FK → riders.id)
├── route (GEOMETRY — LineString, SRID 4326)  ← PostGIS spatial column
├── distance_km (FLOAT)
├── start_time (TIMESTAMP)
└── end_time (TIMESTAMP)

telemetry_logs
├── id (PK, UUID)
├── trip_id (FK → trips.id)
├── position (GEOMETRY — Point, SRID 4326)    ← PostGIS spatial column
├── timestamp (TIMESTAMP)
├── voltage (FLOAT)
└── rpm (INTEGER)
```

## Roadmap

- [ ] Spatial queries — find trips passing through a specific area (`ST_Intersects`)
- [ ] Wear prediction model — predict component wear from telemetry patterns
- [ ] Dashboard — visualize trip heatmaps with Deck.gl or Kepler.gl
- [ ] Real Arduino integration — replace mock data with actual GPS + sensor readings

## License

MIT
