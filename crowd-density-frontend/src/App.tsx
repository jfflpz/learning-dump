import { useEffect, useState } from 'react';                                                                                                   
import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre';                                                                                    
import 'maplibre-gl/dist/maplibre-gl.css';
                                                                                                     
                                                                                                                                                   
function App() {                                                                                                                               
  const [venueData, setVenueData] = useState(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);                                                                           
  const [popupInfo, setPopupInfo] = useState<any>(null);                                                                                               
                                                                                                                                                   
  // Load the GeoJSON file on mount                                                                                                            
  useEffect(() => {                                                                                                                            
    fetch('/venue.geojson')                                                                                                                    
      .then(res => res.json())                                                                                                                 
      .then(data => setVenueData(data));                                                                                                       
  }, []);                                                                                                                                      
                                                                                                                                                   
  return (                                                                                                                                     
    <div style={{ width: '100vw', height: '100vh' }}>                                                                                          
      <Map                                                                                                                                     
        initialViewState={{                                                                                                                    
          longitude: 121.02,                                                                                                                   
          latitude: 14.80,                                                                                                                     
          zoom: 11
        }}                                                                                                                                     
        style={{ width: '100%', height: '100%' }}                                                                                              
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        
      interactiveLayerIds={['venue-fill']}                                                                                                         
      onMouseMove={(e) => {                                                                                                                        
        if (e.features && e.features.length > 0) {                                                                                                 
          setHoveredZone(e.features[0].properties.zone_id);                                                                                        
        } else {                                                                                                                                   
          setHoveredZone(null);                                                                                                                    
        }                                                                                                                                          
      }}                                                                                                                                           
      onMouseLeave={() => setHoveredZone(null)}                                                                                                    
      onClick={(e) => {                                                                                                                            
        if (e.features && e.features.length > 0) {                                                                                                 
          const feature = e.features[0];                                                                                                           
          setPopupInfo({                                                                                                                           
            longitude: e.lngLat.lng,                                                                                                               
            latitude: e.lngLat.lat,                                                                                                                
            name: feature.properties.zone_name,                                                                                                    
            type: feature.properties.zone_type,                                                                                                    
            capacity: feature.properties.capacity,                                                                                                 
          });                                                                                                                                      
        }
      }}                                                                  
        >                                                                                                                                        
        {venueData && (                                                                                                                        
          <Source id="venue" type="geojson" data={venueData}>                                                                                  
            
            <Layer                                                                                       
                id="venue-fill"                                                                                                                
                type="fill"                                                                                                                    
      paint={{                                                                                                                                     
        'fill-color': [                                                                                                                            
          'match',
          ['get', 'zone_type'],   // read the zone_type property
          'hall', '#3b82f6',       // blue
          'entrance', '#22c55e',   // green
          'exit', '#f97316',       // orange
          'seating', '#8b5cf6',    // purple
          'stage', '#ef4444',      // red
          'corridor', '#6b7280',   // gray
          '#ffffff'                // default: white
        ],
        'fill-opacity': ['case',
      ['==', ['get', 'zone_id'], hoveredZone || ''],
      0.7,  
      0.4     
      ]
      }}

                />                                                                                                                             
            
  
            <Layer
                id="venue-outline"
                type="line"
                paint={{
                  'line-color': '#ffffff',
                  'line-width': 2
                }}
            />
          </Source>
        )}
    {popupInfo && (
      <Popup
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        onClose={() => setPopupInfo(null)}
        closeOnClick={false}
      >
        <div style={{ color: '#000', padding: '4px' }}>
          <strong>{popupInfo.name}</strong>
          <p>Type: {popupInfo.type}</p>
          <p>Capacity: {popupInfo.capacity}</p>
        </div>
      </Popup>
    )}

      </Map>
    </div>
  );
}
  
export default App;