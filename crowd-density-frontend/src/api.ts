    let venueData: any = null;                                                                                                                     
  
    export async function fetchVenueData() {
      if (!venueData) {
        const res = await fetch('/venue.geojson');
        venueData = await res.json();
      }
      return venueData;
    }
  
    export async function updateZoneStatus(zoneId: string, status: string) {
      if (!venueData) await fetchVenueData();
  
      // Find the zone and update its status
      const feature = venueData.features.find(
        (f: any) => f.properties.zone_id === zoneId
      );
  
      if (feature) {
        feature.properties.status = status;
      }
  
      // Return a fresh copy so React detects the change
      return JSON.parse(JSON.stringify(venueData));
    }
