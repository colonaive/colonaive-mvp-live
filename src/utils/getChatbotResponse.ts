// src/utils/getChatbotResponse.ts
export interface ChatbotResponse {
  reply: string;
  isMocked?: boolean;
  note?: string;
  error?: string;
  details?: string;
}

export interface ChatbotRequest {
  prompt: string;
  useMock?: boolean;
}

const SUPABASE_FUNCTION_URL = "https://irkfrlvddkyjziuvrisb.supabase.co/functions/v1/chatbot";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz..."; // Your anon key

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