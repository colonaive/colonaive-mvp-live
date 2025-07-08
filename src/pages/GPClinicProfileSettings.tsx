// /home/project/src/pages/GPClinicProfileSettings.tsx
import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../utils/toast';
import { supabase } from '../supabase';
import { Container } from '../components/ui/Container';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import { 
  Building, Phone, Mail, MapPin, Globe, Stethoscope, User, Shield, Clock, ListChecks, FileText,
  AlertCircle, Loader2, CheckCircle, Save, ArrowLeft
} from 'lucide-react';

interface GPClinicProfileData {
  contactPersonName: string; 
  phoneNumber: string; 
  email: string; 
  clinicName: string;
  doctorFullName: string;
  licenseNumber: string;
  address: string;
  postalCode: string;
  region: string;
  servicesOffered: string[];
  operatingHours: { weekdays: string; saturday: string; sunday: string; publicHoliday: string; };
  languagesSpoken: string;
  website: string;
  description: string;
}

const SERVICE_OPTIONS_GP = [ 
  'ColonAiQ® Blood Test', 'FIT Test', 'Colonoscopy Referral', 'Pre-Colonoscopy Consultation', 
  'General Health Screening', 'Chronic Disease Management', 'Vaccinations', 'Basic Consultations'
];

const GPClinicProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, userType } = useAuth();
  
  const [formData, setFormData] = useState<Partial<GPClinicProfileData>>({
    operatingHours: { weekdays: '', saturday: '', sunday: '', publicHoliday: '' },
    servicesOffered: [],
  });
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof GPClinicProfileData | 'form', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const regionOptions = ['North', 'South', 'East', 'West', 'Central'];

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login'); 
      return; 
    }
    if (userType && userType !== 'gpclinic') { 
      navigate(getDashboardRoute(userType)); // Use a local or imported getDashboardRoute
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
        if (!profileData) throw new Error("User profile (contact) not found.");

        const { data: clinicData, error: clinicError } = await supabase
          .from('gpclinics') 
          .select('*') 
          .eq('id', user.id) 
          .single();
        
        if (clinicError && clinicError.code !== 'PGRST116') {
            throw clinicError;
        }

        setFormData({
          contactPersonName: profileData.full_name || '',
          email: profileData.email || '', 
          phoneNumber: profileData.phone_number || '',
          clinicName: clinicData?.clinic_name || '',
          doctorFullName: clinicData?.doctor_full_name || '',
          licenseNumber: clinicData?.license_number || '',
          address: clinicData?.address || '',
          postalCode: clinicData?.postal_code || '',
          region: clinicData?.region || '',
          servicesOffered: clinicData?.services_offered || [],
          operatingHours: clinicData?.operating_hours || { weekdays: '', saturday: '', sunday: '', publicHoliday: '' },
          languagesSpoken: clinicData?.languages_spoken || '',
          website: clinicData?.website || '',
          description: clinicData?.description || '',
        });
      } catch (error: any) {
        console.error("Error fetching GP Clinic profile:", error);
        setErrors({ form: "Failed to load clinic profile data. " + error.message });
      } finally {
        setInitialLoading(false);
      }
    };

    if (user && userType === 'gpclinic') {
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
    if (errors[name as keyof GPClinicProfileData]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered?.includes(service)
        ? prev.servicesOffered.filter(s => s !== service)
        : [...(prev.servicesOffered || []), service]
    }));
    if (errors.servicesOffered) setErrors(prev => ({ ...prev, servicesOffered: undefined }));
  };
  
  const validateForm = (): boolean => { 
    const newErrors: Partial<Record<keyof GPClinicProfileData, string>> = {};
    if (!formData.contactPersonName?.trim()) newErrors.contactPersonName = 'Contact person name is required';
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Contact phone number is required';
    if (!formData.clinicName?.trim()) newErrors.clinicName = 'Clinic name is required';
    if (!formData.doctorFullName?.trim()) newErrors.doctorFullName = "Doctor's full name is required";
    if (!formData.licenseNumber?.trim()) newErrors.licenseNumber = 'Clinic license number is required';
    if (!formData.address?.trim()) newErrors.address = 'Clinic address is required';
    if (!formData.postalCode?.trim() || !/^\d{6}$/.test(formData.postalCode!)) newErrors.postalCode = 'Valid 6-digit postal code is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.servicesOffered || formData.servicesOffered.length === 0) newErrors.servicesOffered = 'Please select at least one service';
    if (!formData.operatingHours?.weekdays?.trim()) {
        const currentErrors = errors.operatingHours;
        // Check if it's already a string (general error) or an object (specific field errors)
        if (typeof currentErrors !== 'object' || currentErrors === null) {
            newErrors.operatingHours = 'Weekday operating hours are required';
        } else if (currentErrors && !(currentErrors as any).weekdays) {
             (newErrors.operatingHours as any) = {...currentErrors, weekdays: 'Weekday operating hours are required'};
        }
    }
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
      const { error: updateError } = await supabase.rpc('update_gp_clinic_profile', {
        p_user_id: user.id,
        p_contact_person_name: formData.contactPersonName!,
        p_phone_number: formData.phoneNumber!,
        p_clinic_name: formData.clinicName!,
        p_doctor_full_name: formData.doctorFullName!,
        p_license_number: formData.licenseNumber!,
        p_address: formData.address!,
        p_postal_code: formData.postalCode!,
        p_region: formData.region!,
        p_services_offered: formData.servicesOffered!,
        p_operating_hours: formData.operatingHours!,
        p_languages_spoken: formData.languagesSpoken || null,
        p_website: formData.website || null,
        p_description: formData.description || null
      });

      if (updateError) throw updateError;

      setSuccessMessage('Clinic profile updated successfully!');
      toast.success('Clinic profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error: any) {
      console.error("Error updating GP Clinic profile:", error);
      const errorMessage = error.message || 'An unexpected error occurred.';
      setErrors({ form: errorMessage });
      toast.error(`Update failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (initialLoading || authLoading) {
    return (
      <Container className="py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
        Loading clinic settings...
      </Container>
    );
  }

  // Local getDashboardRoute or import from shared location
  function getDashboardRoute(userType: string | null | undefined): string { 
    switch (userType) {
      case 'GPClinic': return '/dashboard/gp-clinic';
      case 'specialist': return '/dashboard/specialist';
      case 'corporate_contact': return '/dashboard/corporate';
      default: return '/dashboard/champion'; 
    }
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 via-green-50 to-gray-100 min-h-screen py-8 md:py-12">
      <Container className="max-w-5xl mx-auto">
        <div className="mb-8">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-teal-700 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">GP Clinic Profile Settings</h1>
            <p className="mt-2 text-md text-gray-600">Manage your clinic's information and partnership details with COLONAiVE™.</p>
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
                        <Building className="h-6 w-6 text-teal-600" />
                        <h2 className="text-xl font-semibold text-gray-700">Clinic Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField id="clinicName" name="clinicName" label="Clinic Name" value={formData.clinicName || ''} onChange={handleInputChange} error={errors.clinicName} required disabled={isSubmitting}/>
                        <InputField id="doctorFullName" name="doctorFullName" label="Principal Doctor's Full Name" value={formData.doctorFullName || ''} onChange={handleInputChange} error={errors.doctorFullName} required disabled={isSubmitting}/>
                        <InputField id="licenseNumber" name="licenseNumber" label="Clinic License Number" value={formData.licenseNumber || ''} onChange={handleInputChange} error={errors.licenseNumber} required disabled={isSubmitting}/>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                        <User className="h-6 w-6 text-teal-600" />
                        <h2 className="text-xl font-semibold text-gray-700">Account Admin Contact</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField id="contactPersonName" name="contactPersonName" label="Contact Person Full Name" value={formData.contactPersonName || ''} onChange={handleInputChange} error={errors.contactPersonName} required disabled={isSubmitting}/>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address (Login)</label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" id="email" value={formData.email || ''} disabled className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600" />
                            </div>
                             <p className="mt-1 text-xs text-gray-500">Login email cannot be changed here.</p>
                        </div>
                        <InputField id="phoneNumber" name="phoneNumber" label="Contact Phone Number" type="tel" value={formData.phoneNumber || ''} onChange={handleInputChange} error={errors.phoneNumber} required disabled={isSubmitting}/>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200"><MapPin className="h-6 w-6 text-teal-600" /><h2 className="text-xl font-semibold text-gray-700">Clinic Location</h2></div>
                    <InputField id="address" name="address" label="Clinic Address" value={formData.address || ''} onChange={handleInputChange} error={errors.address} required disabled={isSubmitting}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                        <InputField id="postalCode" name="postalCode" label="Postal Code" value={formData.postalCode || ''} onChange={handleInputChange} error={errors.postalCode} required maxLength={6} disabled={isSubmitting}/>
                        <div>
                            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region <span className="text-red-500">*</span></label>
                            <select id="region" name="region" value={formData.region || ''} onChange={handleInputChange} disabled={isSubmitting} className={`w-full mt-1 px-3 py-2 border rounded-lg shadow-sm ${errors.region ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'} focus:border-teal-500`}>
                                <option value="">Select region</option>
                                {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.region && <p className="text-sm text-red-600 mt-1">{errors.region}</p>}
                        </div>
                    </div>
                     <div className="mt-4"><InputField id="website" name="website" label="Clinic Website (Optional)" type="url" value={formData.website || ''} onChange={handleInputChange} error={errors.website} disabled={isSubmitting}/></div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200"><ListChecks className="h-6 w-6 text-teal-600" /><h2 className="text-xl font-semibold text-gray-700">Services & Operations</h2></div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-1 border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                    {SERVICE_OPTIONS_GP.map((service) => (
                    <label key={service} className={`relative flex items-center cursor-pointer rounded-md border p-3 transition-colors duration-150 ease-in-out shadow-sm ${formData.servicesOffered?.includes(service) ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input type="checkbox" className="sr-only peer" checked={formData.servicesOffered?.includes(service)} onChange={() => handleServiceChange(service)} disabled={isSubmitting}/>
                        <span className="text-sm text-gray-700 peer-checked:font-semibold peer-checked:text-teal-700">{service}</span>
                        <CheckCircle className={`h-5 w-5 text-teal-600 absolute top-1/2 right-3 transform -translate-y-1/2 transition-opacity opacity-0 ${formData.servicesOffered?.includes(service) ? 'opacity-100' : ''}`} />
                    </label>
                    ))}
                  </div>
                  {errors.servicesOffered && <p className="text-sm text-red-600 mt-1">{errors.servicesOffered}</p>}
                  
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Operating Hours</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField id="operatingHours.weekdays" name="operatingHours.weekdays" label="Weekdays" value={formData.operatingHours?.weekdays || ''} onChange={handleInputChange} error={errors.operatingHours && typeof errors.operatingHours === 'object' ? (errors.operatingHours as any).weekdays : undefined} required placeholder="e.g., 9 AM - 6 PM" disabled={isSubmitting}/>
                        <InputField id="operatingHours.saturday" name="operatingHours.saturday" label="Saturday" value={formData.operatingHours?.saturday || ''} onChange={handleInputChange} placeholder="e.g., 9 AM - 1 PM" disabled={isSubmitting}/>
                        <InputField id="operatingHours.sunday" name="operatingHours.sunday" label="Sunday" value={formData.operatingHours?.sunday || ''} onChange={handleInputChange} placeholder="e.g., Closed" disabled={isSubmitting}/>
                        <InputField id="operatingHours.publicHoliday" name="operatingHours.publicHoliday" label="Public Holidays" value={formData.operatingHours?.publicHoliday || ''} onChange={handleInputChange} placeholder="e.g., 10 AM - 2 PM / Closed" disabled={isSubmitting}/>
                    </div>
                    {errors.operatingHours && typeof errors.operatingHours === 'string' && <p className="text-red-500 text-xs mt-1">{errors.operatingHours}</p>}
                  </div>
                  <div className="mt-4"><InputField id="languagesSpoken" name="languagesSpoken" label="Languages Spoken by Staff (Optional)" value={formData.languagesSpoken || ''} onChange={handleInputChange} placeholder="English, Mandarin, Malay" disabled={isSubmitting}/></div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200"><FileText className="h-6 w-6 text-teal-600" /><h2 className="text-xl font-semibold text-gray-700">Clinic Description</h2></div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">About Your Clinic <span className="text-gray-500">(Optional)</span></label>
                        <textarea id="description" name="description" rows={5} value={formData.description || ''} onChange={handleInputChange} disabled={isSubmitting} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Share more about your clinic's services, patient care philosophy, or any unique aspects. This will be visible on your public profile."/>
                    </div>
                </section>
                
                <div className="pt-8 mt-6 border-t border-gray-200 flex justify-end">
                    <Button type="submit" className="w-full md:w-auto py-2.5 px-6 text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center" disabled={isSubmitting || initialLoading}>
                    {isSubmitting ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" /> Saving Changes...</>) : (<><Save className="h-5 w-5 mr-2"/> Save Clinic Profile</>)}
                    </Button>
                </div>
                </form>
            </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default GPClinicProfileSettings;