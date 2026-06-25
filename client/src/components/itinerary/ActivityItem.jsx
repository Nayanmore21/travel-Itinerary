import { MapPin, Lightbulb, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const categoryColor = {
  transport: 'secondary',
  sightseeing: 'default',
  food: 'warning',
  hotel: 'outline',
  leisure: 'success',
  shopping: 'secondary',
};

const ActivityItem = ({ activity, isLast }) => {
  const mapsUrl = activity.mapsQuery
    ? `https://www.google.com/maps/search/${encodeURIComponent(activity.mapsQuery)}`
    : null;

  return (
    <div className="flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
          <Clock className="h-3.5 w-3.5 text-primary" />
        </div>
        {!isLast && <div className="mt-1 flex-1 w-px bg-border" />}
      </div>

      {/* Content */}
      <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {activity.time && (
            <span className="text-xs font-mono text-muted-foreground">{activity.time}</span>
          )}
          <Badge variant={categoryColor[activity.category] || 'outline'} className="capitalize">
            {activity.category}
          </Badge>
        </div>
        <h4 className="font-semibold">{activity.title}</h4>
        {activity.description && (
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{activity.description}</p>
        )}
        {activity.tip && (
          <div className="mt-2 flex gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 border border-amber-200">
            <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
            <span>{activity.tip}</span>
          </div>
        )}
        {mapsUrl && activity.locationName && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <MapPin className="h-3 w-3" />
            {activity.locationName}
          </a>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;
