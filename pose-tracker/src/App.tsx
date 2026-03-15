import { useState } from "react";
import Landing from "./pages/Landing";
import Demos from "./pages/Demo";
import DanceSelector from "./pages/DanceSelector";
import Profile from "./pages/Profile"


function App() {
  const [page, setPage] = useState("landing");

  if (page === "dance") {
    return <DanceSelector setPage={setPage} />;
  }

  if (page === "demo") {
    return <Demos setPage={setPage} />;
  }

  if (page === "profile") {
    return <Profile setPage={setPage}/>;
  }

  return <Landing setPage={setPage} />;
}

export default App;