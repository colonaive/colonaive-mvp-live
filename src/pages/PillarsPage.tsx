import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { pillars } from '../data/pillars';

const PillarsPage: React.FC = () => {
  const descriptions = {
    'RID-CRC PUB™': 'Mass public campaigns to raise awareness, encourage screening, and dismantle stigma.',
    'RID-CRC SGP™': 'Empower GPs and specialists to advocate screening and guide patients to timely action.',
    'RID-CRC GOV™': 'Collaborate with MOH, agencies, and institutions to expand screening access and support.',
    'RID-CRC CSR™': 'Engage corporations to drive CRC awareness through CSR programs and staff initiatives.',
    'RID-CRC EDU™': 'Build the national education hub for CRC prevention, tailored for the public and clinicians.'
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Movement Pillars</h1>
            <p className="text-xl mb-0">
              The five strategic pillars that form the foundation of our national movement
              to eliminate colorectal cancer by 2035.
            </p>
          </div>
        </Container>
      </div>

      {/* Pillars Section */}
      <section className="py-16 bg-blue-50">
        <Container>
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-xl text-center text-gray-700 pb-8">
              Join the 5 Strategic Pillars Driving a National CRC Prevention Movement.
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-stretch">
              {pillars.map((pillar, index) => (
                <Card 
                  key={index}
                  className="w-full shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-blue-600 min-h-[280px] flex flex-col"
                >
                  <CardContent className="p-8 flex flex-col items-center text-center h-full">
                    <div className="text-4xl mb-6">{pillar.icon}</div>
                    <div className="space-y-3 flex-grow flex flex-col items-center justify-center">
                      <h3 className="text-xl font-bold">{pillar.brand}</h3>
                      <h4 className="text-lg font-semibold text-gray-700">{pillar.label}</h4>
                      <p className="text-gray-600">{descriptions[pillar.brand]}</p>
                    </div>
                    <Link to={pillar.link} className="mt-6 w-full">
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Movement</h2>
            <p className="text-xl text-gray-600 mb-8">
              Together, we can eliminate colorectal cancer as a major health threat in Singapore by 2035.
            </p>
            <div className="space-x-4">
              <Link to="/signup/champion">
                <Button variant="primary">Champion Sign-Up</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <div className="py-8 bg-gray-50">
        <Container>
          <div className="text-center">
            <Link to="/">
              <Button variant="secondary">Return to Home</Button>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default PillarsPage;