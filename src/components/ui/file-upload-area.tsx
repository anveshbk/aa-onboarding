
import { useState, useRef } from "react";
import { FileText, Upload, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadAreaProps {
  onChange: (file: File | null) => void;
  maxSize?: number; // in MB
  acceptedFileTypes?: string[];
  defaultValue?: File | null;
}

export const FileUploadArea = ({ 
  onChange, 
  maxSize = 5, 
  acceptedFileTypes,
  defaultValue = null 
}: FileUploadAreaProps) => {
  const [file, setFile] = useState<File | null>(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      onChange(null);
      return;
    }

    // Validate file size
    if (maxSize && selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type if specified
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      const fileType = selectedFile.type;
      if (!acceptedFileTypes.includes(fileType)) {
        setError(`Only ${acceptedFileTypes.join(', ')} files are allowed`);
        return;
      }
    }

    setFile(selectedFile);
    setError(null);
    onChange(selectedFile);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const selectedFile = event.dataTransfer.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`file-input-wrapper ${isDragging ? 'dragging' : ''} ${
          error ? 'border-destructive' : file ? 'border-primary' : 'border-input'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="file-input"
          onChange={handleInputChange}
          accept={acceptedFileTypes?.join(',')}
        />
        
        <div className="flex flex-col items-center text-center">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">
            Drag & drop your file here or{" "}
            <span className="text-primary cursor-pointer" onClick={handleButtonClick}>
              browse
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            File size limit: {maxSize}MB
          </p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {file && (
        <div className="file-preview">
          <FileText className="h-4 w-4 text-primary" />
          <span className="flex-1 truncate">{file.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleClearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
