import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';                                                                 
import { fetchVenueData, updateZoneStatus } from './api';                                                                                      
                                                                                                                                                   
export function useVenueData() {
    return useQuery({
    queryKey: ['venue'],
    queryFn: fetchVenueData,
    refetchInterval: 10000, 
      });
    }
  
export function useUpdateZoneStatus() {
    const queryClient = useQueryClient();
  
    return useMutation({
    mutationFn: ({ zoneId, status }: { zoneId: string; status: string }) =>
        updateZoneStatus(zoneId, status),
    onSuccess: (newData) => {
        queryClient.setQueryData(['venue'], newData);
    },
    });
}
