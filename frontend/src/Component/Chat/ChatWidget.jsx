import React, { useEffect, useRef, useState } from 'react';
import { FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useRestaurantAssistant } from '../../hooks/useRestaurantAssistant';
import './ChatWidget.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, loading } = useRestaurantAssistant();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Assistant</h3>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)} aria-label="Close assistant">
              <FaTimes />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-message ${message.role === 'user' ? 'chat-user' : 'chat-assistant'}`}
              >
                <p>{message.content}</p>
              </div>
            ))}
            {loading && (
              <div className="chat-message chat-assistant">
                <p>Typing...</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about reservations or menu..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      <button className="chat-float-btn" onClick={() => setIsOpen((prev) => !prev)} aria-label="Open assistant">
        <FaComments />
      </button>
    </div>
  );
}
