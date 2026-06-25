import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const DropZone = ({ onFiles }) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: onFiles,
    accept: ACCEPTED,
    maxFiles: 5,
    maxSize: 15 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors',
        isDragActive && !isDragReject && 'border-primary bg-primary/5',
        isDragReject && 'border-destructive bg-destructive/5',
        !isDragActive && 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className={cn('mb-4 h-12 w-12', isDragActive ? 'text-primary' : 'text-muted-foreground')} />
      <p className="text-center font-medium">
        {isDragActive ? 'Drop your files here' : 'Drag & drop travel documents here'}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
      <div className="mt-4 flex gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><FileText className="h-3 w-3" />PDF</span>
        <span className="flex items-center gap-1"><Image className="h-3 w-3" />JPG / PNG / WebP</span>
        <span>· Max 15MB · Up to 5 files</span>
      </div>
    </div>
  );
};

export default DropZone;
