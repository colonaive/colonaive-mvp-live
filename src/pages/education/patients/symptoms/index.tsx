import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../../components/ui/Container';
import ContentSearch from '../../../../components/education/ContentSearch';
import ArticleCard from '../../../../components/education/ArticleCard';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import { ArrowLeft } from 'lucide-react';

const PatientSymptomsHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles } = useEducationContent({
    category: 'patient-symptoms',
    searchQuery
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link to="/education/patients" className="inline-flex items-center text-orange-200 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Patient Education
            </Link>
            <h1 className="text-3xl font-bold mb-4">Symptoms & Warning Signs</h1>
            <p className="text-xl">
              Learn to recognize the early warning signs of colorectal cancer and when to seek medical attention.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search */}
        <div className="mb-8">
          <ContentSearch 
            placeholder="Search symptoms and signs..." 
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Recognizing Symptoms"}
          </h2>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">No articles found matching your search criteria.</p>
            </div>
          )}
        </div>

        {/* Warning Box */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-8">
          <h3 className="text-xl font-bold text-red-800 mb-2">Important Note</h3>
          <p className="text-red-700">
            If you're experiencing concerning symptoms, don't delay seeking medical attention. 
            Early detection significantly improves outcomes. This information is educational 
            and not a substitute for professional medical advice.
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">Next Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/find-a-gp"
              className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors"
            >
              <h4 className="font-semibold mb-1">Find a GP</h4>
              <p className="text-sm text-gray-600">Consult a doctor about your symptoms</p>
            </Link>
            <Link 
              to="/get-screened"
              className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors"
            >
              <h4 className="font-semibold mb-1">Get Screened</h4>
              <p className="text-sm text-gray-600">Learn about screening options</p>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PatientSymptomsHub;