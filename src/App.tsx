import { Suspense } from "react";
import Delay from "./components/Delay";

function Loading() {
  return <div>Loading</div>;
}

function App() {
  return (
    <div style={{ gap: "8px", display: "flex" }}>
      <Suspense fallback={<Loading />}>
        <Delay delay={1250} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <Delay delay={2500} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <Delay delay={5000} />
      </Suspense>
    </div>
  );
}

export default App;
