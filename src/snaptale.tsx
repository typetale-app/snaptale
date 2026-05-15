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
      <Editor />
    </StrictMode>
  );

  return root;
}

// Expose to window for UMD/Widget usage
if (typeof window !== "undefined") {
  (window as any).pintura = {
    init,
    // Add a fallback if you still have HTML calling the old name
    openDefaultEditor: init,
  };
}

// Auto-initialize when loaded in a browser environment
/*if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}*/
