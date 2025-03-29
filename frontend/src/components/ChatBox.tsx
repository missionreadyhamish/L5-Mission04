import React, { useState } from "react";
import "./ChatBox.css";

const ChatBox = () => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: "user" }]);
      setInputMessage("");
      // Here you can add logic to handle bot responses
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
