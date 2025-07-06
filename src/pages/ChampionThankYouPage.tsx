import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Heart, Users } from 'lucide-react';

const ChampionThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-green-600" />
          </div>
          
          {/* Main Message */}
          <h1 className="text-4xl font-bold text-green-600 mb-6">
            Thank you for joining as a Champion!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Welcome to the COLONAiVE movement! You are now part of Singapore's fight against colorectal cancer.
          </p>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="bg-blue-50 p-6 rounded-lg">
              <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">1 in 13</div>
              <div className="text-sm text-gray-600">Singaporeans will develop CRC</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">90%</div>
              <div className="text-sm text-gray-600">Survival rate when detected early</div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">What happens next?</h3>
            <p className="text-yellow-700 text-sm">
              Check your email for verification and next steps. Our team will contact you with Champion opportunities and ways to make an impact.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleReturnHome}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Return to Home
            </button>
            <Link
              to="/join-the-movement"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionThankYouPage;