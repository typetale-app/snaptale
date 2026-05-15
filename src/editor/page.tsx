import "../../styles/index.css";
import ImageCropper from "@/components/cropper";

export function App() {
  return (
    <div className="bg-black/90 backdrop-blur-sm z-50 fixed w-full h-full inset-0">
      <ImageCropper imageUrl="https://images.unsplash.com/photo-1778343303023-c6404b185480?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
    </div>
  );
}

export default App;
