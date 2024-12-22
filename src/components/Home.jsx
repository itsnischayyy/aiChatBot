import React from "react";
import axios from "axios";

function Home({ setSessionId }) {
    const startNewSession = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/new_session`,
            {
              headers: {
                'ngrok-skip-browser-warning': 'true', // Add the header with any value
              },
            }
          );
          console.log(response);
          setSessionId(response.data.session_id);
        } catch (error) {
          console.error("Failed to start a new session:", error);
        }
      };

  return (
    <div className="home-container">
      <h1>Welcome to the Chatbot</h1>
      <button onClick={startNewSession} className="start-chat-btn">
        Start New Chat
      </button>
    </div>
  );
}

export default Home;
