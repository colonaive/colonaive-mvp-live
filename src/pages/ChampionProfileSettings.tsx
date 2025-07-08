// /home/project/src/pages/ChampionProfileSettings.tsx

import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import { toast } from '../utils/toast';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import { Loader2, AlertCircle, CheckCircle, Save, ArrowLeft, User, Shield } from 'lucide-react';

interface ChampionProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

const ChampionProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, userType } = useAuth();

  const [formData, setFormData] = useState<Partial<ChampionProfileFormData>>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ChampionProfileFormData | 'form', string>>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return; 
    }
    if (userType !== 'champion' && userType !== 'member') {
      navigate('/dashboard/champion');
      return;
    }

    const fetchProfile = async () => {
      setInitialLoading(true);
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email, phone_number, address')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        const { data: champion, error: champError } = await supabase
          .from('champions')
          .select('date_of_birth')
          .eq('id', user.id)
          .single();

        if (champError && champError.code !== 'PGRST116') throw champError;

        setFormData({
          fullName: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone_number || '',
          address: profile.address || '',
          dateOfBirth: champion?.date_of_birth || '',
        });
      } catch (error: any) {
        console.error("Error loading profile:", error);
        setErrors({ form: "Unable to load profile data. " + error.message });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [authLoading, user, userType, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ChampionProfileFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ChampionProfileFormData, string>> = {};
    if (!formData.fullName?.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";
    if (!formData.dateOfBirth?.trim()) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.address?.trim()) newErrors.address = "Address is required";
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
      const { error } = await supabase.rpc('update_champion_profile_details', {
        p_user_id: user.id,
        p_full_name: formData.fullName, 
        p_phone_number: formData.phone,
        p_address: formData.address,
        p_date_of_birth: formData.dateOfBirth,
      });

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setSuccessMessage("Profile updated successfully!"); 
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error: any) {
      console.error("Profile update failed:", error);
      setErrors({ form: error.message || "Failed to update profile." });
      toast.error("Update failed: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || initialLoading) {
    return (
      <Container className="py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
        Loading profile...
      </Container>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-gray-100 min-h-screen py-8 md:py-12">
      <Container className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Champion Profile Settings</h1>
          <p className="mt-2 text-gray-600">Update your personal details and join the movement.</p>
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-y-6">
            <InputField
              id="fullName"
              name="fullName"
              label="Full Name"
              value={formData.fullName || ''}
              onChange={handleChange}
              error={errors.fullName}
              required
            />
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input type="email" id="email" value={formData.email || ''} disabled className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 rounded-lg shadow-sm" />
              </div>
            </div>
            <InputField
              id="phone"
              name="phone"
              label="Phone Number"
              value={formData.phone || ''}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+65 9123 4567"
              required
            />
            <InputField
              id="dateOfBirth"
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              error={errors.dateOfBirth}
              required
            />
            <InputField
              id="address"
              name="address"
              label="Address"
              value={formData.address || ''}
              onChange={handleChange}
              error={errors.address}
              placeholder="123 Main Street, Singapore 123456"
              required
            />
          </div>

          <div className="pt-6 flex justify-end">
            <Button type="submit" className="py-2.5 px-6 text-base font-semibold bg-blue-600 hover:bg-blue-700 flex items-center justify-center" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="h-5 w-5 animate-spin mr-2" />Saving...</>) : (<><Save className="h-5 w-5 mr-2" />Save Changes</>)}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default ChampionProfileSettings;
