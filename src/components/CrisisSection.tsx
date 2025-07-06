// src/components/CrisisSection.tsx
import React from "react";
import { motion } from "framer-motion";
import TopCancerImg from "../assets/images/crisis/crc-top-cancer.webp";
import LowScreeningImg from "../assets/images/crisis/low-screening-rates.webp";
import LateDiagnosisImg from "../assets/images/crisis/late-stage-diagnosis.webp";
import { Link } from "react-router-dom";

const CrisisSection = () => {
  const crisisData = [
    {
      id: 1,
      image: TopCancerImg,
      alt: "CRC is #1 cancer",
      stat: "#2",
      title: "Second-Leading Cause of Cancer Deaths",
      description: "CRC is the second-leading cause of cancer deaths in Singapore, with 16.2% of male cases and 12.9% of female cases.",
    },
    {
      id: 2,
      image: LowScreeningImg,
      alt: "Low screening rate",
      stat: "38%",
      title: "Low Screening Rate",
      description: "Only 38% of eligible adults are screened, far below the target.",
    },
    {
      id: 3,
      image: LateDiagnosisImg,
      alt: "Late diagnosis",
      stat: "60%",
      title: "Late-Stage Diagnosis",
      description: "Nearly 60% of CRC cases are diagnosed late, reducing survival chances.",
    },
  ];

  return (
    <section className="py-28 px-6 sm:px-8 lg:px-12 bg-[#f8fafb]" id="crisis">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <motion.h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            <span className="text-[#0b1e3b] block mb-4">Colorectal Cancer is a Major Threat in Singapore</span>
            <span className="text-[#006ba6] block">But Early Detection Can Save Lives.</span>
          </motion.h2>

          <p className="text-[#475569] text-lg max-w-2xl mx-auto leading-relaxed">
            Colorectal cancer is the second-leading cause of cancer deaths in Singapore, with a significant impact on men and women. Early detection and timely intervention are critical.
          </p>

          {/* ✅ Corrected Link to the CRC-Singapore Story page */}
          <div className="mt-8">
            <Link to="/education/patients/crc-singapore-story" className="inline-block bg-[#006ba6] text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-[#005d91] transition">
              Learn More About CRC in Singapore
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
          {crisisData.map((item, index) => (
            <motion.div key={item.id} className="md:col-span-4">
              <div className="bg-white h-full rounded-2xl shadow-xl overflow-hidden">
                <img src={item.image} alt={item.alt} className="w-full h-60 object-cover" />
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-700">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CrisisSection;
