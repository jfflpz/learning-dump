from pydantic import BaseModel                                                                                                                 
from typing import List, Optional                                                                                                              
from datetime import datetime                                                                                                                  
                                                                                                                                                   
class TelemetryReading(BaseModel):                                                                                                                                                                                                     
    lat: float                                                                                                                                 
    lon: float                                                                                                                                 
    timestamp: datetime
    voltage: float
    rpm: int
  
class TripCreate(BaseModel):
    rider_id: str
    route_coordinates: List[List[float]]
    start_time: datetime
    end_time: datetime
    distance_km: float
    telemetry: List[TelemetryReading]

class TripResponse(BaseModel):
    trip_id: str
    rider_id: str
    distance_km: float
    start_time: datetime
    end_time: datetime
        
    class Config:
        from_attributes = True