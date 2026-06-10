import React, { useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewModalProps {
  dataUrl: string | null;
  onClose: () => void;
  onDownload: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ dataUrl, onClose, onDownload }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!dataUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ animation: "fadeIn 0.18s ease" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal card */}
      <div
        className="relative z-10 flex flex-col items-center gap-4 p-5 rounded-3xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
        style={{
          background: "linear-gradient(145deg, rgba(28,28,32,0.97) 0%, rgba(18,18,22,0.99) 100%)",
          maxWidth: "90vw",
          maxHeight: "90vh",
          animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <span className="text-white/70 text-sm font-semibold tracking-wide">Preview</span>
          <div className="flex items-center gap-1">
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              title="Close preview"
              className="h-8 w-8 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="overflow-hidden ring-1 ring-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          style={{ maxWidth: "80vw", maxHeight: "75vh" }}>
          <img
            src={dataUrl}
            alt="Preview"
            style={{
              display: "block",
              maxWidth: "80vw",
              maxHeight: "75vh",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>
    </div>
  );
};
