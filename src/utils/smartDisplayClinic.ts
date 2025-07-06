import { ClinicType } from '../types';

export function smartDisplayClinic(input: string, clinicDatabase: ClinicType[]): ClinicType | null {
  const normalizedInput = input.toLowerCase().trim();

  // First try exact match by clinic ID
  const idMatch = clinicDatabase.find(clinic =>
    clinic.clinicId.toLowerCase() === normalizedInput
  );
  if (idMatch) return idMatch;

  // Then try matching by doctor name
  const doctorMatch = clinicDatabase.find(clinic =>
    clinic.doctors.some(doctor => 
      doctor.name.toLowerCase().includes(normalizedInput)
    )
  );
  if (doctorMatch) return doctorMatch;

  // Try matching by clinic name
  const clinicMatch = clinicDatabase.find(clinic =>
    clinic.clinicName.toLowerCase().includes(normalizedInput)
  );
  if (clinicMatch) return clinicMatch;

  // Try matching by district
  const districtMatch = clinicDatabase.find(clinic =>
    clinic.district.toLowerCase().includes(normalizedInput)
  );
  if (districtMatch) return districtMatch;

  // Try matching by specialty
  const specialtyMatch = clinicDatabase.find(clinic =>
    clinic.specialty.toLowerCase().includes(normalizedInput)
  );
  if (specialtyMatch) return specialtyMatch;

  // Try matching by screening service
  const serviceMatch = clinicDatabase.find(clinic =>
    clinic.screeningServices.some(service => 
      service.toLowerCase().includes(normalizedInput)
    )
  );
  if (serviceMatch) return serviceMatch;

  // If no match found
  return null;
}

// Helper function to get all matching clinics
export function findMatchingClinics(input: string, clinicDatabase: ClinicType[]): ClinicType[] {
  const normalizedInput = input.toLowerCase().trim();

  return clinicDatabase.filter(clinic => {
    // Match against multiple criteria
    const matchesDoctors = clinic.doctors.some(doctor => 
      doctor.name.toLowerCase().includes(normalizedInput) ||
      doctor.languages.some(lang => lang.toLowerCase().includes(normalizedInput))
    );

    const matchesClinic = 
      clinic.clinicName.toLowerCase().includes(normalizedInput) ||
      clinic.district.toLowerCase().includes(normalizedInput) ||
      clinic.specialty.toLowerCase().includes(normalizedInput) ||
      clinic.screeningServices.some(service => 
        service.toLowerCase().includes(normalizedInput)
      );

    return matchesDoctors || matchesClinic;
  });
}

// Helper function to get clinics by type
export function getClinicsByType(type: 'GP' | 'Specialist', clinicDatabase: ClinicType[]): ClinicType[] {
  return clinicDatabase.filter(clinic => {
    if (type === 'GP') {
      return clinic.specialty.includes('General Practitioner');
    } else {
      return clinic.specialty.includes('Surgeon') || clinic.specialty.includes('Specialist');
    }
  });
}

// Helper function to get clinics by service
export function getClinicsByService(service: string, clinicDatabase: ClinicType[]): ClinicType[] {
  return clinicDatabase.filter(clinic =>
    clinic.screeningServices.some(s => 
      s.toLowerCase().includes(service.toLowerCase())
    )
  );
}

// Helper function to get clinics by district
export function getClinicsByDistrict(district: string, clinicDatabase: ClinicType[]): ClinicType[] {
  return clinicDatabase.filter(clinic =>
    clinic.district.toLowerCase().includes(district.toLowerCase())
  );
}

// Helper function to get clinics by language
export function getClinicsByLanguage(language: string, clinicDatabase: ClinicType[]): ClinicType[] {
  return clinicDatabase.filter(clinic =>
    clinic.doctors.some(doctor =>
      doctor.languages.some(lang =>
        lang.toLowerCase().includes(language.toLowerCase())
      )
    )
  );
}