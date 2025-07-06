// /home/project/src/components/SubmissionSuccess.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button'; // We know this component exists
import { CheckCircle2, ArrowRight } from 'lucide-react'; // We know these icons exist

export const SubmissionSuccess: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      {/* This is now a standard <div> styled to look like a card */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-200 text-center overflow-hidden">
        
        <div className="p-8">
          <div className="mx-auto bg-teal-100 rounded-full p-3 w-fit">
            <CheckCircle2 className="h-10 w-10 text-teal-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            Thank You For Sharing!
          </h2>
          
          <p className="text-gray-600 text-base px-4 pt-2">
            Your story has been received and is now pending review by our team. We appreciate you contributing to the COLONAiVE™ community and helping to inspire others.
          </p>
          
          <Button asChild size="lg" className="mt-6 group">
            <Link to="/dashboard/champion">
              Go to My Dashboard
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
};