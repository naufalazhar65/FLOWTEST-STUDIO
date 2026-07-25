import { ReactFlowProvider } from "reactflow";
import { Studio } from "./pages/Studio";

function App() {
  return (
    <ReactFlowProvider>
      <Studio />
    </ReactFlowProvider>
  );
}

export default App;