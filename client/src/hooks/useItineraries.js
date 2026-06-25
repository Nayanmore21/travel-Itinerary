import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as itineraryApi from '../api/itinerary.api';

export const useItineraries = (page = 1) =>
  useQuery({
    queryKey: ['itineraries', page],
    queryFn: () => itineraryApi.listItineraries(page).then((r) => r.data.data),
    staleTime: 30_000,
  });

export const useItinerary = (id) =>
  useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => itineraryApi.getItinerary(id).then((r) => r.data.data.itinerary),
    enabled: !!id,
    // Poll while generating
    refetchInterval: (query) =>
      query.state.data?.status === 'generating' ? 3000 : false,
  });

export const useSharedItinerary = (shareToken) =>
  useQuery({
    queryKey: ['shared-itinerary', shareToken],
    queryFn: () => itineraryApi.getSharedItinerary(shareToken).then((r) => r.data.data.itinerary),
    enabled: !!shareToken,
  });

export const useDeleteItinerary = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: itineraryApi.deleteItinerary,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['itineraries'] });
      toast.success('Itinerary deleted');
    },
    onError: () => toast.error('Failed to delete itinerary'),
  });
};

export const useGenerateItinerary = () =>
  useMutation({
    mutationFn: itineraryApi.generateItinerary,
    onError: (err) => toast.error(err.response?.data?.message || 'Generation failed'),
  });

export const useShareItinerary = () => {
  const qc = useQueryClient();
  return {
    enable: useMutation({
      mutationFn: itineraryApi.enableSharing,
      onSuccess: (_, id) => qc.invalidateQueries({ queryKey: ['itinerary', id] }),
      onError: () => toast.error('Failed to enable sharing'),
    }),
    disable: useMutation({
      mutationFn: itineraryApi.disableSharing,
      onSuccess: (_, id) => qc.invalidateQueries({ queryKey: ['itinerary', id] }),
    }),
  };
};
