// src/components/ChatbotComponent.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getChatbotResponse, ChatbotResponse } from '../utils/getChatbotResponse';
import './Chatbot.css'; // Create this CSS file

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isMocked?: boolean;
  timestamp: Date;
}

// Custom hook for chatbot functionality
function useChatbot() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    prompt: string, 
    useMock: boolean = false
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getChatbotResponse(prompt, { useMock });
      
      if (response.error) {
        setError(response.error);
        return response.reply; // Still return the reply (might be fallback)
      }

      return response.reply;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return "Sorry, I couldn't process your message.";
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}

export function ChatbotComponent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to help with colorectal cancer awareness and support. Feel free to ask about symptoms, screening procedures, prevention tips, or any concerns you might have.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [useMockMode, setUseMockMode] = useState(true);
  
  const { sendMessage, isLoading, error, clearError } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    const reply = await sendMessage(userMessage.text, useMockMode);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: reply,
      isUser: false,
      isMocked: useMockMode,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exampleQuestions = [
    "What are early signs of colorectal cancer?",
    "What is a colonoscopy?",
    "How can I prevent colon cancer?",
    "When should I get screened?",
    "What are the risk factors?"
  ];

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <h2>🩺 Colorectal Cancer Support</h2>
        <p>Ask me about symptoms, screening, or prevention</p>
        <div className="mock-toggle">
          <input
            type="checkbox"
            id="mockMode"
            checked={useMockMode}
            onChange={(e) => setUseMockMode(e.target.checked)}
          />
          <label htmlFor="mockMode">
            Test Mode (Mock Responses)
          </label>
        </div>
      </div>

      {/* Mock Mode Indicator */}
      {useMockMode && (
        <div className="mock-indicator">
          🧪 Currently using test responses - no API costs
        </div>
      )}

      {!useMockMode && (
        <div className="live-indicator">
          🔴 LIVE MODE - Using real OpenAI API (costs money)
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message" onClick={clearError}>
          {error} (click to dismiss)
        </div>
      )}

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isUser ? 'user' : 'bot'} ${
              message.isMocked ? 'mocked' : ''
            }`}
          >
            <div className="message-content">
              <strong>
                {message.isUser ? 'You:' : 'Support Bot:'}
              </strong>{' '}
              {message.text}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="message bot typing">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Example Questions */}
      <div className="example-questions">
        <p>Try asking:</p>
        <div className="question-buttons">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              className="example-button"
              onClick={() => setInputText(question)}
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about colorectal cancer, symptoms, screening..."
          disabled={isLoading}
          maxLength={500}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}