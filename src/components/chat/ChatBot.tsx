// src/components/chat/ChatBot.tsx
import { useEffect } from 'react';

const ChatBot = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
    script.async = true;

    const embed = document.createElement('zapier-interfaces-chatbot-embed');
    embed.setAttribute('is-popup', 'true');
    embed.setAttribute('chatbot-id', 'cmczjaz8l003512wjn7mqbh28'); // ✅ Your actual Zapier Chatbot ID

    document.body.appendChild(script);
    document.body.appendChild(embed);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(embed);
    };
  }, []);

  return null; // Chatbot is mounted globally, no UI needed here
};

export default ChatBot;
