import React, { useState, useRef, useEffect } from "react";
import "./ChatBox.css";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setMessages((prevMessages) => [...prevMessages, { text: message, type: "user" }]);

      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Server response was not ok");

      const data = await res.json();
      setMessages((prevMessages) => [...prevMessages, { text: data.response, type: "bot" }]);
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error connecting to server. Please try again.", type: "bot" },
      ]);
    }
  };

  return React.createElement("div", { className: "chat-box" }, [
    React.createElement("div", { className: "chat-messages", key: "messages" }, [
      ...messages.map((msg, index) =>
        React.createElement(
          "div",
          {
            key: index,
            className: `message ${msg.type}`,
          },
          React.createElement(
            "span",
            {
              className: "message-text",
            },
            msg.text
          )
        )
      ),
      React.createElement("div", {
        key: "scroll-anchor",
        ref: messagesEndRef,
      }),
    ]),
    React.createElement(
      "form",
      {
        className: "chat-input",
        onSubmit: handleSubmit,
        key: "input-form",
      },
      [
        React.createElement("input", {
          key: "text-input",
          type: "text",
          value: message,
          onChange: (e) => setMessage(e.target.value),
          placeholder: "Type your message...",
          className: "chat-input-field",
        }),
        React.createElement(
          "button",
          {
            key: "submit-button",
            type: "submit",
            className: "send-button",
          },
          "Send"
        ),
      ]
    ),
  ]);
};

export default ChatBox;
