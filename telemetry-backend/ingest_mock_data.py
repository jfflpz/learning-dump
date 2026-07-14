import pandas as pd                                                                                                                            
import json                                                                                                                                    
import httpx                                                                                                                                   
import asyncio                                                                                                                                 
                                                                                                                                                   
API_URL = "http://localhost:8000/api/v1/trips"                                                                                                 
                                                                                                                                                   
async def ingest():                                                                                                                            
    trips_gdf = json.load(open("mock_trips.geojson"))                                                                                          
    telemetry_df = pd.read_csv("mock_telemetry.csv")                                                                                           
                                                                                                                                                   
    async with httpx.AsyncClient() as client:                                                                                                  
        for feature in trips_gdf["features"]:                                                                                                  
            trip_id = feature["properties"]["trip_id"]                                                                                         
            coords = feature["geometry"]["coordinates"]  # list of [lon, lat]                                                                  
                                                                                                                                                   
            trip_telemetry = telemetry_df[telemetry_df["trip_id"] == trip_id]                                                                  
                                                                                                                                                   
            readings = []                                                                                                                      
            for _, row in trip_telemetry.iterrows():                                                                                           
                readings.append({                                                                                                              
                    "lat": row["lat"],                                                                                                         
                    "lon": row["lon"],                                                                                                         
                    "timestamp": row["timestamp"],                                                                                             
                    "voltage": row["voltage"],                                                                                                 
                    "rpm": int(row["rpm"]),                                                                                                    
                })                                                                                                                             
                                                                                                                                                   
            payload = {
                "rider_id": "rider-001",
                "route_coordinates": coords,
                "start_time": readings[0]["timestamp"],
                "end_time": readings[-1]["timestamp"],
                "distance_km": feature["properties"]["distance_km"],
                "telemetry": readings
            }
                
            response = await client.post(API_URL, json=payload)
                
            if response.status_code == 201:
                print(f"✅ Trip {trip_id[:8]}... ingested")
            else:
                print(f"❌ Trip {trip_id[:8]}... failed: {response.text}")
        
    print("\nDone! All trips ingested.")
  
if __name__ == "__main__":
    asyncio.run(ingest())