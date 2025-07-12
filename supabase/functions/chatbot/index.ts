// supabase/functions/chatbot/index.ts
import OpenAI from "https://esm.sh/openai@4.63.0";
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock responses for testing
const mockResponses = {
  "what are early signs of colorectal cancer": "Early signs of colorectal cancer may include: changes in bowel habits, blood in stool, persistent abdominal discomfort, unexplained weight loss, and fatigue. However, many of these symptoms can have other causes, so it's important to consult with a healthcare provider for proper evaluation.",
  "what is a colonoscopy": "A colonoscopy is a medical procedure where a doctor uses a flexible tube with a camera to examine the inside of your colon and rectum. It's used for screening, diagnosis, and sometimes treatment of colorectal issues.",
  "default": "I'm here to help with colorectal cancer awareness and support. Could you please rephrase your question or ask about symptoms, screening, prevention, or treatment options?"
};

function getMockResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Find the best matching mock response
  for (const [key, response] of Object.entries(mockResponses)) {
    if (key !== "default" && lowerPrompt.includes(key.toLowerCase())) {
      return response;
    }
  }
  
  return mockResponses.default;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { prompt, useMock = false } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    let reply: string;

    // Check if we should use mock mode or if OpenAI key is missing
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const shouldUseMock = useMock || !apiKey || Deno.env.get("USE_MOCK_MODE") === "true";

    if (shouldUseMock) {
      // Use mock response
      reply = getMockResponse(prompt);
      console.log("Using mock response for prompt:", prompt);
    } else {
      // Use real OpenAI API
      const openai = new OpenAI({ apiKey });

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for colorectal cancer awareness and support.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      reply = completion.choices?.[0]?.message?.content ?? "No reply generated";
    }

    return new Response(
      JSON.stringify({ 
        reply,
        isMocked: shouldUseMock 
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in chatbot function:", error);
    
    // If it's an OpenAI quota/rate limit error, suggest using mock mode
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      const { prompt } = await req.json().catch(() => ({ prompt: "test" }));
      const mockReply = getMockResponse(prompt);
      
      return new Response(
        JSON.stringify({ 
          reply: mockReply,
          isMocked: true,
          note: "OpenAI quota exceeded - using mock response"
        }), 
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});