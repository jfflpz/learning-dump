# 📚 Learning Dump

A monorepo of hands-on learning projects focused on **spatial data engineering** — from backend pipelines to interactive map frontends.

Each project is a self-contained module that explores a different facet of working with geospatial data, PostGIS, and map visualization.

## Projects

### 🏍️ [telemetry-backend/](./telemetry-backend/)
**Two-Wheeler Telemetry & Spatial Wear Predictor**

A Python backend pipeline that simulates motorcycle telemetry collection — generating GPS trip routes with GeoPandas/Shapely, storing them in a PostGIS-enabled PostgreSQL database via GeoAlchemy2, and serving them through an async FastAPI REST API.

**Tech:** Python · FastAPI · PostgreSQL + PostGIS · GeoAlchemy2 · GeoPandas · Shapely

---

### 🏟️ [crowd-density-frontend/](./crowd-density-frontend/)
**Civic Event & Crowd Density Optimizer**

A React frontend that renders digitized venue floor plans as interactive GeoJSON polygons on a MapLibre GL map. Zones are color-coded by type and can be toggled between statuses (normal, congested, closed) with real-time map updates via TanStack Query.

**Tech:** React · TypeScript · MapLibre GL JS · react-map-gl · TanStack Query · Vite

---

### 📍 [life-tracker-backend/](./life-tracker-backend/)
**Personal GPS Life Tracker Backend**

A FastAPI + PostGIS backend designed to ingest 24/7 time-series GPS data from a mobile app. Features offline-first batched ingestion, spatial geofencing queries using PostGIS functions, and GeoJSON map generation.

**Tech:** Python · FastAPI · PostgreSQL + PostGIS · GeoAlchemy2 · Pydantic

---

## What I'm Learning

- **Spatial Data Formats** — GeoJSON, WKB, coordinate reference systems (EPSG:4326)
- **Spatial Databases** — PostGIS geometry columns, spatial indexes, spatial SQL functions
- **Backend Engineering** — Async Python, FastAPI, SQLAlchemy ORM, data ingestion pipelines
- **Frontend Map Rendering** — MapLibre GL JS, data-driven styling, interactive layers
- **State Management** — TanStack Query, optimistic updates, cache invalidation

## Getting Started

Each project has its own README with setup instructions:

- [telemetry-backend/README.md](./telemetry-backend/README.md)
- [crowd-density-frontend/README.md](./crowd-density-frontend/README.md)
- [life-tracker-backend/README.md](./life-tracker-backend/README.md)

## License

MIT
