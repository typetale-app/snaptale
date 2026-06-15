import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Editor from "./editor/page";

const rootId = "snaptale-root";

let root: ReturnType<typeof createRoot> | null = null;

function mount(imageUrl: string, onClose: () => void) {
  let elem = document.getElementById(rootId);
  if (!elem) {
    elem = document.createElement("div");
    elem.id = rootId;
    document.body.appendChild(elem);
  }

  root = createRoot(elem);
  root.render(
    <StrictMode>
      <Editor imageUrl={imageUrl} onClose={onClose} />
    </StrictMode>
  );
}

// ─── PostMessage communication with parent ───
function handleClose() {
  window.parent.postMessage({ type: "snaptale:close" }, "*");
}

// Listen for commands from the parent window
window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data.type !== "string") return;

  switch (data.type) {
    case "snaptale:open": {
      const imageUrl = data.imageUrl ?? "";
      mount(imageUrl, handleClose);
      break;
    }
  }
});

// Tell the parent we're ready to receive commands
window.parent.postMessage({ type: "snaptale:ready" }, "*");
