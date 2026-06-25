import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DropZone from '@/components/upload/DropZone';
import FilePreviewList from '@/components/upload/FilePreviewList';
import UploadProgress from '@/components/upload/UploadProgress';
import ItineraryCard from '@/components/itinerary/ItineraryCard';
import { ItineraryCardSkeleton } from '@/components/itinerary/ItinerarySkeleton';
import { useUpload } from '@/hooks/useUpload';
import { useItineraries, useDeleteItinerary, useGenerateItinerary } from '@/hooks/useItineraries';
import ShareModal from '@/components/share/ShareModal';
import useAuthStore from '@/store/authStore';

const DashboardPage = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [shareTarget, setShareTarget] = useState(null);

  const { stagedFiles, displayDocs, uploadProgress, allComplete, anyCompleted, addFiles, removeFile, dismissDoc, upload, isUploading, reset } = useUpload();
  const { data: historyData, isLoading: historyLoading } = useItineraries();
  const deleteMutation = useDeleteItinerary();
  const generateMutation = useGenerateItinerary();

  const handleGenerate = async () => {
    const completedIds = displayDocs
      .filter((d) => d.extractionStatus === 'completed')
      .map((d) => d._id);

    if (!completedIds.length) return;

    try {
      const { data } = await generateMutation.mutateAsync(completedIds);
      reset();
      navigate(`/itineraries/${data.data.itinerary._id}`);
    } catch {
      // error handled by mutation
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Upload your travel documents and let AI build your itinerary
        </p>
      </div>

      {/* Upload Section */}
      <div className="rounded-xl border bg-card p-6 mb-8">
        <h2 className="mb-4 font-semibold">Upload Travel Documents</h2>
        <DropZone onFiles={addFiles} />
        <FilePreviewList files={stagedFiles} onRemove={removeFile} />

        {stagedFiles.length > 0 && !isUploading && displayDocs.length === 0 && (
          <Button className="mt-4 w-full" onClick={upload}>
            Upload {stagedFiles.length} file{stagedFiles.length > 1 ? 's' : ''}
          </Button>
        )}

        {isUploading && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Uploading…</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <UploadProgress documents={displayDocs} onDismiss={dismissDoc} />

        {allComplete && anyCompleted && (
          <Button
            className="mt-4 w-full gap-2"
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
          >
            <Sparkles className="h-4 w-4" />
            {generateMutation.isPending ? 'Generating itinerary…' : 'Generate AI Itinerary'}
          </Button>
        )}

        {allComplete && !anyCompleted && (
          <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            All documents failed to extract. Please try different files.
          </div>
        )}
      </div>

      {/* History Section */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Your Itineraries</h2>

        {historyLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <ItineraryCardSkeleton key={i} />)}
          </div>
        ) : historyData?.itineraries?.length === 0 ? (
          <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p className="font-medium">No itineraries yet</p>
            <p className="text-sm mt-1">Upload your first travel document to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {historyData?.itineraries?.map((it) => (
              <ItineraryCard
                key={it._id}
                itinerary={it}
                onDelete={(id) => {
                  if (confirm('Delete this itinerary?')) deleteMutation.mutate(id);
                }}
                onShare={setShareTarget}
              />
            ))}
          </div>
        )}
      </div>

      {shareTarget && (
        <ShareModal itinerary={shareTarget} onClose={() => setShareTarget(null)} />
      )}
    </div>
  );
};

export default DashboardPage;
