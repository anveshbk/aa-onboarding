
import { useState, useRef } from "react";
import { Link, Upload, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FileUploadAreaProps {
  onChange: (value: { file?: File | null; url?: string; password?: string }) => void;
  maxSize?: number; // in MB
  acceptedFileTypes?: string[];
  defaultValue?: { file?: File | null; url?: string; password?: string } | null;
  placeholder?: string;
}

export const FileUploadArea = ({ 
  onChange, 
  maxSize = 5, 
  acceptedFileTypes,
  defaultValue = null,
  placeholder = "Insert link"
}: FileUploadAreaProps) => {
  const [activeTab, setActiveTab] = useState<"link" | "file">("link");
  const [file, setFile] = useState<File | null>(defaultValue?.file || null);
  const [url, setUrl] = useState<string>(defaultValue?.url || "");
  const [password, setPassword] = useState<string>(defaultValue?.password || "");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      onChange({ file: null, url: "", password: "" });
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
        setError(`Only ${acceptedFileTypes.map(type => type.split('/')[1]).join(', ')} files are allowed`);
        return;
      }
    }

    setFile(selectedFile);
    setError(null);
    onChange({ file: selectedFile, url: "", password: "" });
  };

  const handleLinkChange = (inputUrl: string) => {
    setUrl(inputUrl);
    onChange({ url: inputUrl, password, file: null });
  };

  const handlePasswordChange = (inputPassword: string) => {
    setPassword(inputPassword);
    onChange({ url, password: inputPassword, file: null });
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
    onChange({ file: null, url: "", password: "" });
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Format accepted file types for display
  const formatAcceptedFileTypes = () => {
    if (!acceptedFileTypes || acceptedFileTypes.length === 0) return "";
    
    return acceptedFileTypes.map(type => {
      const parts = type.split('/');
      return parts[1] === '*' ? parts[0] : parts[1].toUpperCase();
    }).join(', ');
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("border-primary");
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary");
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileChange(droppedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className={`relative flex-1 flex ${activeTab === "link" ? "border rounded-md overflow-hidden" : ""}`}>
          {activeTab === "link" && (
            <>
              <div className="flex items-center justify-center px-3 border-r bg-muted">
                <Link className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                value={url}
                onChange={(e) => handleLinkChange(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder={placeholder}
              />
            </>
          )}
          
          {activeTab === "file" && (
            <div className="w-full">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  onClick={() => setActiveTab("link")}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Link
                </Button>
                <div 
                  ref={dropAreaRef}
                  className="flex-1 border rounded-md px-4 py-2 flex items-center justify-between transition-colors"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {file ? file.name : "Drag & Drop your file here or browse"}
                    </span>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    className="sr-only"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    accept={acceptedFileTypes?.join(',')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                  >
                    Browse
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1 ml-[76px]">
                {acceptedFileTypes && acceptedFileTypes.length > 0 ? 
                  `Accepted file types: ${formatAcceptedFileTypes()}. ` : ''}
                File size limit: {maxSize}MB
              </p>
            </div>
          )}
        </div>

        {activeTab === "link" && (
          <Button
            type="button"
            variant="outline"
            className="ml-2"
            onClick={() => setActiveTab("file")}
          >
            <Upload className="h-4 w-4 mr-2" />
            File Upload
          </Button>
        )}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {url && activeTab === "link" && (
        <div className="flex space-x-2">
          <Input
            placeholder="Enter file password (if required)"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="flex-1"
          />
        </div>
      )}

      {file && activeTab === "file" && (
        <div className="file-preview border rounded-md p-2 flex items-center gap-2">
          <File className="h-4 w-4 text-primary" />
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
