import "../../styles/index.css";
import ImageEditor from "./ImageEditor";

export default function Editor({ onClose }: { onClose: () => void }) {
  return (
    <div className="dark bg-black/90 backdrop-blur-sm z-50 fixed w-full h-full inset-0 flex items-center justify-center">
      <ImageEditor onClose={onClose}
        imageUrl="https://images.unsplash.com/photo-1778343303023-c6404b185480?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
    </div>
  )
}
