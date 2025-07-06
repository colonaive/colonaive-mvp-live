export interface Author {
  id: string;
  name: string;
  credentials?: string;
  affiliation?: string;
  bio?: string;
  avatar?: string;
  specialties?: string[];
  socialLinks?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export const educationAuthors: Author[] = [
  {
    id: 'colonaive-team',
    name: 'COLONAiVE Editorial Team',
    credentials: 'Content reviewed from medical literature',
    affiliation: 'Project COLONAiVE™',
    bio: 'The COLONAiVE Editorial Team creates evidence-based content following strict medical guidelines. All content is reviewed for accuracy and adherence to current medical standards.',
    specialties: ['Colorectal Cancer Education', 'Public Health Communication', 'Medical Content Development']
  },
  {
    id: 'dr-francis-seow',
    name: 'Dr. Francis Seow-Choen',
    credentials: 'MBBS (Singapore), FRCS (Edinburgh), FAMS',
    affiliation: 'Senior Consultant Colorectal Surgeon',
    bio: 'Dr. Seow is a globally renowned colorectal surgeon and one of Asia\'s pioneers in minimally invasive colorectal surgery. He was instrumental in setting up the Department of Colorectal Surgery at Singapore General Hospital, the first independent colorectal department in Asia.',
    avatar: '/assets/advisors/francis-seow.jpg',
    specialties: ['Colorectal Surgery', 'Minimally Invasive Surgery', 'Colorectal Cancer']
  },
  {
    id: 'prof-eu-kong-weng',
    name: 'Prof. Eu Kong Weng',
    credentials: 'MBBS, FRCS, FAMS',
    affiliation: 'Medical Director, Colorectal Surgeons Inc.',
    bio: 'Prof. Eu is a distinguished colorectal surgeon with expertise in colorectal cancer surgery, advanced robotic techniques, and surgical innovation. He has trained extensively in the UK and USA, and is a key figure in advancing surgical robotics in Singapore.',
    avatar: '/assets/advisors/eu-kong-weng.jpg',
    specialties: ['Colorectal Oncology', 'Robotic Surgery', 'Surgical Innovation']
  },
  {
    id: 'prof-lawrence-ho',
    name: 'Prof. Lawrence Ho Khek-Yu',
    credentials: 'MBBS, MMed (Int Med), FRCP (Edin), FAMS',
    affiliation: 'Senior Consultant, NUH & NCIS | Professor, NUS Medicine',
    bio: 'Prof. Ho is an internationally respected gastroenterologist and medical thought leader. He has played a pivotal role in developing regional standards for gastrointestinal endoscopy and is actively involved in research on colorectal and gastric cancer prevention.',
    avatar: '/assets/advisors/lawrence-ho.jpg',
    specialties: ['Gastroenterology', 'Endoscopy', 'Cancer Prevention']
  }
];