import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../../components/ui/Container';
import ContentSearch from '../../../../components/education/ContentSearch';
import ArticleCard from '../../../../components/education/ArticleCard';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import { ArrowLeft } from 'lucide-react';

const PatientBasicsHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles } = useEducationContent({
    category: 'patient-basics',
    searchQuery
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link to="/education/patients" className="inline-flex items-center text-blue-200 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Patient Education
            </Link>
            <h1 className="text-3xl font-bold mb-4">Colorectal Cancer Basics</h1>
            <p className="text-xl">
              Fundamental information about colorectal cancer, its causes, risk factors, and how it develops.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search */}
        <div className="mb-8">
          <ContentSearch 
            placeholder="Search CRC basics..." 
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Understanding Colorectal Cancer"}
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

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">Related Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/education/patients/screening"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <h4 className="font-semibold mb-1">Screening Options</h4>
              <p className="text-sm text-gray-600">Learn about different screening methods</p>
            </Link>
            <Link 
              to="/education/patients/symptoms"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <h4 className="font-semibold mb-1">Symptoms & Signs</h4>
              <p className="text-sm text-gray-600">Recognize warning signs early</p>
            </Link>
            <Link 
              to="/education/patients/prevention"
              className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              <h4 className="font-semibold mb-1">Prevention</h4>
              <p className="text-sm text-gray-600">Lifestyle factors and risk reduction</p>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PatientBasicsHub;