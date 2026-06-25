import { useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ItineraryCard from '@/components/itinerary/ItineraryCard';
import { ItineraryCardSkeleton } from '@/components/itinerary/ItinerarySkeleton';
import ShareModal from '@/components/share/ShareModal';
import { useItineraries, useDeleteItinerary } from '@/hooks/useItineraries';

const HistoryPage = () => {
  const [shareTarget, setShareTarget] = useState(null);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useItineraries(page);
  const deleteMutation = useDeleteItinerary();

  const itineraries = data?.itineraries ?? [];
  const pagination = data?.pagination;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <History className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Itinerary History</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All your previously generated travel itineraries
          </p>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ItineraryCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center">
          <p className="font-medium text-destructive">Failed to load history</p>
          <p className="text-sm text-muted-foreground mt-1">Please refresh the page and try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && itineraries.length === 0 && (
        <div className="rounded-xl border border-dashed py-20 text-center">
          <History className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
          <h2 className="font-semibold text-lg">No previous history</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
            You haven't generated any itineraries yet. Upload your travel documents to get started.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/dashboard">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate your first itinerary
            </Link>
          </Button>
        </div>
      )}

      {/* Itinerary grid */}
      {!isLoading && !isError && itineraries.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {pagination?.total ?? itineraries.length} itinerar{(pagination?.total ?? itineraries.length) === 1 ? 'y' : 'ies'}
            </p>
            {deleteMutation.isPending && (
              <p className="text-xs text-muted-foreground">Deleting…</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((it) => (
              <ItineraryCard
                key={it._id}
                itinerary={it}
                onDelete={(id) => {
                  if (window.confirm('Delete this itinerary? This cannot be undone.')) {
                    deleteMutation.mutate(id);
                  }
                }}
                onShare={setShareTarget}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {shareTarget && (
        <ShareModal itinerary={shareTarget} onClose={() => setShareTarget(null)} />
      )}
    </div>
  );
};

export default HistoryPage;
