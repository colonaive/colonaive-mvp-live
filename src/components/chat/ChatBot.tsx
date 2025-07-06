import React, { useState, useEffect, useRef } from 'react';
import {
  getChatbotResponse,
} from '../../utils/fuzzyMatch';
import ColonaiveLogo from '../ColonaiveLogo';
import './ChatBot.css';
import { MessageSquare, X } from 'lucide-react'; // Import chat bubble and close icons

// Define the shape of a message - now supporting string[] for text
interface Message {
  id: number;
  text: string | string[] | JSX.Element; // Updated to include string[]
  sender: 'user' | 'bot';
  links?: { text: string; url: string }[];
  urgency?: 'emergency' | 'urgent' | 'routine';
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Set initial welcome message only when the chat window opens and if no messages are present
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 1,
        text: (
          <>
            Hi Champion! I'm here to provide evidence-based information about colorectal cancer screening, symptoms, and prevention. How can I support your health journey today?
            <br /><br />
            <div className="medical-disclaimer-box">
              **Please note:** This chatbot provides educational information only and does not replace professional medical advice. Always consult a qualified healthcare provider.
            </div>
            <br />
            You can ask me things like:
            <ul>
              <li>"What are the symptoms of CRC?"</li>
              <li>"Tell me about colonoscopy."</li>
              <li>"How can I get screened?"</li>
            </ul>
          </>
        ),
        sender: 'bot',
        urgency: 'routine',
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Use a fixed timeout instead of setTimeout to avoid potential memory leaks
    await new Promise(resolve => {
      const timer = window.setTimeout(() => {
        resolve(true);
        clearTimeout(timer);
      }, 1000);
    });

    try {
      const recentUserMessages = messages
  .filter(m => m.sender === 'user')
  .map(m => typeof m.text === 'string' ? m.text : '')
  .filter(Boolean)
  .slice(-5); // keep last 5 messages only

const result = await getChatbotResponse(input.trim(), recentUserMessages);


      // Helper function to render text (string or string[]) as JSX
      const renderText = (content: string | string[] | JSX.Element) => {
        if (Array.isArray(content)) {
          return content.map((paragraph, idx) => (
            <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{paragraph}</p> // Add margin-top for subsequent paragraphs
          ));
        }
        return typeof content === 'string' ? <p>{content}</p> : content;
      };

      let botResponse: Message;
      if (result.type === 'triage') {
        botResponse = {
          id: messages.length + 2,
          text: (
            <>
              {renderText(result.response)}
              {result.links && result.links.length > 0 && (
                <p className="mt-2">
                  Please visit:{' '}
                  {result.links.map((link, index) => (
                    <React.Fragment key={link.url}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
                      {index < result.links.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </p>
              )}
              <div className="medical-disclaimer-box mt-2">
                **Remember:** This chatbot provides educational information only and does not replace professional medical advice. Always consult a qualified healthcare provider.
              </div>
            </>
          ),
          sender: 'bot',
          urgency: result.urgency,
          links: result.links,
        };
      } else { // Handle regular educational responses
        botResponse = {
          id: messages.length + 2,
          text: (
            <>
              {renderText(result.response)}
              {result.links && result.links.length > 0 && (
                <p className="mt-2">
                  {result.links.length > 1 ? 'You can learn more here:' : 'You can learn more here:'}{' '}
                  {result.links.map((link, index) => (
                    <React.Fragment key={link.url}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.text}</a>
                      {index < result.links.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </p>
              )}
              <div className="medical-disclaimer-box mt-2">
                **Disclaimer:** This chatbot provides educational information only and does not replace professional medical advice. Always consult a qualified healthcare provider.
              </div>
            </>
          ),
          sender: 'bot',
          urgency: result.urgency,
          links: result.links,
        };
      }

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error processing message:", error);
      const botResponse: Message = {
        id: messages.length + 2,
        text: (
          <>
            <p>I apologize, Champion, but I'm having a bit of trouble understanding that.</p>
            <p className="mt-2">Please remember, I provide educational information about colorectal cancer and screening. I cannot offer medical advice or diagnosis.</p>
            <p className="mt-2">If you have specific medical concerns, please consult a qualified healthcare provider.</p>
            <p className="mt-2">Would you like to ask something else about CRC or screening?</p>
            <div className="medical-disclaimer-box mt-2">
              **Disclaimer:** This chatbot provides educational information only and does not replace professional medical advice. Always consult a qualified healthcare provider.
            </div>
          </>
        ),
        sender: 'bot',
        urgency: 'routine',
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Icon - visible only when the main chat window is closed */}
      {!isOpen && (
        <button
          className="chatbot-toggle-button"
          onClick={() => setIsOpen(true)}
          aria-label="Chat With Me! Open Chatbot"
          title="Click to ask your questions!" // Standard HTML tooltip (for accessibility)
        >
          <MessageSquare size={24} /> {/* Icon */}
          <span className="chatbot-toggle-text">Chat With Me!</span>
          {/* Callout message on hover */}
          <div className="chatbot-callout">
            Click Me and ask me your doubts or questions!
          </div>
        </button>
      )}

      {/* Main Chatbot Window - visible only when isOpen is true */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            {/* Logo and Assistant Title */}
            <div className="chatbot-logo-text">
                <ColonaiveLogo
                  className="text-sm"
                  baseTextColorClass="text-black"
                  accentColorClass="text-teal-600"
                />
                <span className="assistant-title">CRC Health Assistant</span>
            </div>
            <button className="chatbot-close-button" onClick={() => setIsOpen(false)} aria-label="Close Chat">
              <X size={20} />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message-bubble ${message.sender} ${message.urgency || ''}`}>
                <div className="message-text">
                  {/* Handle different types of message.text */}
                  {Array.isArray(message.text) ? (
                    message.text.map((paragraph, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{paragraph}</p>
                    ))
                  ) : typeof message.text === 'string' ? (
                    <p>{message.text}</p>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message-bubble bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about colorectal cancer screening..."
              disabled={isTyping}
            />
            <button onClick={handleSendMessage} disabled={isTyping || input.trim() === ''}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;