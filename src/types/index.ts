export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export interface MenuItem extends NavItem {
  submenu?: NavItem[];
}

export interface PillarItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Doctor {
  name: string;
  credentials: string;
  languages: string[];
}

export interface OpeningHours {
  weekdays: string;
  saturday: string;
  sunday: string;
  publicHoliday: string;
}

export interface ClinicType {
  clinicId: string;
  clinicName: string;
  doctors: Doctor[];
  specialty: string;
  address: string;
  district: string;
  phone: string;
  email: string;
  website: string;
  screeningServices: string[];
  openingHours: OpeningHours;
  panelListed: boolean;
  notes: string;
}

export interface PathwayCard {
  title: string;
  description: string;
  icon: string;
  link: string;
}