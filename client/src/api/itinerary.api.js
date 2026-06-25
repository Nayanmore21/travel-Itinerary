import axiosClient from './axiosClient';

export const generateItinerary = (documentIds) =>
  axiosClient.post('/itineraries/generate', { documentIds });

export const listItineraries = (page = 1) =>
  axiosClient.get('/itineraries', { params: { page } });

export const getItinerary = (id) => axiosClient.get(`/itineraries/${id}`);

export const deleteItinerary = (id) => axiosClient.delete(`/itineraries/${id}`);

export const regenerateItinerary = (id) => axiosClient.patch(`/itineraries/${id}/regenerate`);

export const enableSharing = (id) => axiosClient.post(`/itineraries/${id}/share`);

export const disableSharing = (id) => axiosClient.delete(`/itineraries/${id}/share`);

export const getSharedItinerary = (shareToken) =>
  axiosClient.get(`/share/${shareToken}`);
