import React, { useState } from 'react';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChampionChoiceModal } from '../components/ChampionChoiceModal';
import { useNavigate } from 'react-router-dom';
import { Activity, Microscope } from 'lucide-react';

const GetScreenedPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'gp' | 'specialist'>('gp');
  const navigate = useNavigate();

  const handleOpenModal = (type: 'gp' | 'specialist') => {
    setModalType(type);
    setShowModal(true);
  };

  const handleChoice = (hasDoctor: boolean) => {
    setShowModal(false);
    if (hasDoctor) {
      navigate('/');
    } else {
      navigate('/clinics');
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Get Screened Today</h1>
            <p className="text-xl mb-0">
              Choose your preferred screening pathway and take the first step towards prevention.
            </p>
          </div>
        </Container>
      </div>

      {/* Screening Options */}
      <section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* GP Card */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <Activity className="h-12 w-12 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-4">
                    Blood-Based Screening
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                  HSA-cleared blood-based screening test is for individuals not due for colonoscopy and younger individuals with elevated risk of early-onset CRC for early triage to colonoscopy.
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleOpenModal('gp')}
                  >
                    Find a GP
                  </Button>
                </CardContent>
              </Card>

              {/* Specialist Card */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <Microscope className="h-12 w-12 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-center mb-4">
                    Colonoscopy Consultation
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    Recommended for adults aged 50+, or earlier for those at 
                    higher risk.
                  </p>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleOpenModal('specialist')}
                  >
                    Find a Specialist
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <div className="mt-12 bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-bold text-center mb-4">
                Not Sure Which Option to Choose?
              </h3>
              <p className="text-gray-700 text-center mb-6">
                Our Champion Support Team can help guide you to the most suitable 
                screening option based on your age, risk factors, and preferences.
              </p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => handleOpenModal('gp')}>
                  Get Personalized Guidance
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Champion Choice Modal */}
      {showModal && (
        <ChampionChoiceModal
          type={modalType}
          onClose={() => setShowModal(false)}
          onChoice={handleChoice}
        />
      )}
    </div>
  );
};

export default GetScreenedPage;