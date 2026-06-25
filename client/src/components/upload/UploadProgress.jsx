import { CheckCircle2, XCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusIcon = {
  pending: <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
  processing: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
  completed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  failed: <XCircle className="h-4 w-4 text-destructive" />,
};

const statusLabel = {
  pending: 'Queued',
  processing: 'Extracting data…',
  completed: 'Ready',
  failed: 'Failed',
};

const UploadProgress = ({ documents, onDismiss }) => {
  if (!documents?.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Processing documents</p>
      {documents.map((doc) => (
        <div key={doc._id} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
          {statusIcon[doc.extractionStatus]}
          <span className="flex-1 truncate text-sm">{doc.originalName}</span>
          <span className="text-xs text-muted-foreground">{statusLabel[doc.extractionStatus]}</span>
          {doc.extractionStatus === 'failed' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onDismiss?.(doc._id)}
              title="Dismiss"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UploadProgress;
