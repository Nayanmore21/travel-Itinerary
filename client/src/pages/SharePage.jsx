import { useParams, Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { MapPin, Calendar, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DayAccordion from '@/components/itinerary/DayAccordion';
import { DaySkeleton } from '@/components/itinerary/ItinerarySkeleton';
import { useSharedItinerary } from '@/hooks/useItineraries';
import { fmtDateRange } from '@/utils/formatDate';

const SharePage = () => {
  const { shareToken } = useParams();
  const { data: itinerary, isLoading, error } = useSharedItinerary(shareToken);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        {[1, 2, 3].map((i) => <DaySkeleton key={i} />)}
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-4">
        <p className="font-medium">This itinerary is not available or sharing has been disabled.</p>
        <Button className="mt-4" asChild><Link to="/">Create your own</Link></Button>
      </div>
    );
  }

  const title = itinerary.tripSummary?.title || 'Travel Itinerary';
  const description = `${itinerary.tripSummary?.totalDays || ''}-day trip to ${itinerary.tripSummary?.destination || 'an amazing destination'}`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title} — TripCraft</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {itinerary.tripSummary?.coverImageUrl && (
          <meta property="og:image" content={itinerary.tripSummary.coverImageUrl} />
        )}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {itinerary.tripSummary?.coverImageUrl && (
          <div className="mb-6 overflow-hidden rounded-xl h-52">
            <img
              src={itinerary.tripSummary.coverImageUrl}
              alt={itinerary.tripSummary.destination}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
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

        <DayAccordion days={itinerary.days || []} />

        {/* CTA Banner */}
        <div className="mt-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
          <Plane className="mx-auto mb-2 h-8 w-8 opacity-80" />
          <h3 className="text-lg font-bold">Plan your own trip with AI</h3>
          <p className="mt-1 text-sm text-blue-100">Upload your bookings and get a personalised itinerary in seconds</p>
          <Button className="mt-4 bg-white text-blue-700 hover:bg-blue-50" asChild>
            <Link to="/register">Try TripCraft Free</Link>
          </Button>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default SharePage;
