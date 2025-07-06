// /home/project/src/utils/knowledge/symptoms.ts
// This file contains educational knowledge entries about CRC symptoms from the QA_KNOWLEDGE.

import { KnowledgeEntry } from '../fuzzyMatch'; // Import the interface from fuzzyMatch.ts

export const symptomEducationalKnowledge: KnowledgeEntry[] = [
  {
    category: 'Symptoms',
    keywords: ['symptoms', 'signs', 'early signs', 'what are the symptoms', 'tell me about symptoms of crc', 'crc signs', 'colon cancer symptoms'],
    intent: 'crc_symptoms',
    question: 'What are the symptoms of colorectal cancer?',
    response: 'Early colorectal cancer often has no symptoms. When symptoms do appear, they can include: a change in bowel habits, rectal bleeding or blood in stool, persistent abdominal discomfort, unexplained weight loss, and fatigue. These symptoms can also be caused by other less serious conditions, but it\'s important to consult a doctor if you experience them.',
    links: [{ text: 'Early Symptoms of CRC', url: '/education/patients/early-symptoms-of-crc' }],
  },
  {
    category: 'Symptoms',
    keywords: ['early symptoms', 'silent killer', 'no symptoms', 'asymptomatic crc'],
    intent: 'early_symptoms_details',
    question: 'Are there early symptoms of CRC?',
    response: 'In its early stages, colorectal cancer often presents with no symptoms at all, which is why regular screening is so important. When symptoms do occur, they can be subtle and might include persistent changes in bowel habits, rectal bleeding, abdominal discomfort, or unexplained weight loss. These symptoms warrant a consultation with your doctor.',
    links: [{ text: 'Early Symptoms of CRC', url: '/education/patients/early-symptoms-of-crc' }],
  },
];
