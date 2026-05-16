import { cn } from "@/lib/utils";

export default function ImageRotateIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4.5", className)}
      viewBox="0 0 24 24"
    >
      <g fill="currentColor">
        <path fill="none" d="M-1-1h582v402H-1z" />
        <rect width="12" height="12" x="3" y="9" rx="1" />
        <path d="M15 5h-1a5 5 0 0 1 5 5 1 1 0 0 0 2 0 7 7 0 0 0-7-7h-1.374l.747-.747A1 1 0 0 0 11.958.84L9.603 3.194a1 1 0 0 0 0 1.415l2.355 2.355a1 1 0 0 0 1.415-1.414l-.55-.55z" />
      </g>
    </svg>
  );
}
