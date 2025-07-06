import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../supabase';
import { authUtils } from '../../utils/auth';
import { authToast } from '../../utils/toast';
import { supabase } from '../../supabase';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import { 
  Building2, Phone, Mail, MapPin, Globe, Stethoscope, User, Clock,
  AlertCircle, Loader2, CheckCircle, Eye, EyeOff, Home 
} from 'lucide-react';

interface ClinicFormData {
  clinicName: string;
  doctorFullName: string;
  contactPersonName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string; 
  address: string;
  postalCode: string;
  region: string;
  licenseNumber: string;
  servicesOffered: string[];
  operatingHours: { weekdays: string; saturday: string; sunday: string; publicHoliday: string; };
  languagesSpoken: string;
  website: string;
  description: string;
  agreedToTerms: boolean;
}

const GPClinicSignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<ClinicFormData>({
    clinicName: '', doctorFullName: '', contactPersonName: '', email: '',
    password: '', confirmPassword: '', phoneNumber: '', address: '',
    postalCode: '', region: '', licenseNumber: '', servicesOffered: [],
    operatingHours: { weekdays: '', saturday: '', sunday: '', publicHoliday: '' },
    languagesSpoken: '', website: '', description: '', agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClinicFormData | 'form', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false); 
  const serviceOptions = [ 'ColonAiQ® Blood Test', 'FIT Test', 'Colonoscopy Referral', 'Pre-Colonoscopy Consultation', 'General Health Screening', 'Chronic Disease Management', 'Vaccinations' ];
  const regionOptions = ['North', 'South', 'East', 'West', 'Central'];
  
  useEffect(() => {
    if (showSuccessScreen) {
      window.scrollTo(0, 0);
    }
  }, [showSuccessScreen]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === 'checkbox' && name === 'agreedToTerms') { 
      setFormData(prev => ({ ...prev, [name]: checked })); 
    }
    else if (name.startsWith('operatingHours.')) { 
      const key = name.split('.')[1]; 
      setFormData(prev => ({ ...prev, operatingHours: { ...prev.operatingHours, [key]: value } }));
    }
    else { 
      setFormData(prev => ({ ...prev, [name]: value })); 
    }
    
    if (errors[name as keyof ClinicFormData]) { 
      setErrors(prev => ({ ...prev, [name]: undefined })); 
    }
  };
  
  const handleServiceChange = (service: string) => { 
    setFormData(prev => ({
        ...prev, 
        servicesOffered: prev.servicesOffered.includes(service) 
            ? prev.servicesOffered.filter(s => s !== service) 
            : [...prev.servicesOffered, service] 
    })); 
    
    if (errors.servicesOffered) { 
        setErrors(prev => ({ ...prev, servicesOffered: undefined })); 
    }
  };
  
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length > 0 && /[a-z]/.test(password)) strength++;
    if (password.length > 0 && /[A-Z]/.test(password)) strength++;
    if (password.length > 0 && /[0-9]/.test(password)) strength++;
    if (password.length > 0 && /[^A-Za-z0-9]/.test(password)) strength++;
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-green-700'];
    const score = Math.min(strength, labels.length -1); 
    return { score: score, label: labels[score], color: colors[score] };
  };
  
  const passwordStrength = getPasswordStrength(formData.password);
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClinicFormData, string>> = {};
    if (!formData.clinicName.trim()) newErrors.clinicName = 'Clinic name is required';
    if (!formData.doctorFullName.trim()) newErrors.doctorFullName = "Doctor's full name is required";
    if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Contact person name is required (for account admin)';
    if (!formData.email.trim()) newErrors.email = 'Email is required for login'; 
    else if (!authUtils.isValidEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
    
    const pwVal = authUtils.validatePassword(formData.password); 
    if (!formData.password) newErrors.password = 'Password is required'; 
    else if (!pwVal.isValid) newErrors.password = pwVal.message;
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'; 
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Contact phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Clinic address is required';
    if (!formData.postalCode.trim() || !/^\d{6}$/.test(formData.postalCode)) newErrors.postalCode = 'Valid 6-digit postal code is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'Clinic license number is required';
    if (formData.servicesOffered.length === 0) newErrors.servicesOffered = 'Select at least one service offered';
    if (!formData.operatingHours.weekdays?.trim()) {
        newErrors.operatingHours = 'Weekday operating hours are required';
    }
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the partnership terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      console.log('🚀 Starting GP Clinic signup process...');
      
      // Create auth user first
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.contactPersonName.trim(),
            user_type: 'gpclinic' 
          },
          emailRedirectTo: 'https://www.colonaive.ai/login?verified=true',
        },
      });

      if (error) throw error;
      
      if (!data.user) {
        console.error('❌ No user returned from auth signup');
        throw new Error("User account creation failed in Supabase Auth.");
      }
      
      console.log('✅ User created:', data.user.id);

      // Profile and gpclinic records are created automatically by the database trigger
      console.log('✅ Profile and gpclinic records will be created by database trigger');
      
      // Call RPC to create full GP clinic account
      console.log('🏥 Creating GP Clinic account...');
      try {
        const { error: rpcError } = await supabase.rpc('create_full_gp_clinic_account', {
          p_user_id: data.user.id,
          p_contact_person_name: formData.contactPersonName.trim(),
          p_email: formData.email.trim(), 
          p_phone_number: formData.phoneNumber.trim(),
          p_clinic_name: formData.clinicName.trim(),
          p_doctor_full_name: formData.doctorFullName.trim(),
          p_license_number: formData.licenseNumber.trim(),
          p_address: formData.address.trim(),
          p_postal_code: formData.postalCode.trim(),
          p_region: formData.region,
          p_services_offered: formData.servicesOffered,
          p_operating_hours: formData.operatingHours,
          p_languages_spoken: formData.languagesSpoken.trim() || null,
          p_website: formData.website.trim() || null,
          p_description: formData.description.trim() || null
        });
        
        if (rpcError) {
          console.error('❌ RPC Error:', rpcError);
          // Check for specific error types 
          if (rpcError.message?.includes('function') && rpcError.message?.includes('does not exist')) {
            throw new Error('The registration system is currently being updated. Please try again in a few minutes.');
          } else {
            throw new Error(`Database error: ${rpcError.message || 'Failed to create clinic profile'}`);
          }
        }
      } catch (rpcCallError: any) {
        console.error('❌ RPC Call Failed:', rpcCallError);
        throw new Error(`Failed to create clinic profile: ${rpcCallError.message}`);
      }
      
      console.log('✅ GP Clinic account created successfully!');
      authToast.signUpSuccess("Clinic registration submitted! Please check your email.");
      setShowSuccessScreen(true);
    } catch (error: any) {
      console.error("❌ GP CLINIC SIGNUP FAILED:", error);
      
      // Provide specific error messages
      let message = error.message || 'An unexpected error occurred during clinic registration.';
      
      // Handle specific error cases
      if (message.includes('already registered')) {
        message = 'This email is already registered. Please use a different email or try logging in.';
      } else if (message.includes('Database error')) {
        message = 'There was a database error during registration. Please try again in a few minutes.';
      }
      
      setErrors({ form: message });
      authToast.signUpError(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (showSuccessScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="max-w-xl mx-auto shadow-2xl w-full">
          <CardContent className="p-8 md:p-12 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Registration Submitted!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for registering your GP Clinic with Project COLONAiVE™.
            </p>
            <div className="bg-yellow-50 p-6 rounded-lg my-8 text-left shadow-inner border border-yellow-200">
              <p className="text-yellow-800 font-semibold text-lg mb-2 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-yellow-700"/> Step 1: Verify Your Email
              </p>
              <p className="text-yellow-700 text-sm">
                A confirmation link has been sent to <span className="font-semibold">{formData.email}</span>. 
                Please click this link to verify your email address and activate the clinic account.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg my-8 text-left shadow-inner border border-blue-200">
              <p className="text-blue-800 font-semibold text-lg mb-2 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-700"/> Step 2: Partnership Review
              </p>
              <p className="text-blue-700 text-sm">
                Our team will review your clinic's application. You will be notified once approved. 
                After approval and email verification, you will be able to log in to the Clinic Dashboard.
              </p>
            </div>
            <Link to="/">
              <Button className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white">
                <Home className="h-5 w-5" />
                Return to Homepage
              </Button>
            </Link>
             <p className="text-xs text-gray-500 mt-8">
              If you don't receive the email within a few minutes, please check your spam folder.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <Container><div className="max-w-3xl mx-auto text-center"><h1 className="text-4xl font-bold mb-4">GP Clinic Registration</h1><p className="text-xl">Partner with COLONAiVE to provide vital colorectal cancer screening services.</p></div></Container>
      </div>
      <Container className="px-4 py-12">
        <Card className="max-w-4xl mx-auto shadow-lg"><CardContent className="p-6 md:p-8">
            {errors.form && (<div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 flex items-center gap-2"><AlertCircle className="h-5 w-5" /> <p>{errors.form}</p></div>)}
            <form onSubmit={handleSubmit} className="space-y-10" noValidate>
                <section>
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200"><Building2 className="h-6 w-6 text-blue-600" /><h2 className="text-xl font-semibold text-gray-700">Clinic Details</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField id="clinicName" name="clinicName" label="Clinic Name" value={formData.clinicName} onChange={handleInputChange} error={errors.clinicName} required placeholder="ABC Family Clinic" disabled={isSubmitting}/>
                    <InputField id="doctorFullName" name="doctorFullName" label="Principal Doctor's Full Name" value={formData.doctorFullName} onChange={handleInputChange} error={errors.doctorFullName} required placeholder="Dr. John Smith" disabled={isSubmitting}/>
                     <InputField id="licenseNumber" name="licenseNumber" label="Clinic License Number" value={formData.licenseNumber} onChange={handleInputChange} error={errors.licenseNumber} required placeholder="MOH License Number" disabled={isSubmitting}/>
                  </div>
                </section>
                <section>
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200"><User className="h-6 w-6 text-blue-600" /><h2 className="text-xl font-semibold text-gray-700">Account Administrator & Login</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField id="contactPersonName" name="contactPersonName" label="Contact Person Name (Account Admin)" value={formData.contactPersonName} onChange={handleInputChange} error={errors.contactPersonName} required autoComplete="name" placeholder="e.g., Clinic Manager" disabled={isSubmitting}/>
                    <InputField id="email" name="email" label="Email Address (for login)" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} required autoComplete="email" placeholder="admin@abcclinic.com" disabled={isSubmitting}/>
                    <InputField id="phoneNumber" name="phoneNumber" label="Contact Phone Number" type="tel" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} required autoComplete="tel" placeholder="+65 6123 4567" disabled={isSubmitting}/>
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label><div className="relative"><input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:border-blue-500`} disabled={isSubmitting} placeholder="Create a secure password"/><button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}</button></div>{formData.password && (<div className="mt-1"><div className="flex items-center space-x-2"><div className="flex-1 bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score/ 5)*100}%` }}></div></div><span className="text-xs text-gray-500">{passwordStrength.label}</span></div></div>)}{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}</div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label><div className="relative"><input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChange} className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:border-blue-500`} disabled={isSubmitting} placeholder="Confirm your password"/><button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}</button></div>{errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}</div>
                  </div>
                </section>
                <section>
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200"><MapPin className="h-6 w-6 text-blue-600" /><h2 className="text-xl font-semibold text-gray-700">Clinic Location & Details</h2></div>
                  <InputField id="address" name="address" label="Clinic Address" value={formData.address} onChange={handleInputChange} error={errors.address} required placeholder="123 Main Street, #01-01, Singapore" disabled={isSubmitting}/>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                    <InputField id="postalCode" name="postalCode" label="Postal Code" value={formData.postalCode} onChange={handleInputChange} error={errors.postalCode} required placeholder="123456" maxLength={6} disabled={isSubmitting}/>
                    <div>
                        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region <span className="text-red-500">*</span></label>
                        <select id="region" name="region" value={formData.region} onChange={handleInputChange} disabled={isSubmitting} className={`w-full mt-1 px-3 py-2 border rounded-lg shadow-sm ${errors.region ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:border-blue-500`}>
                            <option value="">Select region</option>
                            {regionOptions.map(r => (<option key={r} value={r}>{r}</option>))}
                        </select>
                        {errors.region && <p className="text-sm text-red-600 mt-1">{errors.region}</p>}
                    </div>
                  </div>
                   <div className="mt-4"><InputField id="languagesSpoken" name="languagesSpoken" label="Languages Spoken by Staff (Optional)" value={formData.languagesSpoken} onChange={handleInputChange} placeholder="English, Mandarin, Malay" disabled={isSubmitting}/></div>
                  <div className="mt-4"><InputField id="website" name="website" label="Clinic Website (Optional)" type="url" value={formData.website} onChange={handleInputChange} error={errors.website} placeholder="https://www.abcclinic.com" disabled={isSubmitting}/></div>
                </section>
                <section>
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200"><Stethoscope className="h-6 w-6 text-blue-600" /><h2 className="text-xl font-semibold text-gray-700">Screening Services Offered</h2></div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select all available screening services at your clinic <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 border border-gray-200 rounded-lg">
                    {serviceOptions.map((service) => (<label key={service} className={`relative flex items-center cursor-pointer rounded-md border p-3 transition-colors duration-150 ease-in-out shadow-sm ${formData.servicesOffered.includes(service) ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-300 hover:border-gray-400'}`}><input type="checkbox" className="sr-only peer" checked={formData.servicesOffered.includes(service)} onChange={() => handleServiceChange(service)} disabled={isSubmitting}/><span className="text-sm text-gray-700 peer-checked:font-semibold peer-checked:text-blue-700">{service}</span><CheckCircle className={`h-5 w-5 text-blue-600 absolute top-1/2 right-3 transform -translate-y-1/2 transition-opacity opacity-0 ${formData.servicesOffered.includes(service) ? 'opacity-100' : ''}`} /></label>))}
                  </div>
                  {errors.servicesOffered && (<p className="text-sm text-red-600 mt-1">{errors.servicesOffered}</p>)}
                </section>
                <section>
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200"><Clock className="h-6 w-6 text-blue-600" /><h2 className="text-xl font-semibold text-gray-700">Operating Hours & Clinic Description</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <InputField id="operatingHours.weekdays" name="operatingHours.weekdays" label="Weekdays Hours" value={formData.operatingHours.weekdays} onChange={handleInputChange} error={errors.operatingHours?.weekdays} required placeholder="e.g., 9:00 AM - 6:00 PM" disabled={isSubmitting}/>
                    <InputField id="operatingHours.saturday" name="operatingHours.saturday" label="Saturday Hours" value={formData.operatingHours.saturday} onChange={handleInputChange} placeholder="e.g., 9:00 AM - 1:00 PM / Closed" disabled={isSubmitting}/>
                    <InputField id="operatingHours.sunday" name="operatingHours.sunday" label="Sunday Hours" value={formData.operatingHours.sunday} onChange={handleInputChange} placeholder="e.g., Closed" disabled={isSubmitting}/>
                    <InputField id="operatingHours.publicHoliday" name="operatingHours.publicHoliday" label="Public Holiday Hours" value={formData.operatingHours.publicHoliday} onChange={handleInputChange} placeholder="e.g., Closed / Special Hours" disabled={isSubmitting}/>
                  </div>
                   {errors.operatingHours && typeof errors.operatingHours === 'string' && <p className="text-red-500 text-xs mt-1">{errors.operatingHours}</p>}
                  <div className="mt-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Brief Clinic Description <span className="text-gray-500">(Optional)</span></label>
                    <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleInputChange} disabled={isSubmitting} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Share a brief overview of your clinic, its mission, or special patient care approaches..."/>
                  </div>
                </section>
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-start"><input id="agreedToTerms" name="agreedToTerms" type="checkbox" checked={formData.agreedToTerms} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 shadow-sm" /><label htmlFor="agreedToTerms" className="ml-3 block text-sm text-gray-900">I confirm that the information provided is accurate and I agree to the <a href="/terms-of-use" className="font-medium text-blue-600 hover:underline">Partnership Terms of Service</a> and <a href="/privacy-policy" className="font-medium text-blue-600 hover:underline">Privacy Policy</a>.<span className="text-red-500"> *</span></label></div>
                    {errors.agreedToTerms && <p className="text-red-500 text-sm mt-1 ml-7">{errors.agreedToTerms}</p>}
                </div>
                <div className="pt-6"><Button type="submit" className="w-full py-3 text-lg font-semibold bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center" disabled={isSubmitting}>{isSubmitting ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" /> Registering Clinic...</>) : 'Register Clinic with COLONAiVE™'}</Button></div>
            </form>
            <div className="mt-8 text-center border-t border-gray-200 pt-6"><p className="text-sm text-gray-600">Already a partner?{' '}<Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">Sign in to your Clinic Dashboard</Link></p></div>
        </CardContent></Card>
      </Container>
    </div>
  );
};

export default GPClinicSignUp;