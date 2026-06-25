import { Link } from 'react-router-dom';
import { MapPin, Calendar, Trash2, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fmtDateRange } from '@/utils/formatDate';

const statusColor = {
  ready: 'success',
  generating: 'warning',
  failed: 'destructive',
};

const ItineraryCard = ({ itinerary, onDelete, onShare }) => {
  const { tripSummary, status, createdAt } = itinerary;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      {tripSummary?.coverImageUrl && (
        <div className="h-36 overflow-hidden">
          <img
            src={tripSummary.coverImageUrl}
            alt={tripSummary.destination}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="truncate font-semibold leading-tight">
              {tripSummary?.title || 'Untitled Trip'}
            </p>
            {tripSummary?.destination && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                {tripSummary.origin} → {tripSummary.destination}
              </p>
            )}
            {tripSummary?.startDate && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3 shrink-0" />
                {fmtDateRange(tripSummary.startDate, tripSummary.endDate)}
                {tripSummary.totalDays && ` · ${tripSummary.totalDays} days`}
              </p>
            )}
          </div>
          <Badge variant={statusColor[status]} className="shrink-0 capitalize">
            {status}
          </Badge>
        </div>

        <div className="mt-3 flex gap-2">
          {status === 'ready' && (
            <Button size="sm" className="flex-1" asChild>
              <Link to={`/itineraries/${itinerary._id}`}>View</Link>
            </Button>
          )}
          {status === 'ready' && (
            <Button size="icon" variant="outline" className="h-9 w-9" onClick={() => onShare?.(itinerary)} title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete?.(itinerary._id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItineraryCard;
