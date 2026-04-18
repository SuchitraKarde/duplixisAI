import { ManualInputForm } from "@/components/ManualInputForm";
import { ProcessingLoader } from "@/components/ProcessingLoader";
import { ResultsPanel } from "@/components/ResultsPanel";
import { UploadBox } from "@/components/UploadBox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/store/useAppStore";
import { Keyboard, Upload } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type InputMode = "file" | "manual";

export function DetectPage() {
  const [mode, setMode] = useState<InputMode>("file");
  const { isProcessing, detectionResults } = useAppStore();

  // Results view
  if (detectionResults && !isProcessing) {
    return (
      <motion.div
        key="results"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen py-10 bg-background"
        data-ocid="detect.results.page"
      >
        {/* Background accents */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/6 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/6 blur-[100px]" />
        </div>
        <div className="relative z-10">
          <ResultsPanel />
        </div>
      </motion.div>
    );
  }

  // Processing overlay
  if (isProcessing) {
    return (
      <motion.div
        key="processing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-background"
        data-ocid="detect.processing.page"
      >
        {/* Radial glow behind loader */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 bg-primary" />
          </div>
        </div>
        <div className="relative z-10">
          <ProcessingLoader />
        </div>
      </motion.div>
    );
  }

  // Input view
  return (
    <motion.div
      key="input"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background py-8 sm:py-12"
      data-ocid="detect.input.page"
    >
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl space-y-8 px-4 sm:space-y-10 sm:px-6">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 text-center"
        >
          <h1 className="font-display text-3xl font-bold sm:text-5xl">
            Find <span className="text-accent-ai">Duplicates</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
            Upload a CSV/JSON file or enter a record manually to detect
            cross-language duplicates using semantic AI.
          </p>
        </motion.div>

        {/* Mode tab toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center"
        >
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as InputMode)}
            className="w-full sm:w-auto"
          >
            <TabsList
              className="grid w-full grid-cols-1 gap-1 p-1 glass-card sm:inline-flex sm:w-auto sm:grid-cols-none"
              data-ocid="detect.mode.tab"
            >
              <TabsTrigger
                value="file"
                className="flex items-center justify-center gap-2 whitespace-normal px-4 py-2.5 text-center data-[state=active]:gradient-ai data-[state=active]:text-white transition-smooth"
                data-ocid="detect.mode.file.tab"
              >
                <Upload className="w-4 h-4" />
                File Upload
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="flex items-center justify-center gap-2 whitespace-normal px-4 py-2.5 text-center data-[state=active]:gradient-ai data-[state=active]:text-white transition-smooth"
                data-ocid="detect.mode.manual.tab"
              >
                <Keyboard className="w-4 h-4" />
                Manual Entry
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Content panel — animated tab switch */}
        <AnimatePresence mode="wait">
          {mode === "file" ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.28 }}
            >
              <UploadBox />
            </motion.div>
          ) : (
            <motion.div
              key="manual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
            >
              <ManualInputForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
