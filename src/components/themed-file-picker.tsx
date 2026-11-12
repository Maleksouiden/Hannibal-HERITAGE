"use client";

import { useId, useRef, useState, type ChangeEvent } from "react";

type ThemedFilePickerProps = {
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  buttonLabel?: string;
  onFiles: (files: FileList | null) => void;
  className?: string;
};

export function ThemedFilePicker({
  accept,
  multiple = false,
  disabled = false,
  buttonLabel = "Choose file",
  onFiles,
  className = "",
}: ThemedFilePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) {
      setSelectedLabel(null);
      onFiles(null);
      return;
    }
    if (files.length === 1) {
      setSelectedLabel(files[0]!.name);
    } else {
      setSelectedLabel(`${files.length} files selected`);
    }
    onFiles(files);
    // Allow re-picking the same path later
    event.currentTarget.value = "";
  }

  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className}`}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex min-h-11 items-center justify-center border border-[#1c1917] bg-[#1c1917] px-5 py-3 text-xs tracking-[0.16em] text-[#f7f3ec] uppercase disabled:opacity-50"
      >
        {buttonLabel}
      </button>
      <p className="min-w-0 truncate text-sm text-[#5c564e]">
        {selectedLabel ?? "No file selected"}
      </p>
    </div>
  );
}
