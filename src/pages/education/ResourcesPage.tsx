import React from 'react';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Download, FileText, Presentation, Users } from 'lucide-react';

const resources = [
  {
    category: 'Patient Education Materials',
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    items: [
      {
        title: 'CRC Screening Guide',
        description: 'A comprehensive guide to colorectal cancer screening options and recommendations.',
        type: 'PDF',
        link: '#',
      },
      {
        title: 'Risk Factor Assessment',
        description: 'Interactive worksheet to help identify personal CRC risk factors.',
        type: 'Worksheet',
        link: '#',
      },
    ],
  },
  {
    category: 'Clinician Training Decks',
    icon: <Presentation className="h-6 w-6 text-purple-600" />,
    items: [
      {
        title: 'GP Activation Slides',
        description: 'Standardised deck for activating CRC screening discussions in clinics.',
        type: 'PPT',
        link: '#',
      },
    ],
  },
  {
    category: 'Community Outreach Assets',
    icon: <Users className="h-6 w-6 text-green-600" />,
    items: [
      {
        title: 'Poster: CRC Awareness Month',
        description: 'A4 printable poster to support community screening awareness.',
        type: 'Poster',
        link: '#',
      },
    ],
  },
];

const ResourcesPage: React.FC = () => {
  return (
    <div className="pt-32">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <FileText className="h-12 w-12 text-white mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">Educational Resources</h1>
            <p className="text-xl mb-0">
              Access our comprehensive collection of materials to support colorectal cancer awareness and prevention.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="max-w-4xl mx-auto py-12">
          <div className="space-y-12">
            {resources.map((section, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-3 mb-6">
                  {section.icon}
                  <h2 className="text-xl font-semibold">{section.category}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {section.items.map((item, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{item.type}</span>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-none">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Need Custom Materials?</h2>
                <p className="text-gray-700 mb-6">
                  Our Champion Support Team can help you find or create the resources you need.
                </p>
                <Button>Contact Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ResourcesPage;