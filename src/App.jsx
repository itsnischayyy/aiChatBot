import React, { useState } from "react";
import Home from "./components/Home";
import Chat from "./components/Chat";

function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <div>
      {sessionId ? (
        <Chat sessionId={sessionId} />
      ) : (
        <Home setSessionId={setSessionId} />
      )}
    </div>
  );
}

export default App;
