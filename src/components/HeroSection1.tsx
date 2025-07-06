// /src/components/HeroSection1.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Container } from './ui/Container';

const HeroSection1: React.FC = () => {
  return (
    <section
      className="relative w-full bg-cover bg-center bg-no-repeat text-white overflow-hidden"
      style={{
        backgroundImage: `url(/images/hero-pillar-team.webp)`,
        backgroundPosition: 'center 60%',
        backdropFilter: 'blur(4px)', // Not all browsers support, but included
      }}
    >
      {/* Darker Gradient Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-0 backdrop-blur-sm" />
      
      {/* Content */}
      <Container className="relative z-10 pt-16 md:pt-20 pb-12 md:pb-16 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          
          {/* Enhanced Urgency Tag with Hope Balance */}
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg tracking-wider">
              SINGAPORE'S #1 CANCER THREAT - BUT 95% SURVIVAL WHEN DETECTED EARLY
            </span>
          </div>

          {/* Credibility Signal */}
          <div className="mb-4">
            <p className="text-base sm:text-lg text-blue-200 font-medium"
               style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
              Clinician-led movement backed by Singapore's leading colorectal surgeons and gastroenterologists
            </p>
          </div>
          
          {/* Main Headline with Bolder Shadow */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6"
              style={{
                textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)'
              }}>
            Outsmart <span className="text-red-400">Colorectal Cancer</span>. Unite for Life.
          </h1>
          
          {/* Subtext with More Visibility */}
          <p className="text-xl sm:text-2xl text-gray-100 mb-6 max-w-3xl mx-auto"
             style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.85)' }}>
            Colorectal cancer claims too many lives in Singapore. Over <span className="font-bold text-red-300">60% of cases</span> are found too late. But together, we can change this.
          </p>
          
          <p className="text-xl sm:text-2xl text-gray-100 mb-6 max-w-3xl mx-auto"
             style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.85)' }}>
            Project COLONAiVE™ is a national movement uniting <span className="font-semibold text-blue-300">citizens, clinicians, educators, policymakers, and corporations</span> to boost early detection and save lives.
          </p>

          {/* Social Proof Micro-Signal */}
          <div className="mb-8">
            <p className="text-lg text-green-200 font-medium"
               style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
              {/* Note: Replace with actual data when available */}
              Join thousands of Singaporeans already taking action
            </p>
          </div>
          
          {/* Streamlined CTA Buttons - Reduced to 2 for Better Conversion */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/get-screened">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-xl transition-transform transform hover:scale-105">
                Find Your Screening Path
              </Button>
            </Link>
            <Link to="/join-movement">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-xl transition-transform transform hover:scale-105">
                Join the Movement
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection1;