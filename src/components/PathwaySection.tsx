import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Stethoscope, FlaskConical, Building } from 'lucide-react';
import { Container } from './ui/Container';
import { Card, CardContent } from './ui/Card';

const pathwayGroups = [
  {
    title: "Patient Pathways",
    description: "Resources, education, and tools for individuals seeking screening and prevention information.",
    icon: <Users className="h-5 w-5 text-blue-600" />,
    cards: [
      {
        title: "Understand CRC",
        description: "Learn about colorectal cancer, risk factors, and prevention.",
        link: "/education/patients/colorectal-cancer"
      },
      {
        title: "Choose Screening",
        description: "Explore different screening methods and find what's right for you.",
        link: "/choose-screening"
      },
      {
        title: "Find a Clinic",
        description: "Locate clinics and specialists in your area.",
        link: "/clinics"
      },
      {
        title: "Track Screening",
        description: "Monitor your screening schedule and results.",
        link: "/track-screening"
      }
    ]
  },
  {
    title: "Clinician Pathways",
    description: "Resources and tools for healthcare providers participating in the movement.",
    icon: <Stethoscope className="h-5 w-5 text-teal-600" />,
    cards: [
      {
        title: "GP Portal",
        description: "Resources for general practitioners to support early detection.",
        link: "/dashboard/clinician"
      },
      {
        title: "Specialist Portal",
        description: "Collaboration tools for specialists and advanced screening protocols.",
        link: "/profile/specialist"
      }
    ]
  },
  {
    title: "Lab Partners",
    description: "Information for laboratory partners and diagnostic services.",
    icon: <FlaskConical className="h-5 w-5 text-purple-600" />,
    cards: [
      {
        title: "Lab Portal",
        description: "Access resources and protocols for diagnostic testing.",
        link: "/lab-portal"
      }
    ]
  },
  {
    title: "Corporate CSR",
    description: "Information for corporations looking to support the movement.",
    icon: <Building className="h-5 w-5 text-indigo-600" />,
    cards: [
      {
        title: "Corporate Portal",
        description: "Learn how your organization can contribute to the cause.",
        link: "/corporate-portal"
      }
    ]
  }
];

export const PathwaySection: React.FC = () => {
  return (
    <section className="py-4 bg-gray-50 mt-[144px]">
      <Container>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2">Explore Your Pathway</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Our movement provides resources for everyone involved in the fight against colorectal cancer.
          </p>
        </div>

        <div className="space-y-6">
          {pathwayGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="flex items-center mb-2">
                {group.icon}
                <h3 className="text-base font-bold ml-2">{group.title}</h3>
              </div>
              <p className="text-gray-600 mb-3 text-sm max-w-2xl">{group.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {group.cards.map((card, cardIndex) => (
                  <Link key={cardIndex} to={card.link}>
                    <Card className="h-full hover:shadow-md transition-shadow duration-300">
                      <CardContent className="p-3">
                        <h4 className="text-sm font-semibold mb-1">{card.title}</h4>
                        <p className="text-xs text-gray-600">{card.description}</p>
                        <div className="mt-2 flex justify-end">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};