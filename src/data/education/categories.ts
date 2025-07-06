export interface Category {
  id: string;
  name: string;
  description: string;
  audience: 'patients' | 'clinicians' | 'both';
  icon: string;
  color: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description: string;
}

export const educationCategories: Category[] = [
  {
    id: 'patient-basics',
    name: 'CRC Basics',
    description: 'Fundamental information about colorectal cancer',
    audience: 'patients',
    icon: 'BookOpen',
    color: 'blue',
    subcategories: [
      { id: 'anatomy', name: 'Anatomy & Physiology', description: 'Understanding the colorectal system' },
      { id: 'risk-factors', name: 'Risk Factors', description: 'What increases CRC risk' },
      { id: 'types', name: 'Types of CRC', description: 'Different forms of colorectal cancer' }
    ]
  },
  {
    id: 'patient-screening',
    name: 'Screening Options',
    description: 'Available screening methods and preparation',
    audience: 'patients',
    icon: 'Search',
    color: 'green'
  },
  {
    id: 'patient-symptoms',
    name: 'Symptoms & Signs',
    description: 'Recognizing warning signs early',
    audience: 'patients',
    icon: 'TrendingUp',
    color: 'orange'
  },
  {
    id: 'patient-prevention',
    name: 'Prevention',
    description: 'Lifestyle factors and risk reduction',
    audience: 'patients',
    icon: 'Shield',
    color: 'purple'
  },
  {
    id: 'clinician-guidelines',
    name: 'Clinical Guidelines',
    description: 'Evidence-based protocols and recommendations',
    audience: 'clinicians',
    icon: 'FileText',
    color: 'purple'
  },
  {
    id: 'clinician-research',
    name: 'Research & Studies',
    description: 'Latest research findings and clinical studies',
    audience: 'clinicians',
    icon: 'TrendingUp',
    color: 'blue'
  },
  {
    id: 'clinician-case-studies',
    name: 'Case Studies',
    description: 'Real clinical cases and learning opportunities',
    audience: 'clinicians',
    icon: 'Users',
    color: 'green'
  },
  {
    id: 'clinician-cme',
    name: 'CME Resources',
    description: 'Continuing medical education materials',
    audience: 'clinicians',
    icon: 'BookOpen',
    color: 'teal'
  }
];