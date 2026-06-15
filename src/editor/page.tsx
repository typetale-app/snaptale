import "../../styles/index.css";
import ImageEditor from "./ImageEditor";

interface EditorProps {
  onClose: () => void;
  imageUrl: string;
}

export default function Editor({ onClose, imageUrl }: EditorProps) {
  return (
    <div className="dark bg-black/90 backdrop-blur-sm z-50 fixed w-full h-full inset-0 flex items-center justify-center">
      <ImageEditor onClose={onClose} imageUrl={imageUrl} />
    </div>
  )
}
