from fastapi import FastAPI, Depends, HTTPException                                                                                            
from sqlalchemy.ext.asyncio import AsyncSession                                                                                                
from sqlalchemy import select                                                                                                                  
from geoalchemy2.shape import from_shape                                                                                                       
from shapely.geometry import LineString, Point                                                                                                 
from datetime import datetime                                                                                                                  
                                                                                                                                                   
from database import get_db                                                                                                                    
from models import Trip, TelemetryLog, Rider                                                                                                   
from schemas import TripCreate, TripResponse                                                                                                   
                                                                                                                                                   
app = FastAPI(title="Two-Wheeler Telemetry API")                                                                                               
                                                                                                                                                   
@app.post("/api/v1/trips", status_code=201)                                                                                                    
async def create_trip(trip_data: TripCreate, db: AsyncSession = Depends(get_db)):                                                              
                                                                                                                                                   
    route_geom = from_shape(LineString(trip_data.route_coordinates), srid=4326)                                                                
                                                                                                                                                   
    new_trip = Trip(                                                                                                                           
        rider_id=trip_data.rider_id,                                                                                                           
        route=route_geom,                                                                                                                      
        distance_km=trip_data.distance_km,                                                                                                     
        start_time=trip_data.start_time,                                                                                                       
        end_time=trip_data.end_time,                                                                                                           
    )                                                                                                                                          
    db.add(new_trip)                                                                                                                           
    await db.flush()                                                                                        
                                                                                                                                                                                                                                                 
    for reading in trip_data.telemetry:                                                                                                        
        log = TelemetryLog(                                                                                                                    
            trip_id=new_trip.id,                                                                                                               
            position=from_shape(Point(reading.lon, reading.lat), srid=4326),                                                                   
            timestamp=reading.timestamp,                                                                                                       
            voltage=reading.voltage,                                                                                                           
            rpm=reading.rpm,                                                                                                                   
        )                                                                                                                                      
        db.add(log)                                                                                                                            
                                                                                                                                                   
    await db.commit()                                                                                                                          
    return {"trip_id": new_trip.id, "message": "Trip created successfully"}                                                                    
                                                                                                                                                   
@app.get("/api/v1/trips", response_model=list[TripResponse])
async def get_all_trips(db: AsyncSession = Depends(get_db)):
    """Get a list of all trips."""
    result = await db.execute(select(Trip))
    trips = result.scalars().all()
    return trips
  
@app.get("/api/v1/trips/{trip_id}/telemetry")
async def get_trip_telemetry(trip_id: str, db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(TelemetryLog).where(TelemetryLog.trip_id == trip_id))
    logs = result.scalars().all()
        
    if not logs:
        raise HTTPException(status_code=404, detail="Trip not found or has no telemetry")
        
    return [
        {
            "timestamp": log.timestamp,
            "voltage": log.voltage,
            "rpm": log.rpm,
        }
        for log in logs
    ]