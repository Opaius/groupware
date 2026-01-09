"use client";

import { useState, useRef } from "react";
import {
  Paperclip,
  Upload,
  X,
  FileText,
  Image,
  File,
  Loader2,
  CloudUpload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface FileUploadButtonProps {
  conversationId: Id<"conversations">;
  disabled?: boolean;
}

interface SelectedFile {
  file: File;
  previewUrl?: string;
  uploadProgress: number;
  status: "pending" | "uploading" | "uploaded" | "error";
  error?: string;
  storageId?: Id<"_storage">;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export function FileUploadButton({
  conversationId,
  disabled = false,
}: FileUploadButtonProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.chat.messages.generateUploadUrl);
  const sendMessageWithAttachments = useMutation(
    api.chat.messages.sendMessageWithAttachments,
  );

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="size-4" />;
    }
    if (fileType === "application/pdf") {
      return <FileText className="size-4" />;
    }
    return <File className="size-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newFiles: SelectedFile[] = files.map((file) => {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return {
          file,
          status: "error",
          error: "File type not allowed",
          uploadProgress: 0,
        };
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return {
          file,
          status: "error",
          error: `File too large (max ${formatFileSize(MAX_FILE_SIZE)})`,
          uploadProgress: 0,
        };
      }

      // Create preview URL for images
      let previewUrl: string | undefined;
      if (file.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(file);
      }

      return {
        file,
        previewUrl,
        uploadProgress: 0,
        status: "pending",
      };
    });

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      const removedFile = newFiles.splice(index, 1)[0];

      // Revoke preview URL if it exists
      if (removedFile.previewUrl) {
        URL.revokeObjectURL(removedFile.previewUrl);
      }

      return newFiles;
    });
  };

  const uploadFile = async (
    selectedFile: SelectedFile,
    index: number,
  ): Promise<{
    storageId: Id<"_storage">;
    filename: string;
    mimeType: string;
    size: number;
  } | null> => {
    try {
      // Update status to uploading
      setSelectedFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = { ...selectedFile, status: "uploading" };
        return newFiles;
      });

      // Get upload URL
      const result = await generateUploadUrl({ count: 1 });
      if (!result.success || !result.urls || result.urls.length === 0) {
        throw new Error("Failed to get upload URL");
      }

      const uploadUrl = result.urls[0];

      // Upload file
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.file.type },
        body: selectedFile.file,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const storageId = (await response.json()) as Id<"_storage">;

      // Update status to uploaded
      setSelectedFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = {
          ...selectedFile,
          status: "uploaded",
          uploadProgress: 100,
          storageId,
        };
        return newFiles;
      });

      return {
        storageId,
        filename: selectedFile.file.name,
        mimeType: selectedFile.file.type,
        size: selectedFile.file.size,
      };
    } catch (error) {
      console.error("Upload error:", error);

      setSelectedFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = {
          ...selectedFile,
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed",
        };
        return newFiles;
      });

      return null;
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload all files
      const uploadPromises = selectedFiles.map((file, index) => {
        if (file.status === "pending" || file.status === "error") {
          return uploadFile(file, index);
        }
        if (file.status === "uploaded" && file.storageId) {
          return Promise.resolve({
            storageId: file.storageId,
            filename: file.file.name,
            mimeType: file.file.type,
            size: file.file.size,
          });
        }
        return Promise.resolve(null);
      });

      const uploadResults = await Promise.all(uploadPromises);
      const successfulUploads = uploadResults.filter(
        (
          upload,
        ): upload is {
          storageId: Id<"_storage">;
          filename: string;
          mimeType: string;
          size: number;
        } => upload !== null,
      );

      if (successfulUploads.length === 0) {
        toast.error("No files were uploaded successfully");
        return;
      }

      // Send message with attachments
      await sendMessageWithAttachments({
        conversationId,
        body: message.trim() || `📎 ${successfulUploads.length} file(s)`,
        attachments: successfulUploads,
      });

      toast.success(`Sent ${successfulUploads.length} file(s)`);
      setOpen(false);

      // Reset form
      setMessage("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Failed to send files:", error);
      toast.error("Failed to send files. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const fakeEvent = {
        target: {
          files: e.dataTransfer.files,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const pendingFiles = selectedFiles.filter(
    (f) => f.status === "pending" || f.status === "uploading",
  );
  const uploadedFiles = selectedFiles.filter((f) => f.status === "uploaded");
  const errorFiles = selectedFiles.filter((f) => f.status === "error");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Paperclip className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-137.5 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">
            Send Files
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload and share files with the other participant. Supports images,
            documents, and PDFs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="message" className="font-medium">
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a description or context for these files..."
              rows={3}
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>

          <div
            className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ALLOWED_FILE_TYPES.join(",")}
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CloudUpload className="size-10 text-primary" />
            </div>
            <p className="font-semibold text-lg mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports images, PDFs, and documents up to{" "}
              {formatFileSize(MAX_FILE_SIZE)}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Image className="size-3" />
                <span>Images</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="size-3" />
                <span>PDFs</span>
              </div>
              <div className="flex items-center gap-1">
                <File className="size-3" />
                <span>Documents</span>
              </div>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-medium">
                  Selected Files ({selectedFiles.length})
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedFiles.forEach((file) => {
                      if (file.previewUrl) {
                        URL.revokeObjectURL(file.previewUrl);
                      }
                    });
                    setSelectedFiles([]);
                  }}
                  disabled={isSubmitting}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3 mr-2" />
                  Clear All
                </Button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {selectedFiles.map((selectedFile, index) => (
                  <div
                    key={`${selectedFile.file.name}-${index}`}
                    className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="shrink-0 p-3 bg-muted rounded-lg">
                      {getFileIcon(selectedFile.file.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold truncate">
                            {selectedFile.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(selectedFile.file.size)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          disabled={isSubmitting}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          {selectedFile.status === "error" && (
                            <Badge variant="destructive" className="text-xs">
                              {selectedFile.error}
                            </Badge>
                          )}

                          {selectedFile.status === "uploaded" && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 text-green-700 border-green-200"
                            >
                              <div className="flex items-center gap-1">
                                <svg
                                  className="size-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Ready
                              </div>
                            </Badge>
                          )}

                          {selectedFile.status === "uploading" && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              <div className="flex items-center gap-1">
                                <Loader2 className="size-3 animate-spin" />
                                Uploading...
                              </div>
                            </Badge>
                          )}

                          {selectedFile.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                            >
                              <div className="flex items-center gap-1">
                                <svg
                                  className="size-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Waiting
                              </div>
                            </Badge>
                          )}
                        </div>

                        {(selectedFile.status === "pending" ||
                          selectedFile.status === "uploading") && (
                          <div className="w-24">
                            <Progress
                              value={selectedFile.uploadProgress}
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errorFiles.length > 0 && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    {errorFiles.length} file(s) failed to upload. Please remove
                    them or try again.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              selectedFiles.length === 0 ||
              pendingFiles.length > 0
            }
            className="flex-1 sm:flex-auto order-1 sm:order-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Upload className="size-4 mr-2" />
                Send{" "}
                {uploadedFiles.length > 0
                  ? `${uploadedFiles.length} file${uploadedFiles.length !== 1 ? "s" : ""}`
                  : "Files"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
