import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  LANGUAGE_OPTIONS,
  PROCESSING_STEPS,
} from "@/data/mockData";
import { detectDuplicatesFromManual } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import type { Language } from "@/types";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface FormData {
  name: string;
  description: string;
  language: Language;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const selectedLangOption = (lang: Language) =>
  LANGUAGE_OPTIONS.find((l) => l.code === lang);

export function ManualInputForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    language: "en",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});
  const { setIsProcessing, setDetectionResults, setProcessingProgress } =
    useAppStore();

  const validate = (data = form): FormErrors => {
    const errs: FormErrors = {};
    if (!data.name.trim()) errs.name = "Record name is required";
    if (!data.description.trim()) errs.description = "Description is required";
    return errs;
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, description: true });
    if (Object.keys(errs).length > 0) return;

    setIsProcessing(true);
    setProcessingProgress(5, PROCESSING_STEPS[0]);

    const progressTimer = window.setInterval(() => {
      useAppStore.setState((state) => {
        const next = Math.min(state.processingProgress + 14, 92);
        const stepIndex = Math.min(
          Math.floor((next / 100) * PROCESSING_STEPS.length),
          PROCESSING_STEPS.length - 1,
        );
        return {
          processingProgress: next,
          processingStep: PROCESSING_STEPS[stepIndex],
        };
      });
    }, 350);

    try {
      const result = await detectDuplicatesFromManual(form);
      window.clearInterval(progressTimer);
      setProcessingProgress(100, "Finalizing report...");
      setDetectionResults(result);
      setIsProcessing(false);
    } catch (error) {
      window.clearInterval(progressTimer);
      setIsProcessing(false);
      setProcessingProgress(0, "");
      toast.error("Detection failed", {
        description:
          error instanceof Error ? error.message : "Detection failed.",
      });
    }
  };

  const currentLang = selectedLangOption(form.language);

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="glass-card space-y-6 rounded-2xl p-5 sm:p-8"
      data-ocid="manual-input.form"
    >
      {/* Record Name */}
      <div className="space-y-2">
        <Label htmlFor="record-name" className="text-sm font-medium">
          Record Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="record-name"
          placeholder="e.g. John Doe — 123 Main St, Springfield"
          value={form.name}
          onChange={(e) => {
            setForm((f) => ({ ...f, name: e.target.value }));
            if (touched.name)
              setErrors(validate({ ...form, name: e.target.value }));
          }}
          onBlur={() => handleBlur("name")}
          data-ocid="manual-input.name.input"
          className={
            touched.name && errors.name
              ? "border-destructive focus-visible:ring-destructive/30"
              : ""
          }
        />
        {touched.name && errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-destructive flex items-center gap-1"
            data-ocid="manual-input.name.field_error"
          >
            {errors.name}
          </motion.p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="record-description" className="text-sm font-medium">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="record-description"
          placeholder="Brief description of the record, including any identifying details..."
          value={form.description}
          onChange={(e) => {
            setForm((f) => ({ ...f, description: e.target.value }));
            if (touched.description)
              setErrors(validate({ ...form, description: e.target.value }));
          }}
          onBlur={() => handleBlur("description")}
          data-ocid="manual-input.description.textarea"
          className={`resize-none min-h-[110px] ${touched.description && errors.description ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
        />
        {touched.description && errors.description && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-destructive"
            data-ocid="manual-input.description.field_error"
          >
            {errors.description}
          </motion.p>
        )}
      </div>

      {/* Language selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Language</Label>
        <Select
          value={form.language}
          onValueChange={(v) =>
            setForm((f) => ({ ...f, language: v as Language }))
          }
        >
          <SelectTrigger
            data-ocid="manual-input.language.select"
            className="w-full"
          >
            <SelectValue>
              {currentLang ? (
                <span className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">
                    {currentLang.flag}
                  </span>
                  <span>{currentLang.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {currentLang.nativeName}
                  </span>
                </span>
              ) : (
                "Select language"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">{lang.flag}</span>
                  <span>{lang.label}</span>
                  <span className="text-muted-foreground text-xs ml-1">
                    {lang.nativeName}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          The primary language of the record — cross-language duplicates will
          still be detected.
        </p>
      </div>

      <Button
        type="submit"
        size="lg"
        data-ocid="manual-input.submit_button"
        className="w-full btn-primary border-0 text-primary-foreground"
      >
        Check for Duplicates
      </Button>
    </motion.form>
  );
}
