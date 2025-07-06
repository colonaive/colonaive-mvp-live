import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { clinicDatabase } from '../data/clinicDatabase';
import { smartDisplayClinic } from '../utils/smartDisplayClinic';
import { Button } from './ui/Button';
import ClinicDisplay from './ClinicDisplay';
import { ClinicType } from '../types';

const ChampionSpecialistFinderFlow: React.FC = () => {
  const [step, setStep] = useState<'ask' | 'match' | 'nomatch'>('ask');
  const [input, setInput] = useState('');
  const [matchedClinic, setMatchedClinic] = useState<ClinicType | null>(null);

  const handleSearch = () => {
    if (!input.trim()) return;

    const match = smartDisplayClinic(input.trim().toLowerCase(), clinicDatabase);
    if (match) {
      setMatchedClinic(match);
      setStep('match');
    } else {
      setStep('nomatch');
    }
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md bg-white">
      {step === 'ask' && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Do you already have a trusted Specialist who can guide you through your CRC screening journey?
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Enter your specialist's name or clinic name below, and we'll help you connect with them for your CRC screening journey.
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter specialist's name or clinic name..."
              />
              <Button onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>
        </>
      )}

      {step === 'match' && matchedClinic && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-600 mb-2">Wonderful, Champion!</h2>
            <p className="text-gray-600 mb-6">
              We found your specialist clinic in our trusted panel. Here are the details:
            </p>
          </div>
          
          <ClinicDisplay clinic={matchedClinic} />
          
          <div className="flex justify-center space-x-4 mt-6">
            <Button variant="secondary" onClick={() => setStep('ask')}>
              Search Again
            </Button>
            <Link to="/choose-screening">
              <Button>
                Learn About Screening Options
              </Button>
            </Link>
          </div>
        </div>
      )}

      {step === 'nomatch' && (
        <div className="text-center space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              We couldn't find a match in our trusted specialist panel
            </h2>
            <p className="text-gray-600">
              Don't worry, Champion! We can help you find a trusted specialist for your CRC screening journey.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="secondary" onClick={() => setStep('ask')}>
              Try Another Search
            </Button>
            <Link to="/clinics">
              <Button>
                Browse Our Recommended Specialists
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChampionSpecialistFinderFlow;