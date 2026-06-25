import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, MapPin, Calendar, Plane, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DayAccordion from '@/components/itinerary/DayAccordion';
import { DaySkeleton } from '@/components/itinerary/ItinerarySkeleton';
import ShareModal from '@/components/share/ShareModal';
import { useItinerary } from '@/hooks/useItineraries';
import { fmtDateRange } from '@/utils/formatDate';

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const { data: itinerary, isLoading, error } = useItinerary(id);
  const [showShare, setShowShare] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        {[1, 2, 3].map((i) => <DaySkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-4">
        <p className="text-destructive font-medium">Itinerary not found</p>
        <Button className="mt-4" asChild><Link to="/dashboard">Back to Dashboard</Link></Button>
      </div>
    );
  }

  if (!itinerary) return null;

  const isGenerating = itinerary.status === 'generating';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
          <Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
        </Button>

        {itinerary.tripSummary?.coverImageUrl && (
          <div className="mb-4 overflow-hidden rounded-xl h-52">
            <img
              src={itinerary.tripSummary.coverImageUrl}
              alt={itinerary.tripSummary.destination}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              {itinerary.tripSummary?.title || 'Your Itinerary'}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {itinerary.tripSummary?.destination && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {itinerary.tripSummary.origin} → {itinerary.tripSummary.destination}
                </span>
              )}
              {itinerary.tripSummary?.startDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {fmtDateRange(itinerary.tripSummary.startDate, itinerary.tripSummary.endDate)}
                </span>
              )}
              {itinerary.tripSummary?.totalDays && (
                <Badge variant="secondary">{itinerary.tripSummary.totalDays} days</Badge>
              )}
            </div>
          </div>
          {itinerary.status === 'ready' && (
            <Button size="sm" variant="outline" onClick={() => setShowShare(true)}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          )}
        </div>
      </div>

      {/* Bookings Summary */}
      {(itinerary.bookings?.flights?.length > 0 || itinerary.bookings?.hotels?.length > 0) && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {itinerary.bookings.flights?.map((f, i) => (
            <div key={i} className="rounded-lg border bg-blue-50 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                <Plane className="h-4 w-4" />
                {f.airline || 'Flight'} {f.flightNumber}
              </div>
              <p className="text-xs text-blue-600 mt-0.5">
                {f.origin} → {f.destination}
              </p>
            </div>
          ))}
          {itinerary.bookings.hotels?.map((h, i) => (
            <div key={i} className="rounded-lg border bg-emerald-50 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                🏨 {h.name}
              </div>
              {h.checkIn && (
                <p className="text-xs text-emerald-600 mt-0.5">
                  Check-in: {fmtDateRange(h.checkIn, h.checkOut)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Day-by-day itinerary */}
      {isGenerating ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-3" />
          <p className="font-medium">AI is crafting your itinerary…</p>
          <p className="text-sm text-muted-foreground mt-1">This usually takes 15-30 seconds</p>
        </div>
      ) : itinerary.status === 'failed' ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-medium text-destructive">Generation failed</p>
          <p className="text-sm text-muted-foreground mt-1">{itinerary.generationError}</p>
          <Button className="mt-4" size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-1" />
            Try Again
          </Button>
        </div>
      ) : (
        <DayAccordion days={itinerary.days || []} />
      )}

      {showShare && (
        <ShareModal itinerary={itinerary} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
};

export default ItineraryDetailPage;
