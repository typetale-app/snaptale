/**
 * Snaptale Parent SDK
 *
 * This script runs on the HOST page. It creates a fullscreen iframe
 * that loads the Snaptale editor inside an isolated CSS context.
 * Communication happens via postMessage.
 */

import mitt from 'mitt';

const DEMO_IMAGE = "https://images.unsplash.com/photo-1778343303023-c6404b185480?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

interface EditorOptions {
  imageUrl?: string;
  onSave?: (dataUrl: string) => void;
  onClose?: () => void;
}

type EditorEvents = {
  ready: void;
  save: string;
  close: void;
};

/**
 * Build-time constant: the full HTML content of the editor iframe.
 * Injected by build-widget.ts during production builds via Bun's `define`.
 * In dev mode this is undefined, so we fall back to iframe.src = "/editor".
 */
declare const __SNAPTALE_FRAME_HTML__: string | undefined;
const FRAME_HTML = typeof __SNAPTALE_FRAME_HTML__ !== "undefined" ? __SNAPTALE_FRAME_HTML__ : "";

export class SnaptaleEditor {
  private iframe: HTMLIFrameElement;
  private emitter = mitt<EditorEvents>();
  private options: EditorOptions;

  constructor(options: EditorOptions = {}) {
    this.options = options;

    if (options.onSave) this.on("save", options.onSave);
    if (options.onClose) this.on("close", options.onClose);

    this.iframe = document.createElement("iframe");
    this.iframe.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:9999;border:none;background:transparent;";
    
    if (FRAME_HTML) {
      this.iframe.srcdoc = FRAME_HTML;
    } else {
      this.iframe.src = "/editor";
    }

    window.addEventListener("message", this.handleMessage);
  }

  public open() {
    if (!document.body.contains(this.iframe)) {
      document.body.appendChild(this.iframe);
    }
    return this;
  }

  public close() {
    window.removeEventListener("message", this.handleMessage);
    this.emitter.all.clear();
    this.iframe.remove();
  }

  public on<Key extends keyof EditorEvents>(type: Key, handler: (event: EditorEvents[Key]) => void) {
    this.emitter.on(type, handler);
  }

  public off<Key extends keyof EditorEvents>(type: Key, handler: (event: EditorEvents[Key]) => void) {
    this.emitter.off(type, handler);
  }

  private handleMessage = (event: MessageEvent) => {
    const data = event.data;
    if (!data || typeof data.type !== "string") return;

    switch (data.type) {
      case "snaptale:ready":
        this.emitter.emit("ready");
        this.iframe.contentWindow?.postMessage(
          { type: "snaptale:open", imageUrl: this.options.imageUrl ?? DEMO_IMAGE },
          "*"
        );
        break;

      case "snaptale:close":
        this.close();
        this.emitter.emit("close");
        break;

      case "snaptale:save":
        this.emitter.emit("save", data.dataUrl);
        break;
    }
  };
}

// ─── Expose global API ───
let defaultEditorInstance: SnaptaleEditor | null = null;

if (typeof window !== "undefined") {
  (window as any).pintura = {
    openDefaultEditor: (config: EditorOptions) => {
      if (defaultEditorInstance) {
        defaultEditorInstance.close();
      }
      defaultEditorInstance = new SnaptaleEditor(config);
      return defaultEditorInstance.open();
    },
    closeEditor: () => {
      if (defaultEditorInstance) {
        defaultEditorInstance.close();
        defaultEditorInstance = null;
      }
    },
  };
}
