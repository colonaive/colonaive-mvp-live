import React, { useState, useEffect, useRef } from 'react';
import { getChatbotResponse } from '../../utils/getChatbotResponse'; // GPT-4 logic
import { MessageSquare, X } from 'lucide-react';
import './ChatBot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: `Hi Champion! I'm here to support your journey with colorectal cancer info. Ask me anything about symptoms, screening (e.g. colonoscopy or blood tests), or next steps. 💪`,
          sender: 'bot',
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input.trim(),
      sender: 'user',
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    const last5UserMsgs = messages
      .filter((m) => m.sender === 'user')
      .slice(-5)
      .map((m) => m.text);

    const result = await getChatbotResponse(newMessage.text, last5UserMsgs);

    const botMessage: Message = {
      id: newMessage.id + 1,
      text: result.response,
      sender: 'bot',
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle-button" onClick={() => setIsOpen(true)}>
          <MessageSquare size={20} />
          <span className="chatbot-toggle-text">Chat With Me!</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span className="chatbot-title">COLONAiVE™ ChatBot</span>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className="message-bubble bot typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Ask me anything about CRC..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <button onClick={handleSend} disabled={isTyping || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
