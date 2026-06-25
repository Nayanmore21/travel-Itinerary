import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as uploadApi from '../api/upload.api';

export const useUpload = () => {
  const [stagedFiles, setStagedFiles] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const pollInterval = useRef(1000);

  const addFiles = useCallback((incoming) => {
    setStagedFiles((prev) => {
      const merged = [...prev, ...incoming];
      return merged.slice(0, 5); // cap at 5
    });
  }, []);

  const removeFile = useCallback((index) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const dismissDoc = useCallback((docId) => {
    setDismissedIds((prev) => new Set([...prev, docId]));
  }, []);

  const uploadMutation = useMutation({
    mutationFn: () => uploadApi.uploadDocuments(stagedFiles, setUploadProgress),
    onSuccess: ({ data }) => {
      setUploadedDocs(data.data.documents);
      setStagedFiles([]);
      pollInterval.current = 1000;
      toast.success('Files uploaded — extracting data…');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Upload failed'),
  });

  // Poll status of uploaded documents with exponential backoff
  const docIds = uploadedDocs.map((d) => d._id);
  const { data: polledDocs } = useQuery({
    queryKey: ['doc-status', docIds.join(',')],
    queryFn: async () => {
      const results = await Promise.all(docIds.map((id) => uploadApi.getDocument(id)));
      return results.map((r) => r.data.data.document);
    },
    enabled: docIds.length > 0,
    refetchInterval: (query) => {
      const docs = query.state.data || uploadedDocs;
      const allDone = docs.every((d) => d.extractionStatus === 'completed' || d.extractionStatus === 'failed');
      if (allDone) return false;
      // Exponential backoff capped at 10s
      pollInterval.current = Math.min(pollInterval.current * 1.5, 10000);
      return pollInterval.current;
    },
  });

  const displayDocs = (polledDocs || uploadedDocs).filter((d) => !dismissedIds.has(d._id));
  const allComplete =
    displayDocs.length > 0 &&
    displayDocs.every((d) => d.extractionStatus === 'completed' || d.extractionStatus === 'failed');
  const anyCompleted = displayDocs.some((d) => d.extractionStatus === 'completed');

  const reset = () => {
    setUploadedDocs([]);
    setStagedFiles([]);
    setUploadProgress(0);
    setDismissedIds(new Set());
  };

  return {
    stagedFiles,
    displayDocs,
    uploadProgress,
    allComplete,
    anyCompleted,
    addFiles,
    removeFile,
    dismissDoc,
    upload: () => uploadMutation.mutate(),
    isUploading: uploadMutation.isPending,
    reset,
  };
};
