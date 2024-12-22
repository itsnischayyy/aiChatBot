import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function Chat({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [instructionId, setInstructionId] = useState("1"); // Default instruction ID
  const [customInstruction, setCustomInstruction] = useState(""); // State for manual input
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
      const selectedInstructionId = customInstruction || instructionId; // Use custom input if provided
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        session_id: sessionId,
        instruction_id: selectedInstructionId,
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (e.g., new line)
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="instruction-select">
        <label>Select or Enter Instruction Set:</label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <select
            value={instructionId}
            onChange={(e) => {
              setInstructionId(e.target.value);
              setCustomInstruction(""); // Clear custom input when dropdown is used
            }}
          >
            <option value="1">Xtreme Hotel</option>
            <option value="2">TrackGaddi</option>
            <option value="3">Xtreme Thoughts</option>
          </select>
          <input
            type="number"
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            placeholder="Enter ID"
            style={{ width: "100px", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>
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
