import React from 'react';
import { MapPin, Phone, Globe, Clock, Mail, Languages } from 'lucide-react';
import { ClinicType } from '../types';

interface ClinicDisplayProps {
  clinic: ClinicType;
}

const ClinicDisplay: React.FC<ClinicDisplayProps> = ({ clinic }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50 p-4">
        <div className="text-center">
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            Trusted Partner of Project COLONAiVE™
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{clinic.clinicName}</h2>
          <p className="text-gray-600 font-medium">{clinic.specialty}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-gray-700">{clinic.address}</p>
              <p className="text-gray-500 text-sm">District: {clinic.district}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <a href={`tel:${clinic.phone}`} className="ml-3 text-blue-600 hover:text-blue-800">
              {clinic.phone}
            </a>
          </div>

          <div className="flex items-center">
            <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <a href={`mailto:${clinic.email}`} className="ml-3 text-blue-600 hover:text-blue-800">
              {clinic.email}
            </a>
          </div>

          {clinic.website && (
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <a
                href={clinic.website}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 text-blue-600 hover:text-blue-800"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Doctors</h3>
          {clinic.doctors.map((doctor, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="font-medium text-gray-800">{doctor.name}</p>
              <p className="text-gray-600 text-sm">{doctor.credentials}</p>
              <div className="flex items-center mt-1">
                <Languages className="h-4 w-4 text-gray-400" />
                <span className="ml-2 text-sm text-gray-600">
                  {doctor.languages.join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Screening Services</h3>
          <ul className="space-y-2">
            {clinic.screeningServices.map((service, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                <span className="text-gray-700">{service}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            Opening Hours
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Weekdays:</p>
              <p className="font-medium">{clinic.openingHours.weekdays}</p>
            </div>
            <div>
              <p className="text-gray-600">Saturday:</p>
              <p className="font-medium">{clinic.openingHours.saturday}</p>
            </div>
            <div>
              <p className="text-gray-600">Sunday:</p>
              <p className="font-medium">{clinic.openingHours.sunday}</p>
            </div>
            <div>
              <p className="text-gray-600">Public Holiday:</p>
              <p className="font-medium">{clinic.openingHours.publicHoliday}</p>
            </div>
          </div>
        </div>

        {clinic.notes && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
            <p>{clinic.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicDisplay;