import React from 'react';
import { Link } from 'react-router-dom';
import { pillars } from '../data/pillars';

const PillarGrid: React.FC = () => {
  return (
    <section className="py-12">
      <div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 text-center"
        role="navigation"
        aria-label="Project COLONAiVE Pillars"
      >
        {pillars.map((pillar, index) => {
          const { icon, brand, label, link } = pillar;
          const displayIcon = icon && icon.length > 0 ? icon : '❓';

          return (
            <Link
              key={index}
              to={link}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full px-6 py-4 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
              aria-label={`${brand} - ${label}`}
            >
              <div className="text-3xl">{displayIcon}</div>
              <span className="text-xs font-medium text-cyan-200">{brand}</span>
              <span className="text-lg font-bold">{label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default PillarGrid;
