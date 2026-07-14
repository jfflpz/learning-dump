from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey                                                                    
from sqlalchemy.orm import declarative_base, relationship                                                                                      
from geoalchemy2 import Geometry                                                                                                               
from datetime import datetime                                                                                                                  
import uuid                                                                                                                                    
                                                                                                                                                   
Base = declarative_base()                                                                                                                      
                                                                                                                                                   
def generate_uuid():                                                                                                                           
    return str(uuid.uuid4())                                                                                                                   
                                                                                                                                                   
class Rider(Base):                                                                                                                             
    __tablename__ = 'riders'                                                                                                                   
                                                                                                                                                   
    id = Column(String, primary_key=True, default=generate_uuid)                                                                         
    name = Column(String)                                                                                                           
    vehicle_type = Column(String, nullable=False)                                                                     
                                                                                                                                                   
    trips = relationship("Trip", back_populates="rider")                                                                                       
                                                                                                                                                   
class Trip(Base):                                                                                                                              
    __tablename__ = 'trips'                                                                                                                    
                                                                                                                                                   
    id = Column(String, primary_key=True, default=generate_uuid)                                                                               
    rider_id = Column(String, ForeignKey('riders.id'))                                                                                         
    route = Column(Geometry(geometry_type='LINESTRING', srid=4326))                                                                            
    distance_km = Column(Float)                                                                                                                
    start_time = Column(DateTime)                                                                                                              
    end_time = Column(DateTime)                                                                                                                
        
    rider = relationship("Rider", back_populates="trips")
    telemetry = relationship("TelemetryLog", back_populates="trip")
  
class TelemetryLog(Base):
    __tablename__ = 'telemetry_logs'
        
    id = Column(String, primary_key=True, default=generate_uuid)
    trip_id = Column(String, ForeignKey('trips.id'))
    position = Column(Geometry(geometry_type='POINT', srid=4326))
    timestamp = Column(DateTime)
    voltage = Column(Float)
    rpm = Column(Integer)
        
    trip = relationship("Trip", back_populates="telemetry")
