
import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<string | null>;
  onFileRemove?: (url: string) => void;
  currentFileUrl?: string;
  isUploading?: boolean;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
}

export default function FileUpload({
  onFileUpload,
  onFileRemove,
  currentFileUrl,
  isUploading = false,
  className,
  accept = ".pdf",
  maxSize = 10,
  disabled = false,
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragActive(false);

      if (disabled || isUploading) return;

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];

      if (file) {
        onFileUpload(file);
      }
    },
    [onFileUpload, disabled, isUploading]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const getFileName = (url: string) => {
    return url.split('/').pop()?.split('-').slice(1).join('-') || 'CV.pdf';
  };

  if (currentFileUrl) {
    return (
      <div className={cn("flex items-center gap-3 p-4 border rounded-lg bg-green-50 border-green-200", className)}>
        <FileText className="h-8 w-8 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">CV caricato</p>
          <p className="text-xs text-green-600">{getFileName(currentFileUrl)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(currentFileUrl, '_blank')}
            className="text-green-700 border-green-300 hover:bg-green-100"
          >
            Visualizza
          </Button>
          {onFileRemove && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFileRemove(currentFileUrl)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        disabled={disabled || isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center gap-4">
        {isUploading ? (
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        ) : (
          <Upload className="h-12 w-12 text-gray-400" />
        )}
        
        <div>
          <p className="text-lg font-medium text-gray-900">
            {isUploading ? "Caricamento in corso..." : "Carica CV del candidato"}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Trascina il file PDF qui o clicca per selezionarlo
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Formati supportati: PDF (max {maxSize}MB)
          </p>
        </div>
      </div>
    </div>
  );
}
