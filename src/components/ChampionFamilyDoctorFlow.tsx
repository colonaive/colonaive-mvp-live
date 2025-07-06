import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { clinicDatabase } from '../data/clinicDatabase';
import { smartDisplayClinic } from '../utils/smartDisplayClinic';
import { Button } from './ui/Button';
import ClinicDisplay from './ClinicDisplay';
import { ClinicType } from '../types';

const ChampionFamilyDoctorFlow: React.FC = () => {
  const [step, setStep] = useState<'ask' | 'match' | 'nomatch'>('ask');
  const [input, setInput] = useState('');
  const [matchedClinic, setMatchedClinic] = useState<ClinicType | null>(null);

  const handleSearch = () => {
    if (!input.trim()) return;

    // Clear previous match when searching again
    setMatchedClinic(null); 
    
    const searchTerm = input.trim().toLowerCase();
    const match = smartDisplayClinic(searchTerm, clinicDatabase);
    
    if (match) {
      setMatchedClinic(match);
      setStep('match');
    } else {
      setStep('nomatch');
    }
    // Keep input for context unless a match is found? Or always clear?
    // Let's clear it for simplicity for now, original behaviour.
    setInput(''); 
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetFlow = () => {
    setStep('ask');
    setInput('');
    setMatchedClinic(null);
  };

  return (
    // Use consistent spacing, maybe padding-y and padding-x? p-6 is fine though.
    // Added aria-live for screen readers to announce content changes.
    <div className="p-6 rounded-lg shadow-md bg-white" aria-live="polite"> 
      {step === 'ask' && (
        // Use gap for spacing instead of space-y if preferred, but space-y is fine.
        <div className="space-y-4"> 
          <h2 id="ask-heading\" className="text-xl font-bold text-gray-800"> 
            Champion, do you already have a trusted family doctor (GP) you usually consult?
          </h2>
          <p id="ask-description" className="text-gray-600">
            Enter your doctor's name or clinic name below, and we'll help you connect with them for your CRC screening journey.
          </p>
          {/* Form structure for better semantics & accessibility */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-4" aria-labelledby="ask-heading" aria-describedby="ask-description">
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-stretch"> 
              {/* Accessibility Improvement: Added label */}
              <label htmlFor="clinic-search" className="sr-only"> {/* Visually hidden label */}
                Doctor's name or clinic name
              </label>
              <input
                id="clinic-search"
                type="text"
                // Consistent focus style with modern Tailwind `ring` utilities.
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress} // Keep for Enter key convenience
                placeholder="Enter doctor or clinic name..."
                aria-describedby="ask-description" // Link input to descriptive text
              />
              {/* Ensure Button component handles type="submit" or explicitly set type="button" if needed. Assuming default or type="submit" is fine here. */}
              <Button type="submit" disabled={!input.trim()}> 
                Search
              </Button>
            </div>
          </form>
        </div>
      )}

      {step === 'match' && matchedClinic && (
        // Centralized vertical spacing using gap-6
        <div className="flex flex-col items-center text-center gap-6"> 
          <div>
            <h2 className="text-xl font-bold text-green-700"> {/* Slightly darker green for potentially better contrast */}
              Great news, Champion!
            </h2>
            <p className="text-gray-600 mt-1"> {/* Reduced top margin for tighter heading/subheading */}
              We found your clinic in our trusted panel. Here are the details:
            </p>
          </div>
          
          {/* Ensure ClinicDisplay is accessible */}
          <ClinicDisplay clinic={matchedClinic} />
          
          {/* Responsive button layout */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto"> 
            <Button variant="secondary" onClick={resetFlow}>
              Search Again
            </Button>
            {/* Ensure Link renders an `a` tag for Button to correctly style */}
            <Link to="/choose-screening" className="block"> {/* Make Link block for button width */}
              <Button className="w-full sm:w-auto">
                Learn About Screening Options
              </Button>
            </Link>
          </div>
        </div>
      )}

      {step === 'nomatch' && (
        // Consistent centered layout and spacing
        <div className="text-center space-y-6"> 
          <div>
            <h2 className="text-xl font-bold text-gray-800"> 
              We couldn't find a match in our trusted panel
            </h2>
            <p className="text-gray-600 mt-1"> {/* Reduced top margin */}
              Don't worry, Champion! We can help you find a trusted healthcare provider for your CRC screening journey.
            </p>
          </div>

          {/* Consistent responsive button layout */}
          <div className="flex flex-col sm:flex-row justify-center gap-4"> 
            <Button variant="secondary" onClick={resetFlow}> 
              Try Another Search
            </Button>
             {/* Ensure Link renders an `a` tag for Button to correctly style */}
            <Link to="/clinics" className="block"> {/* Make Link block for button width */}
              <Button className="w-full sm:w-auto">
                Browse Our Recommended Clinics
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChampionFamilyDoctorFlow;