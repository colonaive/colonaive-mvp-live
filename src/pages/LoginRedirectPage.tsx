import React, { useEffect } from 'react';
import AuthRedirector from '../components/AuthRedirector';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { toast } from '../utils/toast';

const LoginRedirectPage: React.FC = () => {
  const location = useLocation(); 

  useEffect(() => {
    // Detect email verification from Supabase
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      toast.success('✅ Email verified successfully! Redirecting to your dashboard...');
    }
  }, [location]); 

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <AuthRedirector />
      <div className="flex items-center gap-3 text-lg text-gray-700">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <h2>Loading Your Dashboard...</h2>
      </div> 
    </div>
  );
};

export default LoginRedirectPage;