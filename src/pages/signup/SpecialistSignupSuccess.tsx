// src/pages/signup/SpecialistSignupSuccess.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';

const SpecialistSignupSuccess: React.FC = () => {
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <Container className="max-w-xl">
        <Card className="shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to COLONAiVE™!</h1>
            <p className="text-gray-700 mb-4">
              Thank you for joining our mission to reduce colorectal cancer mortality in Singapore.
            </p>
            <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg p-4 mb-6">
              Our medical onboarding team will verify your specialist credentials and clinic details
              before listing you publicly on the platform.
            </div>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-4 mb-6">
              📧 <strong>Important:</strong> Please check your email{email && ` (${email})`} to verify your account.
              <br />Click the link in your inbox to activate your login access.
            </div>
            <Button className="w-full" onClick={() => window.location.href = '/'}>
              ⬅ Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default SpecialistSignupSuccess;
