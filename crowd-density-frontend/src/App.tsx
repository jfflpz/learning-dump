import { useState } from 'react';                                                                                                              
import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre';                                                                             
import 'maplibre-gl/dist/maplibre-gl.css';                                                                                                     
import { useVenueData, useUpdateZoneStatus } from './hooks';                                                                                   
                                                                                                                                                
const STATUS_COLORS: Record<string, string> = {                                                                                                
  normal: '#22c55e',                                                                                                                           
  congested: '#ef4444',                                                                                                                        
  closed: '#374151',                                                                                                                            
  alert: '#eab308',                                                                                                                            
};                                                                                                                                             
                                                                                                                                                
const STATUSES = ['normal', 'congested', 'closed', 'alert'];                                                                                   
                                                                                                                                                
function App() {                                                                                                                                                                                                                   
  const { data: venueData, isLoading } = useVenueData();                                                                                       
  const updateStatus = useUpdateZoneStatus();                                                                                                  
                                                                                                                                                
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);                                                                         
  const [popupInfo, setPopupInfo] = useState<any>(null);                                                                                       
                                                                                                                                                
  return (                                                                                                                                     
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>                                                                         
                                                                                                                                                                                                                                                 
      <div style={{                                                                                                                            
        width: '320px',                                                                                                                        
        background: 'rgba(15, 15, 25, 0.95)',                                                                                                  
        borderRight: '1px solid rgba(255,255,255,0.1)',                                                                                        
        padding: '20px',                                                                                                                       
        overflowY: 'auto',                                                                                                                     
        color: '#fff',                                                                                                                         
      }}>                                                                                                                                      
        <h2 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>🏟️ Zone Control</h2>                                                             
                                                                                                                                                                                                                                                                
        {venueData && (                                                                                                                        
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>                                                           
            {STATUSES.map(s => {                                                                                                               
              const count = venueData.features.filter(                                                                                         
                (f: any) => f.properties.status === s                                                                                          
              ).length;                                                                                                                        
              return count > 0 ? (                                                                                                             
                <span key={s} style={{ marginRight: '10px' }}>                                                                                 
                  <span style={{                                                                                                               
                    display: 'inline-block',                                                                                                   
                    width: '8px', height: '8px',                                                                                               
                    borderRadius: '50%',                                                                                                       
                    background: STATUS_COLORS[s],                                                                                              
                    marginRight: '4px'                                                                                                         
                  }} />                                                                                                                        
                  {count} {s}                                                                                                                  
                </span>                                                                                                                        
              ) : null;                                                                                                                        
            })}                                                                                                                                
          </div>                                                                                                                               
        )}                                                                                                                                     
                                                                                                                                                                                                                                                                     
        {venueData?.features.map((feature: any) => (                                                                                           
          <div key={feature.properties.zone_id} style={{                                                                                       
            background: 'rgba(255,255,255,0.05)',                                                                                              
            borderRadius: '8px',                                                                                                               
            padding: '12px',                                                                                                                   
            marginBottom: '8px',                                                                                                               
            borderLeft: `3px solid ${STATUS_COLORS[feature.properties.status] || '#666'}`,                                                     
          }}>                                                                                                                                  
            <strong style={{ fontSize: '14px' }}>{feature.properties.zone_name}</strong>                                                       
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>                                                          
              {feature.properties.zone_type} · cap {feature.properties.capacity}                                                               
            </div>                                                                                                                             
                                                                                                                                                
<div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
  {STATUSES.map(s => {
    const isActive = s === feature.properties.status;
    
    return (
      <button
        key={s}
        onClick={() => updateStatus.mutate({ zoneId: feature.properties.zone_id, status: s })}
        style={{
          flex: 1, // Makes all buttons equal width
          padding: '6px 0',
          border: 'none',
          borderRadius: '4px',
          background: STATUS_COLORS[s],
          color: '#fff',
          fontSize: '11px',
          fontWeight: isActive ? 'bold' : 'normal',
          opacity: isActive ? 1 : 0.25,
          cursor: 'pointer',
          textTransform: 'capitalize',
          transition: 'all 0.2s ease',
          boxShadow: isActive ? '0 0 8px rgba(255,255,255,0.2)' : 'none'
        }}
      >
        {s}
      </button>
    );
  })}
</div>                                                                                                                      
          </div>                                                                                                                               
        ))}                                                                                                                                    
                                                                                                                                                                                                                                                             
        <button                                                                                                                                
          onClick={() => {                                                                                                                     
            venueData?.features.forEach((f: any) => {                                                                                          
              updateStatus.mutate({ zoneId: f.properties.zone_id, status: 'normal' });                                                         
            });                                                                                                                                
          }}                                                                                                                                   
          style={{                                                                                                                             
            width: '100%', padding: '10px', marginTop: '8px',                                                                                  
            background: 'rgba(255,255,255,0.1)', color: '#fff',                                                                                
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',                                                                    
            cursor: 'pointer', fontSize: '13px',                                                                                               
          }}                                                                                                                                   
        >                                                                                                                                      
          Reset All to Normal                                                                                                                  
        </button>                                                                                                                              
      </div>                                                                                                                                   
                                                                                                                                                                                                                                                                 
      <div style={{ flex: 1 }}>                                                                                                                
        <Map                                                                                                                                   
          initialViewState={{ longitude: 121.02, latitude: 14.80, zoom: 11 }}                                                                  
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
                status: feature.properties.status,                                                                                             
              });                                                                                                                              
            }                                                                                                                                  
          }}                                                                                                                                   
        >                                                                                                                                      
          {venueData && (                                                                                                                      
            <Source id="venue" type="geojson" data={venueData} key={JSON.stringify(venueData)}>                                                                                
              <Layer                                                                                                                           
                id="venue-fill"                                                                                                                
                type="fill"                                                                                                                    
                paint={{
                  'fill-color': [
                    'case',
                    ['==', ['get', 'status'], 'congested'], '#ef4444',
                    ['==', ['get', 'status'], 'closed'], '#374151',
                    ['==', ['get', 'status'], 'alert'], '#eab308',
                    ['match',
                      ['get', 'zone_type'],
                      'hall', '#3b82f6',
                      'entrance', '#22c55e',
                      'exit', '#f97316',
                      'seating', '#8b5cf6',
                      'stage', '#ef4444',
                      'corridor', '#6b7280',
                      '#ffffff'
                    ]
                  ],
                  'fill-opacity': [
                    'case',
                    ['==', ['get', 'zone_id'], hoveredZone || ''],
                    0.7,
                    0.4
                  ]
                }}                                                                                                                             
              />                                                                                                                               
              <Layer                                                                                                                           
                id="venue-outline"                                                                                                             
                type="line"                                                                                                                    
                paint={{ 'line-color': '#ffffff', 'line-width': 2 }}                                                                           
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
                <p>Status: {popupInfo.status}</p>                                                                                              
              </div>                                                                                                                           
            </Popup>                                                                                                                           
          )}                                                                                                                                   
        </Map>                                                                                                                                 
      </div>                                                                                                                                   
    </div>                                                                                                                                     
  );                                                                                                                                           
}                                                                                                                                              
                                                                                                                                                
export default App;  