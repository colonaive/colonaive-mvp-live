// getChatbotResponse.ts
interface ChatbotResponse {
  reply: string;
  isMocked?: boolean;
  note?: string;
  error?: string;
  details?: string;
}

interface ChatbotRequest {
  prompt: string;
  useMock?: boolean;
}

const SUPABASE_FUNCTION_URL = "https://irkfrlvddkyjziuvrisb.supabase.co/functions/v1/chatbot";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz..."; // Your anon key

export async function getChatbotResponse(
  prompt: string, 
  options: { useMock?: boolean; timeout?: number } = {}
): Promise<ChatbotResponse> {
  const { useMock = false, timeout = 10000 } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        useMock
      } as ChatbotRequest),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatbotResponse = await response.json();
    return data;

  } catch (error) {
    console.error("Error calling chatbot:", error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          reply: "Request timed out. Please try again.",
          error: "timeout"
        };
      }
      
      return {
        reply: "Sorry, I'm having trouble responding right now. Please try again later.",
        error: error.message
      };
    }

    return {
      reply: "An unexpected error occurred.",
      error: "unknown"
    };
  }
}

// React Hook for easier usage
import { useState, useCallback } from 'react';

export function useChatbot() {
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

// Example React Component
export function ChatbotExample() {
  const { sendMessage, isLoading, error } = useChatbot();
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [input, setInput] = useState('');
  const [useMockMode, setUseMockMode] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');

    const reply = await sendMessage(userMessage, useMockMode);
    setMessages(prev => [...prev, { text: reply, isUser: false }]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Colorectal Cancer Support Chatbot</h3>
        <label>
          <input
            type="checkbox"
            checked={useMockMode}
            onChange={(e) => setUseMockMode(e.target.checked)}
          />
          Use Mock Mode (for testing)
        </label>
      </div>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
            <strong>{msg.isUser ? 'You:' : 'Bot:'}</strong> {msg.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Bot is typing...</div>}
        {error && <div className="error">Error: {error}</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about colorectal cancer..."
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}