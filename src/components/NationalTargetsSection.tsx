// src/components/NationalTargetsSection.tsx
import React from 'react';
import { Target as TargetIcon, TrendingUp } from 'lucide-react'; // Using TargetIcon alias
import { Container } from './ui/Container';
import { Card, CardContent } from './ui/Card';

const NationalTargetsSection = () => {
  return (
    <section className="py-16 md:py-20 px-6 bg-sky-50 dark:bg-slate-800/50" id="national-targets">
      <Container>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-800 dark:text-blue-300 mb-12 md:mb-16">
            10-Year National Targets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 2030 Goal Card */}
            <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-lg text-left border border-gray-200/80 dark:border-slate-700">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <TargetIcon className="h-8 w-8 text-red-500 flex-shrink-0" />
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100">2030 Goal</h3>
                </div>
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-3">
                  Reach 80% CRC Screening Rate
                </p>
                <ul className="list-disc list-outside pl-5 space-y-2 text-slate-600 dark:text-slate-300 text-sm md:text-base">
                  <li>Accelerated uptake via non-invasive, blood-based screening.</li>
                  <li>Overcomes barriers of stool tests (discomfort, stigma, delay).</li>
                  <li>Targets younger adults & high-risk populations effectively.</li>
                </ul>
              </CardContent>
            </Card>

            {/* 2035 Goal Card */}
            <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-lg text-left border border-gray-200/80 dark:border-slate-700">
              <CardContent className="p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-green-500 flex-shrink-0" />
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-100">2035 Goal</h3>
                </div>
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-3">
                  Reduce CRC Deaths by 80%
                </p>
                 <ul className="list-disc list-outside pl-5 space-y-2 text-slate-600 dark:text-slate-300 text-sm md:text-base">
                  <li>Earlier detection via sensitive blood-based tools.</li>
                  <li>Timely colonoscopy ensures early-stage intervention.</li>
                  <li>Ambitious targets aligned with proven 20-year US data.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NationalTargetsSection;