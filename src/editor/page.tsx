import { Editor } from "@/components/editor";
import "../../styles/index.css";
import { Button } from "@/components/ui/button";

export function App() {
  return (
    <div className="bg-black/60 backdrop-blur-sm z-50 fixed w-full h-full inset-0">
      <button>Hi</button>
      <Button>Hello</Button>
    </div>
  );
}

export default App;
