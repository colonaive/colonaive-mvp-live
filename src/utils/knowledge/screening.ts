// /home/project/src/utils/knowledge/screening.ts
// This file contains knowledge entries related to CRC screening options, procedures, and associated logistics.

import { KnowledgeEntry } from '../fuzzyMatch'; // Import the interface from fuzzyMatch.ts

export const screeningKnowledge: KnowledgeEntry[] = [
  {
    category: 'Screening',
    keywords: ['screening', 'test', 'colonoscopy', 'blood test', 'FIT test', 'how to get screened', 'when to get screened', 'screening options', 'check up for colon cancer'],
    intent: 'crc_screening_options',
    question: 'What are the screening options for CRC?',
    response: 'There are several methods for colorectal cancer screening. The gold standard is colonoscopy, which allows direct visualization of the colon. Other options include stool-based tests like the Fecal Immunochemical Test (FIT) and newer blood-based tests. The best option for you depends on your age, risk factors, and personal preference.',
    links: [
      { text: 'Colonoscopy: Gold Standard', url: '/education/patients/colonoscopy-gold-standard' },
      { text: 'Get Screened', url: '/get-screened' }
    ],
  },
  {
    category: 'Colonoscopy',
    keywords: ['colonoscopy', 'scoped', 'what is colonoscopy', 'colonoscopy procedure', 'prep for colonoscopy', 'colonoscopy examination'],
    intent: 'about_colonoscopy',
    question: 'Tell me about colonoscopy.',
    response: 'A colonoscopy is a procedure where a doctor uses a thin, flexible tube with a camera to look inside your entire colon and rectum. It\'s considered the most thorough screening method because it can both detect and remove polyps during the same procedure. Preparation involves a special diet and bowel cleansing beforehand.',
    links: [{ text: 'Colonoscopy: Gold Standard', url: '/education/patients/colonoscopy-gold-standard' }],
  },
  {
    category: 'Blood Test',
    keywords: ['blood test', 'blood-based screening', 'colonaive', 'colonaive test', 'new test', 'blood screening for crc'],
    intent: 'about_blood_test',
    question: 'What about the blood test for CRC?',
    response: 'Newer blood-based tests for colorectal cancer screening are becoming available, offering a less invasive option. These tests typically look for specific biomarkers associated with CRC. While convenient, it\'s important to understand their sensitivity and specificity compared to colonoscopy, and discuss with your doctor if it\'s right for you.',
    links: [{ text: 'Get Screened', url: '/get-screened' }],
  },
  {
    category: 'Screening',
    keywords: ['when to screen', 'recommended age for screening', 'screening guidelines', 'MOH guidelines', 'screening age'],
    intent: 'when_to_screen',
    question: 'When is CRC screening recommended in Singapore?',
    response: 'In Singapore, the Ministry of Health (MOH) generally recommends regular colorectal cancer screening for average-risk individuals starting from age 50. If you have a family history or other risk factors, your doctor might recommend starting earlier. Always discuss your personal screening schedule with a qualified healthcare provider.',
    links: [{ text: 'Get Screened', url: '/get-screened' }],
  },
  {
    category: 'Screening Process',
    keywords: ['how to screen', 'what is the screening process', 'steps for screening', 'screening procedure'],
    intent: 'screening_process_steps',
    question: 'What is the general process for CRC screening?',
    response: 'The general process for CRC screening typically involves a discussion with your doctor about your risk factors, choosing a suitable screening method (like FIT, blood test, or colonoscopy), undergoing the test, and then discussing the results with your doctor. If any abnormalities are found, further investigations will be recommended.',
    links: [
      { text: 'Get Screened', url: '/get-screened' },
      { text: 'Find a GP', url: '/find-a-gp' }
    ],
  },
  {
    category: 'Colonoscopy Details',
    keywords: ['how long colonoscopy', 'colonoscopy time', 'duration of scope', 'scope take how long', 'how long is the procedure', 'colonoscopy duration'],
    intent: 'colonoscopy_duration',
    question: 'How long does a colonoscopy take?',
    response: [
      "A colonoscopy procedure itself usually takes about 30 to 45 minutes.",
      "However, you should plan for a total of 2 to 3 hours at the clinic, including time for preparation, the procedure, and recovery from sedation.",
      "You will feel drowsy, so ensure you have someone to accompany you home."
    ],
    links: [{ text: 'Colonoscopy: Gold Standard', url: '/education/patients/colonoscopy-gold-standard' }]
  },
  {
    category: 'Colonoscopy Details',
    keywords: ['can eat after scope', 'after colonoscopy what can eat', 'food after colonoscopy', 'scope done can eat?', 'diet after colonoscopy', 'what to eat after procedure', 'eating after scope'],
    intent: 'colonoscopy_aftercare',
    question: 'Can I eat after a colonoscopy?',
    response: [
      "Yes, you can usually eat once you're fully awake and your doctor gives the go-ahead.",
      "It's generally recommended to start with light meals and avoid heavy, fatty, or spicy foods immediately after the procedure.",
      "Your doctor will provide specific dietary instructions."
    ],
    links: [{ text: 'Colonoscopy: Gold Standard', url: '/education/patients/colonoscopy-gold-standard' }]
  },
  {
    category: 'Screening',
    keywords: ['cost of ColonAiQ', 'colonaiq price', 'how much blood test', 'colonaiq how much', 'blood test cost', 'colon aiq cost', 'price of colonaive blood test'],
    intent: 'colonaive_cost',
    question: 'How much does ColonAiQ cost?',
    response: [
      "The estimated cost for the ColonAiQ® blood test is around S$355 per person.",
      "This amount may vary depending on the specific clinic, lab partner pricing, and any subsidies or promotions available under CSR campaigns.",
      "For the latest pricing or to check for promotions, please visit our screening page or contact your preferred clinic directly."
    ],
    links: [{ text: 'Get Screened', url: '/get-screened' }]
  },
  {
    category: 'Screening',
    keywords: ['get scoped', 'should i get scoped', 'do i need colonoscopy', 'is colonoscopy for me'],
    intent: 'query_colonoscopy_need',
    question: 'Should I get scoped?',
    response: 'A colonoscopy is the gold standard for colorectal cancer screening. Whether it\'s recommended for you depends on your age, risk factors, and personal history. It\'s best to discuss this with your doctor.',
    links: [{ text: 'Learn more about Colonoscopy', url: '/education/patients/colonoscopy-gold-standard' }],
  },
  {
    category: 'Screening',
    keywords: ['FIT vs blood', 'FIT or blood', 'which test is better', 'stool test or blood test', 'compare fit and blood test', 'fit test versus blood test'],
    intent: 'compare_fit_blood',
    question: 'Which test is better, FIT or blood?',
    response: 'Both the Fecal Immunochemical Test (FIT) and blood-based tests are non-invasive screening options for colorectal cancer. FIT detects hidden blood in stool, while blood tests look for specific biomarkers. The "better" test depends on individual factors and preferences, as well as test availability and doctor\'s recommendation. Colonoscopy remains the most comprehensive method. Always consult your doctor to determine the most suitable screening method for you.',
    links: [{ text: 'Get Screened', url: '/get-screened' }],
  },
  {
    category: 'Screening',
    keywords: ['ColonAiQ', 'ColonAiQ test', 'what is ColonAiQ', 'about ColonAiQ'],
    intent: 'about_colonaive_aiq',
    question: 'What is ColonAiQ?',
    response: 'ColonAiQ is a blood-based test cleared by the Singapore Health Sciences Authority (HSA) that helps in the early detection of colorectal cancer. It offers a convenient and non-invasive screening option.',
    links: [{ text: 'Learn more about screening options', url: '/get-screened' }],
  },
];
