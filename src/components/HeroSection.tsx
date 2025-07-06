// src/components/HeroSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { ChevronRight, Shield, Clock, CheckCircle, Award } from 'lucide-react';

const TrustBadge = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string; }) => (
    <div className="flex flex-col items-center gap-1 text-center">
        <div className="text-blue-600">{icon}</div>
        <div>
            <p className="text-lg lg:text-xl font-bold text-slate-800">{value}</p>
            <p className="text-sm lg:text-base text-slate-500">{label}</p>
        </div>
    </div>
);

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-white overflow-hidden">
      {/* 3-column layout for desktop, stacked for mobile */}
      <div className="container mx-auto h-[calc(100vh-80px)] max-h-[900px] grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Blood tube image - left side (3 columns) - ADJUSTED ALIGNMENT */}
        <div className="lg:col-span-3 flex items-center justify-center lg:justify-start order-2 lg:order-1 lg:pt-20">
          <img 
            src="/assets/images/bloodtest/crc-screening-blood-test.webp"
            alt="CRC Screening Blood Test - Modern detection method"
            className="h-48 md:h-56 lg:h-[60vh] lg:max-h-[600px] w-auto drop-shadow-2xl animate-float transition-all duration-500 hover:scale-105"
          />
        </div>

        {/* Main content - center (6 columns) */}
        <div className="relative z-10 lg:col-span-6 flex flex-col items-center justify-center text-center px-4 py-8 lg:py-12 order-1 lg:order-2">
          
          {/* Cancer threat badge */}
          <div className="mb-4 inline-flex items-center rounded-full bg-red-100 px-5 py-1.5 text-xs lg:text-sm font-bold text-red-700 ring-1 ring-red-200">
            <Award size={14} className="mr-2" />
            SINGAPORE'S #1 CANCER THREAT
          </div>

          {/* Main headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            <span className="whitespace-nowrap">Outsmart Colorectal Cancer.</span>
            <span className="block text-blue-600 mt-1">Together.</span>
          </h1>

          {/* Blood Test Innovation Box - centered */}
          <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-xl p-5 lg:p-6 border border-blue-100 shadow-md mb-6 max-w-lg">
            <div className="text-center">
              <div className="inline-flex items-center mb-2">
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  NEW
                </span>
                <span className="ml-2 text-sm lg:text-base font-semibold text-slate-600">
                  Modern Blood-Based Screening
                </span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
                Superior Detection, Simple Blood Draw
              </h3>
              <p className="text-sm lg:text-base text-slate-600">
                Advanced technology with higher sensitivity than traditional methods. 
                No inconvenience of stool handling.
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="max-w-xl text-base sm:text-lg lg:text-xl text-slate-600 leading-loose mb-6">
            Join a national movement to prevent colorectal cancer. Early detection is your best protection, and it starts with a simple step.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/get-screened')}
              className="group transform rounded-full bg-blue-600 px-8 py-3 text-base lg:text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
            >
              Get Screened Now
              <ChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={18} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/find-a-specialist')}
              className="group rounded-full border-2 border-teal-400 bg-teal-400 px-8 py-3 text-base lg:text-lg font-bold text-white transition-all duration-300 hover:bg-teal-300 hover:border-teal-300 hover:shadow-lg"
            >
              Get Scoped Now
              <ChevronRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={18} />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="w-full max-w-2xl border-t border-slate-200 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2">
                <TrustBadge icon={<CheckCircle size={32} />} value="95% Survival Rate" label="When detected early" />
                <TrustBadge icon={<Clock size={32} />} value="<15 Min" label="Average screening time" />
                <TrustBadge icon={<Shield size={32} />} value="100% Preventable" label="With early detection" />
            </div>
          </div>
        </div>

        {/* Doctor image - right side (3 columns) */}
        <div className="lg:col-span-3 flex items-center justify-center lg:justify-end order-3">
          <img 
            src="/assets/images/doctor/doctor-stetescope.webp" 
            alt="A friendly and professional doctor from the COLONAiVE medical team."
            className="h-auto w-full max-w-md lg:max-w-none lg:h-[85vh] lg:max-h-[750px] xl:h-[90vh] xl:max-h-[800px] object-contain object-center transition-all duration-500 hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;