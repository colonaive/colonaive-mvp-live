import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../supabase';
import { authUtils } from '../../utils/auth';
import { authToast } from '../../utils/toast';
import { supabase } from '../../supabase';
import { CheckCircle, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const ChampionSignUp: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!authUtils.isValidEmail(formData.email)) newErrors.email = 'Please enter a valid email address';

    const pwVal = authUtils.validatePassword(formData.password);
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!pwVal.isValid) newErrors.password = pwVal.message;

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (!password) return { score: 0, label: 'Very Weak', color: 'bg-red-500' };
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-green-600'];
    return { score: strength, label: labels[strength], color: colors[strength] };
  };
  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});

    try {
      console.log('🚀 Starting Champion signup process...');
      
      // Use enhanced signUp function
      const { data, error } = await authApi.signUp(
        formData.email,
        formData.password, 
        { 
          full_name: formData.fullName.trim(),
          user_type: 'champion' 
        },
        {
          emailRedirectTo: 'https://www.colonaive.ai/login?verified=true'
        }
      );
      
      if (error) {
        console.error('❌ Auth Error:', error);
        throw error;
      }
      
      if (!data.user) {
        console.error('❌ No user returned from auth signup');
        throw new Error("User account creation failed in Supabase Auth.");
      }
      
      console.log('✅ User created successfully:', data.user.id);
      
      // Profile and champion records are created automatically by the database trigger
      console.log('✅ Profile and champion records will be created by database trigger');

      authToast.signUpSuccess(); 
      navigate('/champion-signup-success');

    } catch (error: any) {
      console.error("❌ CHAMPION SIGNUP FAILED:", error);
      const message = error.message || 'An unexpected error occurred during signup.';
      setErrors({ form: message });
      authToast.signUpError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Join as a Champion</h1>
          <p className="text-xl">
            Together, we can outsmart colorectal cancer.
          </p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {errors.form && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{errors.form}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
            <input type="text" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your full name" disabled={isSubmitting}/>
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
            <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your email" disabled={isSubmitting}/>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`} placeholder="Create a secure password" disabled={isSubmitting}/>
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)} disabled={isSubmitting}>
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                </div>
              </div>
            )}
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} placeholder="Confirm your password" disabled={isSubmitting}/>
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isSubmitting}>
                {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-start space-x-3">
            <input id="agreedToTerms" type="checkbox" checked={formData.agreedToTerms} onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1" disabled={isSubmitting}/>
            <label htmlFor="agreedToTerms" className="text-sm text-gray-700">I agree to the <a href="/terms-of-use" className="text-blue-600 hover:text-blue-700 underline font-medium">Terms and Conditions</a> and <a href="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline font-medium">Privacy Policy</a> <span className="text-red-500">*</span></label>
          </div>
          {errors.agreedToTerms && <p className="text-red-500 text-sm ml-7">{errors.agreedToTerms}</p>}

          <div className="pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold text-white flex justify-center items-center space-x-2 transition ease-in-out duration-150 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Create Champion Account</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionSignUp;