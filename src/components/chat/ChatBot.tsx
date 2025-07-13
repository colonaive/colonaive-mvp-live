// src/components/chat/ChatBot.tsx
import React, { useState, useEffect, useRef } from 'react';
import { getChatbotResponse } from '../../utils/getChatbotResponse';
import { parseLinksInText } from '../../utils/linkParser'; // Import the link parser
import { MessageSquare, X } from 'lucide-react';
import './ChatBot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isMocked?: boolean;
  timestamp?: Date;
}

const ChatBot: React.FC = () => {
  console.log("Intelligent ChatBot component is rendering!"); // Debug line
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: `Hi Champion! I'm COLONAiVE™ Support Bot. I understand Singlish and I'm here to support your journey with colorectal cancer info. Ask me anything about symptoms, screening (colonoscopy or blood tests), or next steps. Don't paiseh! 💪`,
          sender: 'bot',
          timestamp: new Date()
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      // Get last 5 user messages for context
      const last5UserMsgs = messages
        .filter((m) => m.sender === 'user')
        .slice(-5)
        .map((m) => m.text);

      const result = await getChatbotResponse(newMessage.text, last5UserMsgs);

      const botMessage: Message = {
        id: newMessage.id + 1,
        text: result.response,
        sender: 'bot',
        isMocked: result.isMocked,
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, botMessage]);
      
      if (result.error) {
        setError(`Connection issue: ${result.error}`);
        setTimeout(() => setError(null), 5000);
      }
      
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: newMessage.id + 1,
        text: "Aiyo, I'm having trouble responding right now. Please try again later, Champion! 😅",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError('Failed to connect to chat service');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What are early signs of colorectal cancer?",
    "I scared of colonoscopy, got other options?",
    "How much screening costs in Singapore?",
    "Still young lah, need to screen anot?",
    "What's the difference between FIT and blood test?"
  ];

  return (
    <>
      {!isOpen && (
        <button 
          className="chatbot-toggle-button" 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 99999,
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            padding: '15px 20px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          <MessageSquare size={20} />
          <span className="chatbot-toggle-text">Chat With Me!</span>
        </button>
      )}

      {isOpen && (
        <div 
          className="chatbot-container"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 99998,
            width: '400px',
            height: '600px',
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
          }}
        >
          {/* Header */}
          <div className="chatbot-header" style={{
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span className="chatbot-title" style={{ fontSize: '1.2em', fontWeight: '600' }}>
                COLONAiVE™ ChatBot
              </span>
              <div style={{ fontSize: '0.9em', opacity: 0.9, marginTop: '5px' }}>
                Understands Singlish • Local Context
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              background: '#fff3cd',
              borderLeft: '4px solid #ffc107',
              color: '#856404',
              padding: '10px 16px',
              fontSize: '14px',
              cursor: 'pointer'
            }} onClick={() => setError(null)}>
              {error} (click to dismiss)
            </div>
          )}

          {/* Messages */}
          <div className="chatbot-messages" style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa'
          }}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`message-bubble ${msg.sender}`}
                style={{
                  marginBottom: '15px',
                  padding: '12px 16px',
                  borderRadius: '15px',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                  ...(msg.sender === 'user' ? {
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    marginLeft: 'auto',
                    textAlign: 'right' as const
                  } : {
                    background: msg.isMocked ? '#fff8e1' : 'white',
                    color: '#333',
                    border: `1px solid ${msg.isMocked ? '#ffcc02' : '#e0e0e0'}`,
                    marginRight: 'auto'
                  })
                }}
              >
                {/* UPDATED: Parse links in bot messages */}
                {msg.sender === 'bot' ? (
                  <div style={{ margin: 0, lineHeight: 1.4 }}>
                    {parseLinksInText(msg.text)}
                  </div>
                ) : (
                  <p style={{ margin: 0, lineHeight: 1.4 }}>{msg.text}</p>
                )}
                
                {msg.timestamp && (
                  <div style={{
                    fontSize: '10px',
                    opacity: 0.7,
                    marginTop: '5px',
                    textAlign: msg.sender === 'user' ? 'left' : 'right'
                  }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="message-bubble bot typing" style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '15px',
                padding: '12px 16px',
                marginRight: 'auto',
                maxWidth: '80px'
              }}>
                <div className="typing-dots" style={{ display: 'flex', gap: '4px' }}>
                  <span className="typing-dot" style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#999',
                    animation: 'bounce 1.4s infinite ease-in-out'
                  }}></span>
                  <span className="typing-dot" style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#999',
                    animation: 'bounce 1.4s infinite ease-in-out',
                    animationDelay: '-0.32s'
                  }}></span>
                  <span className="typing-dot" style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#999',
                    animation: 'bounce 1.4s infinite ease-in-out',
                    animationDelay: '-0.16s'
                  }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div style={{
              padding: '15px 20px',
              background: '#f0f2f5',
              borderTop: '1px solid #e0e0e0'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#666', fontWeight: '500' }}>
                Try asking:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    disabled={isTyping}
                    style={{
                      background: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: '#333',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="chatbot-input-area" style={{
            padding: '20px',
            background: 'white',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              placeholder="Ask me anything about CRC..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '25px',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button 
              onClick={handleSend} 
              disabled={isTyping || !input.trim()}
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                minWidth: '70px',
                opacity: (isTyping || !input.trim()) ? 0.6 : 1
              }}
            >
              {isTyping ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        .chatbot-toggle-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 25px rgba(76, 175, 80, 0.6) !important;
        }
        
        @media (max-width: 480px) {
          .chatbot-container {
            bottom: 10px !important;
            right: 10px !important;
            left: 10px !important;
            width: calc(100% - 20px) !important;
            height: 70vh !important;
          }
        }
      `}</style>
    </>
  );
};

export default ChatBot;