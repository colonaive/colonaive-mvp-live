import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, ArrowRight } from 'lucide-react';

const ClinicianThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-20">
      <Container>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-green-600 mb-6">
                Thank You for Joining Our Movement!
              </h1>
              
              <div className="space-y-6">
                <p className="text-xl text-gray-700">
                  Your registration has been received. We're excited to have you join Singapore's fight against colorectal cancer.
                </p>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold mb-4">What happens next?</h2>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Our team will verify your medical credentials
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      You'll receive a confirmation email within 1-2 business days
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Once approved, your clinic/specialist profile will be listed
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-blue-800">
                    While waiting for verification, you can explore our clinician resources 
                    and learn more about our movement's vision.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/education/clinicians')}
                  >
                    Browse Resources
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard/clinician')}
                    className="group"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ClinicianThankYouPage;