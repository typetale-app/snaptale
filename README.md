# Snaptale Image Editor

**Snaptale** is a modern, high-performance, web-based interactive image editor. It is designed to run standalone or be embedded inside widgets/UMD scripts (e.g. as a Pintura replacement).

## Why We Built This

While the web is full of rich text editors and simple UI components, **there is a surprising lack of high-quality, open-source image editors**. Many existing solutions rely on heavy, outdated libraries or complex, paid cloud services. **More specifically, there are virtually no modern open-source image editors built to integrate seamlessly with Ghost CMS.**

Snaptale was built to fill this void. It provides a lightweight, blazingly fast, and beautiful client-side image editing experience. It aims to solve the problem of embedding a quick, powerful image editor into existing web applications—like Ghost CMS—without sacrificing performance or modern UI aesthetics. By leveraging HTML5 Canvas via Konva and React, it ensures smooth interactions, crisp rendering, and immediate visual feedback.

## Tech Stack

- **Runtime & Bundler:** [Bun](https://bun.sh/) for ultra-fast dependency resolution and building.
- **Core UI:** React 19 (fully backward compatible with React 18 paradigms).
- **Canvas Rendering:** [Konva](https://konva.js.org/) & [react-konva](https://konva.js.org/docs/react/index.html) for performant 2D canvas manipulation.
- **Styling:** Tailwind CSS combined with Radix UI primitives for accessible, customizable UI components.
- **Icons:** Lucide React.

## Getting Started

### Prerequisites
Make sure you have [Bun](https://bun.sh/) installed on your machine.

### Installation
Clone the repository and install the dependencies:
```bash
bun install
```

### Development
To start the local development server:
```bash
bun run dev
```

### Building from Source
To build the standalone UMD bundle (useful for embedding as a widget):
```bash
bun run build:umd
```

To run TypeScript type-checking without emitting files:
```bash
bun x tsc --noEmit
```

## Architecture Notes
- **State Management:** Centralized in `src/editor/context/EditorContext.tsx`.
- **Decoupling:** UI toolbars do not contain canvas logic. Specialized hooks (`useExport`, `useReset`, `usePreview`) handle operations.
- **Performance:** Minimizes React re-renders and leverages Konva's `batchDraw()` for optimal canvas performance.

## Contributing

We welcome contributions! If you have suggestions for improvements, find any bugs, or want to add new features:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## License

This project is licensed under the [AGPL-3.0 License](https://github.com/typetale-app/snaptale?tab=AGPL-3.0-1-ov-file).

## Sponsors

Development of Snaptale is proudly sponsored by **[typetale.app](https://typetale.app)**.
