// /home/project/src/utils/knowledge/general.ts
// This file contains general CRC information, prevention, risk factors, and chatbot conversational elements.

import { KnowledgeEntry } from '../fuzzyMatch'; // Import the interface from fuzzyMatch.ts

export const generalKnowledge: KnowledgeEntry[] = [
  {
    category: 'General',
    keywords: ['colorectal cancer', 'crc', 'what is crc', 'colon cancer', 'rectal cancer', 'large bowel cancer'],
    intent: 'what_is_crc',
    question: 'What is colorectal cancer?',
    response: 'Colorectal cancer (CRC) is a cancer that starts in the colon or rectum. It is often preventable and, if detected early, highly treatable. Regular screening is key!',
    links: [{ text: 'Learn more about CRC', url: '/education/patients' }],
  },
  {
    category: 'Prevention',
    keywords: ['prevention', 'prevent crc', 'reduce risk', 'avoid colon cancer'],
    intent: 'crc_prevention',
    question: 'How can I prevent colorectal cancer?',
    response: 'While some risk factors for CRC are unchangeable (like age or genetics), you can reduce your risk through lifestyle choices such as maintaining a healthy weight, regular physical activity, a diet rich in fruits, vegetables, and whole grains, limiting red and processed meats, and avoiding excessive alcohol and smoking.',
    links: [{ text: 'Patient Education', url: '/education/patients' }],
  },
  {
    category: 'Risk Factors',
    keywords: ['risk factors', 'who is at risk', 'risk of crc', 'what increases crc risk'],
    intent: 'crc_risk_factors',
    question: 'What are the risk factors for CRC?',
    response: 'Risk factors for colorectal cancer include age (risk increases with age), personal or family history of CRC or polyps, certain inherited genetic syndromes, inflammatory bowel disease (like Crohn\'s or ulcerative colitis), and lifestyle factors such as obesity, physical inactivity, smoking, heavy alcohol use, and a diet high in red and processed meats.',
    links: [{ text: 'Patient Education', url: '/education/patients' }],
  },
  {
    category: 'Doctor Consultation',
    keywords: ['consult doctor', 'see doctor', 'talk to doctor', 'when to see doctor', 'should I see a doctor', 'doctor visit'],
    intent: 'consult_doctor',
    question: 'When should I consult a doctor?',
    response: 'You should consult a doctor if you experience any persistent symptoms that concern you, if you have a family history of CRC, or if you are due for screening based on your age or risk profile. Only a qualified healthcare professional can provide a diagnosis and recommend appropriate medical advice.',
    links: [
      { text: 'Find a GP', url: '/find-a-gp' },
      { text: 'Find a Specialist', url: '/find-a-specialist' }
    ],
  },
  {
    category: 'National Agenda',
    keywords: ['national agenda', 'colonaive mission', 'vision', 'prevent mortality', 'early diagnosis', 'late stage cancer', 'colonaive goals', 'national plan'],
    intent: 'national_agenda_colonaive',
    question: 'What is COLONAiVE\'s national agenda regarding CRC?',
    response: 'COLONAiVE™ is dedicated to significantly reducing colorectal cancer mortality rates in Singapore. Our national agenda focuses on increasing public awareness, promoting widespread early screening, and facilitating access to care, with a clear vision to prevent late-stage diagnoses and improve patient outcomes.',
    links: [{ text: 'Join the Movement', url: '/join-the-movement' }],
  },
  {
    category: 'General Greetings',
    keywords: ['hello', 'hi', 'hey', 'greetings', 'hallo', 'good morning', 'good afternoon', 'good evening'],
    intent: 'greeting',
    question: 'Greeting',
    response: 'Hello Champion! How can I assist you today regarding colorectal cancer screening?',
  },
  {
    category: 'General Thanks',
    keywords: ['thank you', 'thanks', 'thx', 'cheers', 'ty'],
    intent: 'thanks',
    question: 'Thanks',
    response: 'You\'re most welcome! I\'m here to help. Is there anything else you\'d like to know?',
  },
  {
    category: 'General Goodbye',
    keywords: ['bye', 'goodbye', 'see you', 'farewell', 'catch you later'],
    intent: 'goodbye',
    question: 'Goodbye',
    response: 'Goodbye! Remember, staying informed and getting screened regularly are key to fighting colorectal cancer. Take care!',
  },
];
