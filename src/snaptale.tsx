import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Editor from "./editor/page";

/**
 * Initializes and mounts the React application.
 * If a container with id 'snaptale-root' does not exist, it is created and appended to the body.
 */
export function init() {
  const rootId = "snaptale-root";
  let elem = document.getElementById(rootId);

  if (!elem) {
    elem = document.createElement("div");
    elem.id = rootId;
    document.body.appendChild(elem);
  }

  const root = createRoot(elem);
  root.render(
    <StrictMode>
      <Editor onClose={() => removeElement('snaptale-root')} />
    </StrictMode>
  );

  return root;
}

function removeElement(elementId: string) {
  const elem = document.getElementById(elementId);
  if (elem) {
    elem.remove();
  }
}

// Expose to window for UMD/Widget usage
if (typeof window !== "undefined") {
  (window as any).pintura = {
    init,
    openDefaultEditor: init,
    closeEditor: () => removeElement('snaptale-root')
  };
}
