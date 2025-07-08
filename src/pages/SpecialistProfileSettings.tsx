// /home/project/src/pages/SpecialistProfileSettings.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../utils/toast'; // Import the base toast object
import { supabase } from '../supabase';
import { Container } from '../components/ui/Container';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import { 
  Building2, MapPin, Phone, Mail, Globe, Stethoscope, Clock, Shield, User,
  AlertCircle, Loader2, CheckCircle, Save, ArrowLeft, Info
} from 'lucide-react';

interface SpecialistProfileData {
  fullName: string; 
  phoneNumber: string; 
  email: string; 
  medicalRegistrationNo: string;
  qualifications: string;
  fieldOfSpecialization: string;
  clinicAffiliation: string;
  address: string;
  postalCode: string;
  region: string;
  website: string;
  yearsOfExperience: string; 
  specialties: string[];
  languages: string;
  operatingHours: { weekdays: string; saturday: string; sunday: string; publicHoliday: string; };
  insurancePartners: string;
  notes: string;
}

const SPECIALTIES_OPTIONS = [ 
  'Colonoscopy (Diagnostic)', 'Colonoscopy (Screening)', 'Polypectomy', 'IBS & Functional GI Disorders',
  'Constipation / Chronic Diarrhea', 'Haemorrhoids (Non-surgical)', 'Haemorrhoids (Surgical)',
  'Polyp Detection & Removal', 'Colorectal Cancer Treatment', 'IBD (Crohn\'s / Ulcerative Colitis)',
  'GI Bleeding Management', 'Rectal Prolapse', 'Colonoscopy under sedation',
  'Screening Colonoscopy (asymptomatic)', 'Upper GI Endoscopy / Gastroscopy', 'Gastroesophageal Reflux / Bloating',
];

const SpecialistProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, userType } = useAuth();
  
  const [formData, setFormData] = useState<Partial<SpecialistProfileData>>({
    operatingHours: { weekdays: '', saturday: '', sunday: '', publicHoliday: '' },
    specialties: [],
  });
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof SpecialistProfileData | 'form', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const regionOptions = ['North', 'South', 'East', 'West', 'Central'];

  useEffect(() => {
    if (authLoading) return; 
    if (!user) {
      navigate('/login'); 
      return; 
    }
    if (userType && userType !== 'specialist') {
      navigate(getDashboardRoute(userType)); 
      return;
    }

    const fetchProfileData = async () => {
      setInitialLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email, phone_number')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error("User profile not found.");

        const { data: specialistData, error: specialistError } = await supabase
          .from('specialists')
          .select('*') 
          .eq('id', user.id)
          .single();
        
        if (specialistError && specialistError.code !== 'PGRST116') { 
            throw specialistError;
        }

        setFormData({
          fullName: profileData.full_name || '',
          email: profileData.email || '', 
          phoneNumber: profileData.phone_number || '',
          medicalRegistrationNo: specialistData?.medical_registration_no || '',
          qualifications: specialistData?.qualifications || '',
          fieldOfSpecialization: specialistData?.field_of_specialization || '',
          clinicAffiliation: specialistData?.clinic_affiliation || '',
          address: specialistData?.address || '',
          postalCode: specialistData?.postal_code || '',
          region: specialistData?.region || '',
          website: specialistData?.website || '',
          yearsOfExperience: specialistData?.years_of_experience?.toString() || '0',
          specialties: specialistData?.specialties || [],
          languages: specialistData?.languages || '',
          operatingHours: specialistData?.operating_hours || { weekdays: '', saturday: '', sunday: '', publicHoliday: '' },
          insurancePartners: specialistData?.insurance_partners || '',
          notes: specialistData?.notes || '',
        });
      } catch (error: any) {
        console.error("Error fetching specialist profile:", error);
        setErrors({ form: "Failed to load profile data. " + error.message });
      } finally {
        setInitialLoading(false);
      }
    };

    if (user && userType === 'specialist') {
      fetchProfileData();
    }
  }, [user, authLoading, userType, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('operatingHours.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({ ...prev, operatingHours: { ...prev.operatingHours, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name as keyof SpecialistProfileData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSpecialtyChange = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties?.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...(prev.specialties || []), specialty]
    }));
    if (errors.specialties) setErrors(prev => ({ ...prev, specialties: undefined }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SpecialistProfileData, string>> = {};
    if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.medicalRegistrationNo?.trim()) newErrors.medicalRegistrationNo = 'Medical registration number is required';
    if (!formData.qualifications?.trim()) newErrors.qualifications = 'Professional qualifications are required';
    if (!formData.fieldOfSpecialization?.trim()) newErrors.fieldOfSpecialization = 'Field of specialization is required';
    if (!formData.clinicAffiliation?.trim()) newErrors.clinicAffiliation = 'Primary clinic affiliation is required';
    if (!formData.address?.trim()) newErrors.address = 'Practice address is required';
    if (!formData.postalCode?.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.yearsOfExperience?.trim() || Number(formData.yearsOfExperience) < 0) newErrors.yearsOfExperience = 'Valid years of experience is required';
    if (!formData.specialties || formData.specialties.length === 0) newErrors.specialties = 'Please select at least one specialty';
    if (!formData.languages?.trim()) newErrors.languages = 'Languages spoken are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;
    
    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const { error: updateError } = await supabase.rpc('update_specialist_profile', {
        p_user_id: user.id,
        p_full_name: formData.fullName!, 
        p_phone_number: formData.phoneNumber!,
        p_medical_registration_no: formData.medicalRegistrationNo!,
        p_qualifications: formData.qualifications!,
        p_field_of_specialization: formData.fieldOfSpecialization!,
        p_clinic_affiliation: formData.clinicAffiliation!,
        p_address: formData.address!,
        p_postal_code: formData.postalCode!,
        p_region: formData.region!,
        p_website: formData.website || null,
        p_years_of_experience: Number(formData.yearsOfExperience),
        p_specialties: formData.specialties!,
        p_languages: formData.languages!,
        p_operating_hours: formData.operatingHours!,
        p_insurance_partners: formData.insurancePartners || null,
        p_notes: formData.notes || null
      });

      if (updateError) throw updateError;

      setSuccessMessage('Profile updated successfully!');
      toast.success('Profile updated successfully!'); // CORRECTED: Using base toast object
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error: any) {
      console.error("Error updating specialist profile:", error);
      const errorMessage = error.message || 'An unexpected error occurred.';
      setErrors({ form: errorMessage });
      toast.error(`Update failed: ${errorMessage}`); // CORRECTED: Using base toast object
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (initialLoading || authLoading) {
    return (
      <Container className="py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
        Loading profile settings...
      </Container>
    );
  }

  function getDashboardRoute(userType: string | null | undefined): string {
    switch (userType) {
      case 'specialist': return '/dashboard/specialist';
      case 'corporate_contact': return '/dashboard/corporate';
      default: return '/dashboard/champion';
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-gray-100 min-h-screen py-8 md:py-12">
      <Container className="max-w-5xl mx-auto">
        <div className="mb-8">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-indigo-700 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Specialist Profile Settings</h1>
            <p className="mt-2 text-md text-gray-600">Manage your professional information and how it appears on COLONAiVE™.</p>
        </div>
        
        {errors.form && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> {errors.form}
            </div>
        )}
        {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" /> {successMessage}
            </div>
        )}

        <Card className="shadow-xl border-gray-200">
            <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-10" noValidate>
                <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                        <User className="h-6 w-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-700">Contact Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField id="fullName" name="fullName" label="Full Name" value={formData.fullName || ''} onChange={handleInputChange} error={errors.fullName} required autoComplete="name" placeholder="Dr. Jane Doe" disabled={isSubmitting}/>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address (Login)</label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" id="email" value={formData.email || ''} disabled className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600" />
                            </div>
                             <p className="mt-1 text-xs text-gray-500">Email is used for login and cannot be changed here.</p>
                        </div>
                        <InputField id="phoneNumber" name="phoneNumber" label="Contact Phone Number" type="tel" value={formData.phoneNumber || ''} onChange={handleInputChange} error={errors.phoneNumber} required autoComplete="tel" placeholder="+65 9123 4567" disabled={isSubmitting}/>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                        <Shield className="h-6 w-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-700">Professional Credentials</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField id="medicalRegistrationNo" name="medicalRegistrationNo" label="Medical Registration No." value={formData.medicalRegistrationNo || ''} onChange={handleInputChange} error={errors.medicalRegistrationNo} required placeholder="SMC Registration Number" disabled={isSubmitting}/>
                        <InputField id="qualifications" name="qualifications" label="Qualifications" value={formData.qualifications || ''} onChange={handleInputChange} error={errors.qualifications} required placeholder="E.g., MBBS, MRCP, FRCS" disabled={isSubmitting}/>
                        <InputField id="fieldOfSpecialization" name="fieldOfSpecialization" label="Field of Specialization" value={formData.fieldOfSpecialization || ''} onChange={handleInputChange} error={errors.fieldOfSpecialization} required placeholder="e.g., Gastroenterology, Oncology" disabled={isSubmitting} className="md:col-span-2"/>
                        <InputField id="yearsOfExperience" name="yearsOfExperience" label="Years of Experience" type="number" value={formData.yearsOfExperience || ''} onChange={handleInputChange} error={errors.yearsOfExperience} required placeholder="10" min="0" disabled={isSubmitting}/>
                        <InputField id="languages" name="languages" label="Languages Spoken" value={formData.languages || ''} onChange={handleInputChange} placeholder="E.g., English, Mandarin, Malay" disabled={isSubmitting} required error={errors.languages}/>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-700">Practice Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4"> 
                        <InputField id="clinicAffiliation" name="clinicAffiliation" label="Primary Clinic / Hospital Name" value={formData.clinicAffiliation || ''} onChange={handleInputChange} error={errors.clinicAffiliation} required placeholder="e.g., Singapore General Hospital" disabled={isSubmitting}/>
                        <InputField id="address" name="address" label="Practice Address" value={formData.address || ''} onChange={handleInputChange} error={errors.address} required placeholder="123 Main Street, #01-01, Singapore" disabled={isSubmitting}/>
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                        <InputField id="postalCode" name="postalCode" label="Postal Code" value={formData.postalCode || ''} onChange={handleInputChange} error={errors.postalCode} required placeholder="123456" maxLength={6} disabled={isSubmitting}/>
                        <div>
                            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region <span className="text-red-500">*</span></label>
                            <select id="region" name="region" value={formData.region || ''} onChange={handleInputChange} disabled={isSubmitting} className={`w-full mt-1 px-3 py-2 border rounded-lg shadow-sm ${errors.region ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} focus:border-indigo-500`}>
                                <option value="">Select region</option>
                                {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.region && <p className="text-sm text-red-600 mt-1">{errors.region}</p>}
                        </div>
                    </div>
                    <div className="mt-4">
                        <InputField id="website" name="website" label="Practice Website (Optional)" type="url" value={formData.website || ''} onChange={handleInputChange} error={errors.website} placeholder="https://www.yourclinic.com" disabled={isSubmitting}/>
                    </div>
                </section>

                 <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                        <Stethoscope className="h-6 w-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-700">Areas of Expertise</h2>
                    </div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Specialties <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                        {SPECIALTIES_OPTIONS.map((specialty) => (
                        <label key={specialty} className={`relative flex items-center cursor-pointer rounded-md border p-3 transition-colors duration-150 ease-in-out shadow-sm ${formData.specialties?.includes(specialty) ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500' : 'border-gray-300 hover:border-gray-400'}`}>
                            <input type="checkbox" className="sr-only peer" checked={formData.specialties?.includes(specialty)} onChange={() => handleSpecialtyChange(specialty)} disabled={isSubmitting}/>
                            <span className="text-sm text-gray-700 peer-checked:font-semibold peer-checked:text-indigo-700">{specialty}</span>
                            <CheckCircle className={`h-5 w-5 text-indigo-600 absolute top-1/2 right-3 transform -translate-y-1/2 transition-opacity opacity-0 ${formData.specialties?.includes(specialty) ? 'opacity-100' : ''}`} />
                        </label>
                        ))}
                    </div>
                    {errors.specialties && <p className="text-sm text-red-600 mt-1">{errors.specialties}</p>}
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                        <Clock className="h-6 w-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-700">Operating Hours & Other Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField id="operatingHours.weekdays" name="operatingHours.weekdays" label="Weekdays Operating Hours" value={formData.operatingHours?.weekdays || ''} onChange={handleInputChange} placeholder="e.g., 9:00 AM - 5:00 PM" disabled={isSubmitting}/>
                        <InputField id="operatingHours.saturday" name="operatingHours.saturday" label="Saturday Operating Hours" value={formData.operatingHours?.saturday || ''} onChange={handleInputChange} placeholder="e.g., 9:00 AM - 1:00 PM / Closed" disabled={isSubmitting}/>
                        <InputField id="operatingHours.sunday" name="operatingHours.sunday" label="Sunday Operating Hours" value={formData.operatingHours?.sunday || ''} onChange={handleInputChange} placeholder="e.g., Closed" disabled={isSubmitting}/>
                        <InputField id="operatingHours.publicHoliday" name="operatingHours.publicHoliday" label="Public Holiday Operating Hours" value={formData.operatingHours?.publicHoliday || ''} onChange={handleInputChange} placeholder="e.g., Closed / Special Hours" disabled={isSubmitting}/>
                    </div>
                    <div className="mt-4">
                        <InputField id="insurancePartners" name="insurancePartners" label="Insurance Partners (Optional)" value={formData.insurancePartners || ''} onChange={handleInputChange} placeholder="List major insurance panels you're on" disabled={isSubmitting}/>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes <span className="text-gray-500">(Optional)</span></label>
                        <textarea id="notes" name="notes" rows={4} value={formData.notes || ''} onChange={handleInputChange} disabled={isSubmitting} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Share any other relevant details for your public profile..."/>
                    </div>
                </section>
                
                <div className="pt-8 mt-6 border-t border-gray-200 flex justify-end">
                    <Button type="submit" className="w-full md:w-auto py-2.5 px-6 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center" disabled={isSubmitting || initialLoading}>
                    {isSubmitting ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" /> Saving Changes...</>) : (<><Save className="h-5 w-5 mr-2"/> Save Profile Changes</>)}
                    </Button>
                </div>
                </form>
            </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default SpecialistProfileSettings;