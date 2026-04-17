import { Button } from "@/components/ui/button";
import { MOCK_DETECTION_RESULT, PROCESSING_STEPS } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  AlertCircle,
  CheckCircle2,
  FileJson,
  FileSpreadsheet,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

export function UploadBox() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setIsProcessing, setDetectionResults, setProcessingProgress } =
    useAppStore();

  const handleFile = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "csv" || ext === "json") {
      setSelectedFile(file);
      setFileError(null);
    } else {
      setFileError(
        `File type ".${ext}" is not supported. Please upload a CSV or JSON file.`,
      );
      setSelectedFile(null);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear drag state if leaving the drop zone itself
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const { clientX, clientY } = e;
    if (
      clientX < rect.left ||
      clientX >= rect.right ||
      clientY < rect.top ||
      clientY >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const runDetection = async () => {
    setIsProcessing(true);
    setProcessingProgress(0, PROCESSING_STEPS[0]);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 2800 / PROCESSING_STEPS.length),
      );
      const pct = Math.round(((i + 1) / PROCESSING_STEPS.length) * 100);
      setProcessingProgress(
        pct,
        PROCESSING_STEPS[Math.min(i + 1, PROCESSING_STEPS.length - 1)],
      );
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 300));
    setDetectionResults(MOCK_DETECTION_RESULT);
    setIsProcessing(false);
  };

  const FileIcon = selectedFile?.name.endsWith(".json")
    ? FileJson
    : FileSpreadsheet;

  return (
    <div className="space-y-5" data-ocid="upload.section">
      {/* Drop zone — label triggers file input click */}
      <label
        htmlFor="file-input"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-ocid="upload.dropzone"
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-10 text-center transition-smooth cursor-pointer select-none overflow-hidden block",
          isDragging
            ? "border-primary bg-primary/10 scale-[1.01] shadow-xl shadow-primary/20"
            : selectedFile
              ? "border-chart-1/50 bg-chart-1/6 cursor-default"
              : "border-border glass-card hover:border-primary/40 hover:bg-muted/30",
          fileError && "border-destructive/50 bg-destructive/5",
        )}
      >
        <input
          ref={inputRef}
          id="file-input"
          type="file"
          accept=".csv,.json"
          className="hidden"
          onChange={handleInputChange}
          data-ocid="upload.file.input"
        />

        {/* Drag overlay pulse */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none rounded-2xl bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12)_0%,transparent_70%)]"
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="selected"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="space-y-4"
            >
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-chart-1/15 flex items-center justify-center">
                  <FileIcon className="w-8 h-8 text-chart-1" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-chart-1 flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              <div>
                <p className="font-display font-semibold text-foreground truncate max-w-xs mx-auto">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Ready to analyze
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  setFileError(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                data-ocid="upload.remove.button"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-smooth px-3 py-1.5 rounded-full hover:bg-destructive/10"
              >
                <X className="w-3.5 h-3.5" />
                Remove file
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <motion.div
                animate={
                  isDragging
                    ? { scale: 1.15, rotate: -5 }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="w-16 h-16 mx-auto rounded-2xl gradient-ai flex items-center justify-center shadow-lg"
              >
                <Upload className="w-8 h-8 text-white" />
              </motion.div>

              <div>
                <p className="font-display font-semibold text-foreground text-lg">
                  {isDragging ? "Release to upload" : "Drop your file here"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or{" "}
                  <span className="text-primary font-medium underline underline-offset-2">
                    click to browse
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                {(
                  [
                    { label: "CSV", Icon: FileSpreadsheet },
                    { label: "JSON", Icon: FileJson },
                  ] as const
                ).map(({ label, Icon }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-card text-xs text-muted-foreground"
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </label>

      {/* File error */}
      <AnimatePresence>
        {fileError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2.5 text-sm text-destructive px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20"
            data-ocid="upload.file.error_state"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{fileError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={runDetection}
        disabled={!selectedFile}
        size="lg"
        data-ocid="upload.check-duplicates.submit_button"
        className="w-full btn-primary border-0 text-primary-foreground disabled:opacity-40"
      >
        Check for Duplicates
      </Button>
    </div>
  );
}
