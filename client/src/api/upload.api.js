import axiosClient from './axiosClient';

export const uploadDocuments = (files, onProgress) => {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  // Do NOT set Content-Type manually — the browser must set it with the
  // correct multipart boundary; overriding it breaks server-side parsing.
  return axiosClient.post('/upload/documents', form, {
    onUploadProgress: (e) => onProgress?.(e.total ? Math.round((e.loaded * 100) / e.total) : 0),
  });
};

export const listDocuments = () => axiosClient.get('/upload/documents');
export const getDocument = (id) => axiosClient.get(`/upload/documents/${id}`);
export const deleteDocument = (id) => axiosClient.delete(`/upload/documents/${id}`);
export const getFileUrl = (id) =>
  `${import.meta.env.VITE_API_BASE_URL}/upload/documents/${id}/file`;
