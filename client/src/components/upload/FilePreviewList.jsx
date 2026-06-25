import { FileText, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FileIcon = ({ mimeType }) =>
  mimeType === 'application/pdf'
    ? <FileText className="h-5 w-5 text-red-500 shrink-0" />
    : <Image className="h-5 w-5 text-blue-500 shrink-0" />;

const FilePreviewList = ({ files, onRemove }) => {
  if (!files.length) return null;

  return (
    <div className="mt-4 space-y-2">
      {files.map((file, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
          <FileIcon mimeType={file.type} />
          <span className="flex-1 truncate text-sm">{file.name}</span>
          <span className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => onRemove(i)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FilePreviewList;
