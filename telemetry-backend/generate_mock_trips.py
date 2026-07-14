import pandas as pd                                                                                                                            
import geopandas as gpd                                                                                                                        
from shapely.geometry import LineString                                                                                                        
import numpy as np                                                                                                                             
import uuid                                                                                                                                    
from datetime import datetime, timedelta                                                                                                       
                                                                                                                                                   
np.random.seed(42)                                                                                                                             
                                                                                                                                                   
MIN_LAT, MAX_LAT = 14.55, 14.65                                                                                                                
MIN_LON, MAX_LON = 120.95, 121.05                                                                                                              
                                                                                                                                                   
def generate_trip_route(num_points=20):                                                                                                        
    """Generates a Shapely LineString representing a single trip."""                                                                           
    start_lat = np.random.uniform(MIN_LAT, MAX_LAT)                                                                                            
    start_lon = np.random.uniform(MIN_LON, MAX_LON)                                                                                            
                                                                                                                                                   
    points = [(start_lon, start_lat)]                                                                                                          
                                                                                                                                                   
    for _ in range(num_points - 1):                                                                                                            
        last_lon, last_lat = points[-1]
        
        delta_lat = np.random.uniform(-0.005, 0.005)
        delta_lon = np.random.uniform(-0.005, 0.005)
        
        new_lat = last_lat + delta_lat
        new_lon = last_lon + delta_lon
        
        points.append((new_lon, new_lat))                                                                                                                        
                                                                                                                                                   
    return LineString(points)                                                                                                                  
                                                                                                                                                   
def generate_mock_data(num_trips=20):                                                                                                          
    trips_data = []                                                                                                                            
                                                                                                                                                   
    for i in range(num_trips):                                                                                                                 
        trip_id = str(uuid.uuid4())                                                                                                            
        num_points = np.random.randint(10, 31)                                                                                                 
                                                                                                                                                   
        route = generate_trip_route(num_points)
            
        distance_km = route.length * 111 
            
        trips_data.append({
            "trip_id": trip_id,
            "geometry": route,
            "distance_km": round(distance_km, 2)
        })
            
    gdf = gpd.GeoDataFrame(
        trips_data, 
        geometry="geometry", 
        crs="EPSG:4326"      
    )
        
    gdf.to_file("mock_trips.geojson", driver="GeoJSON")
        
    print(f"Generated {len(trips_data)} mock trips!")

def generate_mock_data(num_trips=20):                                                                                                          
    trips_data = []                                                                                                                            
    telemetry_logs = []                                                                                        
                                                                                                                                                   
    for i in range(num_trips):                                                                                                                 
        trip_id = str(uuid.uuid4())                                                                                                            
        num_points = np.random.randint(10, 31)                                                                                                 
                                                                                                                                                   
        route = generate_trip_route(num_points)                                                                                                

        start_time = datetime.now() - timedelta(days=np.random.randint(0, 30))                                                                 
        current_time = start_time                                                                                                              
        voltage = 12.6                                                                                     
                                                                                                                                                   
        trip_coords = list(route.coords)                                                                                                       
                                                                                                                                                   
        for coord in trip_coords:                                                                                                                                                                                                        
            dt = np.random.randint(5, 16)                                                                                                      
            current_time += timedelta(seconds=dt)                                                                                              
                                                                                                                                                   
            voltage_drop = np.random.uniform(0.01, 0.05)                                                                                       
            voltage = max(11.5, voltage - voltage_drop)                                                                                        
                                                                                                                                                   
            telemetry_logs.append({                                                                                                            
                "trip_id": trip_id,                                                                                                            
                "lon": coord[0],                                                                                                               
                "lat": coord[1],                                                                                                               
                "timestamp": current_time.isoformat(),                                                                                         
                "voltage": round(voltage, 2),                                                                                                  
                "rpm": np.random.randint(800, 8000),                                                                                           
            })                                                                                                                                 
                                                                                                                                                   
        distance_km = route.length * 111 
            
        trips_data.append({
            "trip_id": trip_id,
            "geometry": route,
            "distance_km": round(distance_km, 2),
            "start_time": start_time.isoformat(),
            "end_time": current_time.isoformat()
        })
            
    gdf = gpd.GeoDataFrame(trips_data, geometry="geometry", crs="EPSG:4326")
    gdf.to_file("mock_trips.geojson", driver="GeoJSON")
        
    df_telemetry = pd.DataFrame(telemetry_logs)
    df_telemetry.to_csv("mock_telemetry.csv", index=False)
        
    print(f"Generated {len(trips_data)} mock trips!")
    print(f"Generated {len(telemetry_logs)} telemetry logs!")

if __name__ == "__main__":
    generate_mock_data()
