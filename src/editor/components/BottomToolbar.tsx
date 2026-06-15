import React, { useState, useEffect, useCallback, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

export interface ToolbarPage {
  id: string;
  label: string;
  content: ReactNode;
}

interface BottomToolbarProps {
  visible: boolean;
  pages: ToolbarPage[];
}

/**
 * Helper context to let tool content navigate to sub-pages.
 */
export const ToolbarNavContext = React.createContext<{
  navigateTo: (pageId: string) => void;
  goBack: () => void;
}>({
  navigateTo: () => {},
  goBack: () => {},
});

export const useToolbarNav = () => React.useContext(ToolbarNavContext);

/**
 * A generic animated bottom toolbar with page-stack navigation and context provider.
 *
 * - Slides up from the bottom when `visible` becomes true.
 * - The first page in `pages` is the "main" page.
 * - Sub-pages can be pushed via `navigateTo(pageId)`.
 */
export const BottomToolbar: React.FC<BottomToolbarProps> = ({ visible, pages }) => {
  const [activePageIndex, setActivePageIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => setActivePageIndex(0), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const navigateTo = useCallback(
    (pageId: string) => {
      const idx = pages.findIndex((p) => p.id === pageId);
      if (idx !== -1) setActivePageIndex(idx);
    },
    [pages]
  );

  const goBack = useCallback(() => {
    setActivePageIndex(0);
  }, []);

  return (
    <ToolbarNavContext.Provider value={{ navigateTo, goBack }}>
      <div
        className={`flex justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible
            ? "opacity-100 translate-y-0 pb-4"
            : "opacity-0 translate-y-6 pointer-events-none h-0 overflow-hidden"
        }`}
      >
        <div className="bg-[#18181A]/85 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-4">
          <div className="relative overflow-hidden">
            {pages.map((page, index) => (
              <div
                key={page.id}
                className={`transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  index === activePageIndex
                    ? "relative opacity-100 translate-x-0"
                    : "absolute inset-0 opacity-0 pointer-events-none " +
                      (index > activePageIndex
                        ? "translate-x-8"
                        : "-translate-x-8")
                }`}
              >
                <div className="flex items-center min-h-12 py-2 gap-3">
                  {/* Back button for sub-pages */}
                  {index > 0 && index === activePageIndex && (
                    <button
                      onClick={goBack}
                      className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors shrink-0 -ml-1 pr-2"
                    >
                      <ChevronLeft size={16} />
                      <span className="text-[11px] font-medium uppercase tracking-wider">
                        Back
                      </span>
                    </button>
                  )}

                  {/* Sub-page title */}
                  {index > 0 && index === activePageIndex && (
                    <>
                      <div className="w-px h-4 bg-white/10" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80 shrink-0">
                        {page.label}
                      </span>
                      <div className="w-px h-4 bg-white/10" />
                    </>
                  )}

                  {/* Page content */}
                  <div className="flex-1 flex items-center min-w-0">
                    {page.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolbarNavContext.Provider>
  );
};
