import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, HandshakeIcon, ClipboardList } from 'lucide-react';

const modules = [
  {
    title: 'Find a GP',
    description: 'Locate a trusted clinic offering CRC screening.',
    link: '/find-a-gp',
    icon: <Stethoscope className="h-8 w-8 text-blue-600" />,
    color: 'from-blue-50 to-blue-100',
  },
  {
    title: 'Join the Movement',
    description: 'Pledge your support and become a CRC-Safe Champion.',
    link: '/join-the-movement',
    icon: <HandshakeIcon className="h-8 w-8 text-teal-600" />,
    color: 'from-teal-50 to-teal-100',
  },
  {
    title: 'Track My Screening',
    description: 'Review your past CRC tests and results history.',
    link: '#',
    icon: <ClipboardList className="h-8 w-8 text-purple-600" />,
    color: 'from-purple-50 to-purple-100',
  },
];

const DashboardModules: React.FC = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {modules.map((mod, index) => (
        <Link
          to={mod.link}
          key={index}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br border border-gray-100 shadow-sm hover:shadow-md transition duration-200"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-50 group-hover:opacity-100 transition-opacity duration-200`} />
          <div className="relative p-6">
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-200">
              {mod.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{mod.title}</h3>
            <p className="text-sm text-gray-600">{mod.description}</p>
            <div className="mt-4 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Learn More →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DashboardModules;