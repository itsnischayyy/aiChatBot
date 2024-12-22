import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Chat({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [instructionId, setInstructionId] = useState("1"); // Default instruction ID
  const [sending, setSending] = useState(false); // State to track if a message is being sent

  const chatBoxRef = useRef(null); // Reference for the chat box

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever messages change
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return; // Prevent sending if input is empty or message is being sent

    const userMessage = { sender: "User", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setSending(true); // Disable sending until response is received

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        session_id: sessionId,
        instruction_id: instructionId,
        question: input,
      });

      const botMessage = { sender: "Bot", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    setInput("");
    setSending(false); // Re-enable sending after response is received
  };

  // Function to handle "Enter" key press
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (e.g., new line)
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="instruction-select">
        <label>Select Instruction Set:</label>
        <select
          value={instructionId}
          onChange={(e) => setInstructionId(e.target.value)}
        >
          <option value="1">Xtreme Hotel</option>
          <option value="2">TrackGaddi</option>
          <option value="3">Xtreme Thoughts</option>
        </select>
      </div>
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "User" ? "user" : "bot"}`}
          >
            <strong>{msg.sender}:</strong> <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Listen for key presses
          placeholder="Type your message..."
          disabled={sending} // Disable input while sending
        />
        <button onClick={sendMessage} disabled={sending}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
