import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, File, Video, Image } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  label: string;
  accept: string;
  fieldName: "image" | "video" | "workbook";
  currentUrl?: string;
  onFileUploaded: (url: string) => void;
  className?: string;
}

export function FileUpload({ 
  label, 
  accept, 
  fieldName, 
  currentUrl, 
  onFileUploaded,
  className 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const getIcon = () => {
    switch (fieldName) {
      case "image": return <Image className="w-6 h-6" />;
      case "video": return <Video className="w-6 h-6" />;
      case "workbook": return <File className="w-6 h-6" />;
      default: return <Upload className="w-6 h-6" />;
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          'x-admin-id': 'admin-dev-12345'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      const uploadedUrl = result[`${fieldName}Url`];
      
      if (uploadedUrl) {
        onFileUploaded(uploadedUrl);
        toast({ title: "File uploaded successfully" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({ 
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const clearFile = () => {
    onFileUploaded("");
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      
      {currentUrl ? (
        <div className="mt-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getIcon()}
              <span className="text-sm text-gray-600 truncate">
                {currentUrl.split('/').pop()}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFile}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {fieldName === "image" && (
            <img 
              src={currentUrl} 
              alt="Preview" 
              className="mt-2 max-w-32 max-h-32 object-cover rounded"
            />
          )}
        </div>
      ) : (
        <div
          className={`mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <div className="flex flex-col items-center space-y-2">
            {getIcon()}
            <div className="text-sm text-gray-600">
              Drop your file here or{" "}
              <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                browse
                <Input
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && (
              <div className="text-xs text-gray-500">Uploading...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}