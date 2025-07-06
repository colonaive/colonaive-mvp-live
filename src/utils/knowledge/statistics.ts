// /home/project/src/utils/knowledge/statistics.ts
// This file contains knowledge entries related to CRC statistics.

import { KnowledgeEntry } from '../fuzzyMatch'; // Import the interface from fuzzyMatch.ts

export const statisticsKnowledge: KnowledgeEntry[] = [
  {
    category: 'Statistics',
    keywords: ['statistics', 'how common', 'incidence', 'prevalence', 'crc in singapore', 'colon cancer rates'],
    intent: 'crc_statistics',
    question: 'How common is colorectal cancer?',
    response: 'Colorectal cancer is one of the most common cancers globally and in Singapore. It is the most common cancer among men and the second most common among women in Singapore. However, with increased awareness and screening, early detection rates are improving.',
    links: [{ text: 'Patient Education', url: '/education/patients' }],
  },
  {
    category: 'Global Statistics',
    keywords: ['global crc statistics', 'worldwide colon cancer cases', 'crc cases worldwide', 'global deaths crc', 'how many people get crc globally'],
    intent: 'global_crc_stats',
    question: 'What are the global statistics for colorectal cancer?',
    response: [
      "Globally, colorectal cancer is the third most commonly diagnosed cancer and the second leading cause of cancer death.",
      "In 2020, there were over 1.9 million new CRC cases and an estimated 930,000 deaths worldwide.",
      "Projections indicate a significant increase to 3.2 million new cases and 1.6 million deaths by 2040, with most cases expected in high or very high Human Development Index (HDI) countries."
    ],
    links: [
      { text: 'PubMed: Global Burden of CRC', url: 'https://pubmed.ncbi.nlm.nih.gov/36604116/' }
    ]
  },
  {
    category: 'Global Statistics',
    keywords: ['crc incidence regions', 'highest crc rates', 'lowest crc rates', 'regional crc statistics'],
    intent: 'crc_regional_stats',
    question: 'Which regions have the highest and lowest CRC incidence rates?',
    response: [
      "Colorectal cancer incidence rates vary significantly by region.",
      "Highest rates are observed in Australia/New Zealand and European regions (e.g., 40.6 per 100,000 males in 2020).",
      "The lowest rates are typically found in several African regions and Southern Asia (e.g., 4.4 per 100,000 females in 2020)."
    ],
    links: [
      { text: 'PubMed: Global Burden of CRC', url: 'https://pubmed.ncbi.nlm.nih.gov/36604116/' }
    ]
  },
  {
    category: 'Survival Statistics',
    keywords: ['crc survival rate', 'colorectal cancer survival', 'how many survive crc', '5-year survival crc'],
    intent: 'crc_survival_rate',
    question: 'What are the survival rates for colorectal cancer?',
    response: [
      "In the U.S., the overall 5-year relative survival rate for colorectal cancer is 65.4% (based on 2015-2021 data).",
      "Survival rates are significantly higher with early detection:",
      "• Localized (confined to primary site): 91.5% (for 34% of cases)",
      "• Regional (spread to lymph nodes): 74.6% (for 37% of cases)",
      "• Distant (metastasized): 16.2% (for 23% of cases)",
      "This highlights the critical importance of early diagnosis through screening."
    ],
    links: [
      { text: 'SEER Cancer Stat Facts', url: 'https://seer.cancer.gov/statfacts/html/colorect.html' }
    ]
  },
  {
    category: 'Incidence',
    keywords: ['crc in young adults', 'younger crc cases', 'rising crc in youth', 'colon cancer under 50'],
    intent: 'crc_young_adults',
    question: 'Is colorectal cancer rising in young adults?',
    response: [
      "Yes, colorectal cancer incidence is rising in young adults, particularly in the U.S. About 10% of cases are diagnosed in people under 50, and these numbers are increasing by 1-2% annually.",
      "Alarmingly, recent data indicates that colon cancer has become the deadliest cancer in men aged 20-49 and the second deadliest among young women."
    ],
    links: [
      { text: 'Colorectal Cancer Alliance', url: 'https://colorectalcancer.org/basics/facts-and-statistics' }
    ]
  },
  {
    category: 'Incidence',
    keywords: ['crc diagnosis rate', 'new crc cases per year', 'how many diagnosed crc'],
    intent: 'crc_diagnosis_rate',
    question: 'How many people are diagnosed with CRC each year?',
    response: [
      "Globally, over 1.9 million new colorectal cancer cases were estimated in 2020, projected to increase to 3.2 million by 2040.",
      "In the U.S., estimates for 2025 project 154,270 new diagnoses of colon and rectal cancer."
    ],
    links: [
      { text: 'PubMed: Global Burden of CRC', url: 'https://pubmed.ncbi.nlm.nih.gov/36604116/' },
      { text: 'Colorectal Cancer Alliance', url: 'https://colorectalcancer.org/basics/facts-and-statistics' }
    ]
  },
  {
    category: 'Mortality',
    keywords: ['crc death rate', 'how many die from crc', 'mortality statistics crc'],
    intent: 'crc_mortality_rate',
    question: 'What is the mortality rate for colorectal cancer?',
    response: [
      "Globally, approximately 930,000 deaths from colorectal cancer were estimated in 2020, projected to rise to 1.6 million by 2040.",
      "In the U.S., estimates for 2025 project 52,900 deaths.",
      "The number of deaths has steadily decreased in some regions (like the U.S. and Canada) since the mid-1980s, largely due to increased screening, improved diagnosis, and better treatment options."
    ],
    links: [
      { text: 'PubMed: Global Burden of CRC', url: 'https://pubmed.ncbi.nlm.nih.gov/36604116/' },
      { text: 'Colorectal Cancer Alliance', url: 'https://colorectalcancer.org/basics/facts-and-statistics' },
      { text: 'Canadian Cancer Society', url: 'https://cancer.ca/en/cancer-information/cancer-types/colorectal/statistics' }
    ]
  },
];
