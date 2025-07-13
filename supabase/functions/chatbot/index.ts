// supabase/functions/chatbot/index.ts
import OpenAI from "https://esm.sh/openai@4.63.0";
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced knowledge base with local context
const knowledgeBase = {
  // Symptoms and early signs
  "early signs|symptoms|warning signs": `Early signs of colorectal cancer may include:
• Changes in bowel habits (diarrhea, constipation, or both)
• Blood in stool (red or black/tarry)
• Persistent abdominal discomfort, cramps, or pain
• Unexplained weight loss
• Fatigue or feeling weak
• Feeling that bowel doesn't empty completely

⚠️ Important: Many of these symptoms can have other causes, so please consult a healthcare provider for proper evaluation.`,

  // Colonoscopy information
  "colonoscopy|scope|camera test": `A colonoscopy is the **gold standard** for colorectal cancer detection because:
🔍 **Direct visual check** - Doctors can see the entire colon and rectum
🧽 **Immediate polyp removal** - Pre-cancerous growths removed on the spot
🎯 **Highly accurate** - Detects even small lesions other tests might miss

💡 If you're scared or uncomfortable, there are now **HSA-cleared blood tests** available in Singapore to help triage who needs colonoscopy. Learn more: https://www.colonaive.ai/get-screened`,

  // Screening options
  "screening|blood test|fit test": `In Singapore, you have several screening options:
🧪 **HSA-cleared blood tests** - More sensitive than stool tests, non-invasive
🚽 **FIT (stool) tests** - Check for hidden blood in stool
🔬 **Colonoscopy** - Gold standard for detection and prevention

Blood-based tests are great for people who feel "mafan" about other tests or are scared of colonoscopy. They help identify who needs follow-up colonoscopy.`,

  // Prevention and lifestyle
  "prevent|prevention|lifestyle|diet": `You can reduce your colorectal cancer risk by:
🥗 **Healthy diet** - More fruits, vegetables, whole grains; less red/processed meat
🏃 **Regular exercise** - At least 150 minutes moderate activity per week
🚭 **Don't smoke** - Smoking increases CRC risk
🍺 **Limit alcohol** - Especially important for men
⚖️ **Maintain healthy weight** - Obesity increases risk

📅 **Regular screening** starting at age 40-50 (or earlier with family history) is still the best prevention!`,

  // Local/Singlish responses
  "scared|afraid|fear|mafan|expensive|paiseh": `Eh, don't paiseh about getting checked! Many Singaporeans feel the same way. Here's what you should know:

😰 **Scared of colonoscopy?** Try HSA-cleared blood tests first - just a simple clinic visit
💰 **Worried about cost?** Many screening options now more accessible, and early detection saves money (and life!) long-term
🙈 **Feel mafan?** Better to spend small time now than big problems later, Champion

Remember: **No pain, no blood ≠ no problem**. Early cancer often has no symptoms!`,

  // Urgency and red flags
  "blood|bleeding|red flag|urgent|pain": `🚨 **These symptoms need prompt medical attention:**
• Blood in stool (red or black)
• Unexplained weight loss
• Persistent abdominal pain
• Changes in bowel habits lasting weeks
• Persistent fatigue/anemia
• Family history of young-onset CRC

⏱️ Please don't delay - consult a doctor ASAP. Early diagnosis saves lives!
If no urgent symptoms, you can start with screening: https://www.colonaive.ai/get-screened`,

  // Default helpful response
  "default": `I'm here to help with colorectal cancer awareness and support, Champion! I can share info about:
• **Symptoms** and warning signs to watch for
• **Screening options** (colonoscopy, blood tests, FIT)
• **Prevention** through lifestyle changes
• **Local resources** in Singapore

Ask me anything specific, or check: https://www.colonaive.ai/get-screened 💪`
};

function getEnhancedResponse(prompt: string, conversationHistory: string[] = []): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Check for local slang and colloquialisms
  if (lowerPrompt.includes('wah') || lowerPrompt.includes('kena cancer')) {
    return `Wah, I understand you're feeling worried about cancer. If you or someone you know has been diagnosed, it's important to speak to a doctor about next steps. If you're just checking, screening is the best way to detect problems early. Want to explore your options? 👉 https://www.colonaive.ai/get-screened`;
  }
  
  if (lowerPrompt.includes('aiyo') || lowerPrompt.includes('scared') || lowerPrompt.includes('colonoscopy')) {
    return `Aiyo, you're not alone! Many people feel scared about colonoscopy. Good news - there are now **HSA-cleared blood tests** that are more sensitive than stool tests. If you're eligible, you can start with a blood test and only go for colonoscopy if needed. 👉 https://www.colonaive.ai/get-screened`;
  }
  
  if (lowerPrompt.includes('backside') || lowerPrompt.includes('pull out')) {
    return `😅 We get that question often! Colonoscopy is thorough because it can detect AND remove polyps at the same time. But if you're not ready, there are HSA-cleared blood tests to help screen first. You don't need to wait until symptoms appear. 👉 https://www.colonaive.ai/get-screened`;
  }
  
  if (lowerPrompt.includes('young') || lowerPrompt.includes('don\'t need')) {
    return `Actually, colorectal cancer is rising among younger Singaporeans, even those in 30s and 40s. If you have family history or symptoms like blood in stool, bloating, or tiredness, please don't wait. Better to screen early and stay safe, Champion! 👉 https://www.colonaive.ai/get-screened`;
  }
  
  if (lowerPrompt.includes('mafan') || lowerPrompt.includes('how long') || lowerPrompt.includes('wait')) {
    return `Screening is actually quite fast and easy now. Blood-based tests just need a simple clinic visit. Colonoscopy takes time, but it may save your life. Screening doesn't have to be mafan - we're here to help you get started! 😊`;
  }
  
  if (lowerPrompt.includes('expensive') || lowerPrompt.includes('how much') || lowerPrompt.includes('cost')) {
    return `Prices vary depending on clinic and type of test. Blood-based screening is now more accessible and supported by many clinics. Think about it - early screening costs much less than treating advanced cancer. Want help finding options? 👉 https://www.colonaive.ai/get-screened`;
  }
  
  if (lowerPrompt.includes('no pain') || lowerPrompt.includes('no blood') || lowerPrompt.includes('okay right')) {
    return `Not always, Champion. Many early-stage cancers don't cause pain or visible symptoms. That's why regular screening is important - to catch it before it's too late. Better safe than sorry! 🙏`;
  }
  
  // Check knowledge base
  for (const [keywords, response] of Object.entries(knowledgeBase)) {
    if (keywords !== 'default') {
      const keywordList = keywords.split('|');
      if (keywordList.some(keyword => lowerPrompt.includes(keyword.toLowerCase()))) {
        return response;
      }
    }
  }
  
  return knowledgeBase.default;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, conversationHistory = [], useMock = false } = await req.json();
    
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
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const shouldUseMock = useMock || !apiKey || Deno.env.get("USE_MOCK_MODE") === "true";

    if (shouldUseMock) {
      // Use enhanced knowledge base
      reply = getEnhancedResponse(prompt, conversationHistory);
      console.log("Using enhanced knowledge base for prompt:", prompt);
    } else {
      // Use real OpenAI API with enhanced context
      const openai = new OpenAI({ apiKey });
      
      // Build conversation context
      const messages = [
        {
          role: "system",
          content: `You are COLONAiVE™ Support Bot, a helpful assistant for colorectal cancer awareness in Singapore. 

Key guidelines:
- Use warm, encouraging tone and call users "Champion"
- Understand local expressions (wah, aiyo, mafan, paiseh, kena, anot)
- Promote early screening and awareness
- Direct users to https://www.colonaive.ai/get-screened for screening options
- Emphasize that Singapore has HSA-cleared blood tests available
- Be sensitive about fears and cultural concerns
- For urgent symptoms (blood, weight loss, persistent pain), recommend immediate medical consultation
- For general questions, provide helpful education while encouraging screening

Remember: You're here to support and educate, not diagnose. Always encourage professional medical consultation for specific health concerns.`
        }
      ];
      
      // Add conversation history
      conversationHistory.slice(-8).forEach((msg, index) => {
        messages.push({
          role: index % 2 === 0 ? "user" : "assistant",
          content: msg
        });
      });
      
      // Add current prompt
      messages.push({
        role: "user",
        content: prompt
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 600,
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
    
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      const { prompt, conversationHistory } = await req.json().catch(() => ({ prompt: "test", conversationHistory: [] }));
      const mockReply = getEnhancedResponse(prompt, conversationHistory);
      
      return new Response(
        JSON.stringify({ 
          reply: mockReply,
          isMocked: true,
          note: "OpenAI quota exceeded - using enhanced knowledge base"
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