import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  hasImage: boolean;
}

export function UploadZone({ onFileSelect, hasImage }: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic', '.tiff', '.tif']
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'upload-zone cursor-pointer',
        isDragActive && 'active',
        hasImage && 'border-primary/30'
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className={cn(
          "p-3 rounded-xl transition-colors",
          isDragActive ? "bg-primary/20" : "bg-muted"
        )}>
          {hasImage ? (
            <ImageIcon className="w-6 h-6 text-primary" />
          ) : (
            <Upload className={cn(
              "w-6 h-6 transition-colors",
              isDragActive ? "text-primary" : "text-muted-foreground"
            )} />
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-foreground">
            {hasImage ? 'Replace photo' : 'Drop photo here'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isDragActive ? 'Drop to upload' : 'or click to browse'}
          </p>
        </div>
      </div>
    </div>
  );
}
