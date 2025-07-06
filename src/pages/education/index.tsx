import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import ContentSearch from '../../components/education/ContentSearch';
import FeaturedContent from '../../components/education/FeaturedContent';
import ArticleCard from '../../components/education/ArticleCard';
import { useEducationContent } from '../../hooks/useEducationContent';
import { educationCategories } from '../../data/education/categories';
import { BookOpen, Users, FileText, TrendingUp, Newspaper, Search, Filter, X, Shield } from 'lucide-react';

const EducationHub: React.FC = () => {
  const [audience, setAudience] = useState<'patients' | 'clinicians' | 'both'>('both');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles, featuredArticles } = useEducationContent({
    audience,
    searchQuery
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setAudience('both');
    setSearchQuery('');
  };

  const getAudienceIcon = (audienceType: 'patients' | 'clinicians' | 'both') => {
    switch (audienceType) {
      case 'patients':
        return <Users className="h-5 w-5" />;
      case 'clinicians':
        return <FileText className="h-5 w-5" />;
      case 'both':
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Education Hub</h1>
            <p className="text-xl mb-8">
              Explore our comprehensive library of evidence-based resources on colorectal cancer prevention, screening, and early detection.
            </p>
            <div className="max-w-2xl mx-auto">
              <ContentSearch 
                placeholder="Search for articles, topics, or keywords..." 
                onSearch={handleSearch}
                initialQuery={searchQuery}
                className="mb-4"
              />
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Audience Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold">Education Resources</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter by:</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setAudience('both')}
                  className={`px-4 py-2 text-sm font-medium flex items-center ${
                    audience === 'both' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  All
                </button>
                <button
                  onClick={() => setAudience('patients')}
                  className={`px-4 py-2 text-sm font-medium flex items-center ${
                    audience === 'patients' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Patients
                </button>
                <button
                  onClick={() => setAudience('clinicians')}
                  className={`px-4 py-2 text-sm font-medium flex items-center ${
                    audience === 'clinicians' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Clinicians
                </button>
              </div>
              {(audience !== 'both' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* Active Filters */}
          {(audience !== 'both' || searchQuery) && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {audience !== 'both' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
                  {getAudienceIcon(audience)}
                  <span className="ml-1 capitalize">{audience}</span>
                  <button 
                    onClick={() => setAudience('both')}
                    className="ml-1 text-blue-800 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
                  <Search className="h-3 w-3 mr-1" />
                  <span>"{searchQuery}"</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-1 text-blue-800 hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Featured Content */}
        {featuredArticles.length > 0 && !searchQuery && (
          <FeaturedContent 
            articles={featuredArticles} 
            title="Featured Articles"
            description="Our most important and up-to-date resources"
            className="mb-12"
          />
        )}

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Search Results for "{searchQuery}"</h2>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600 mb-4">No articles found matching your search criteria.</p>
                <Button onClick={clearFilters}>Clear Search</Button>
              </div>
            )}
          </div>
        )}

        {/* Category Sections */}
        {!searchQuery && (
          <>
            {/* Patient Education */}
            {(audience === 'patients' || audience === 'both') && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Patient Education</h2>
                  <Link 
                    to="/education/patients"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    View All
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {educationCategories
                    .filter(cat => cat.audience === 'patients' || cat.audience === 'both')
                    .map(category => (
                      <Link 
                        key={category.id} 
                        to={`/education/patients/${category.id.replace('patient-', '')}`}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col items-center text-center"
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-${category.color}-100 text-${category.color}-600`}>
                          {/* Dynamic icon rendering based on category.icon */}
                          {category.icon === 'BookOpen' && <BookOpen className="h-6 w-6" />}
                          {category.icon === 'Search' && <Search className="h-6 w-6" />}
                          {category.icon === 'TrendingUp' && <TrendingUp className="h-6 w-6" />}
                          {category.icon === 'Shield' && <Shield className="h-6 w-6" />}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Clinician Education */}
            {(audience === 'clinicians' || audience === 'both') && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Clinician Education</h2>
                  <Link 
                    to="/education/clinicians"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    View All
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {educationCategories
                    .filter(cat => cat.audience === 'clinicians' || cat.audience === 'both')
                    .map(category => (
                      <Link 
                        key={category.id} 
                        to={`/education/clinicians/${category.id.replace('clinician-', '')}`}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col items-center text-center"
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-${category.color}-100 text-${category.color}-600`}>
                          {/* Dynamic icon rendering based on category.icon */}
                          {category.icon === 'FileText' && <FileText className="h-6 w-6" />}
                          {category.icon === 'TrendingUp' && <TrendingUp className="h-6 w-6" />}
                          {category.icon === 'Users' && <Users className="h-6 w-6" />}
                          {category.icon === 'BookOpen' && <BookOpen className="h-6 w-6" />}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Newsroom */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Latest News & Updates</h2>
                <Link 
                  to="/education/newsroom"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  Visit Newsroom
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row items-center">
                <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
                  <Newspaper className="h-16 w-16 text-blue-600" />
                </div>
                <div className="md:w-3/4 md:pl-6">
                  <h3 className="text-xl font-bold mb-2">Stay Informed</h3>
                  <p className="text-gray-600 mb-4">
                    Get the latest news, research updates, and announcements from Project COLONAiVE™ and the colorectal cancer prevention community.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/education/newsroom/press-releases">
                      <Button variant="outline" size="sm">Press Releases</Button>
                    </Link>
                    <Link to="/education/newsroom/research-updates">
                      <Button variant="outline" size="sm">Research Updates</Button>
                    </Link>
                    <Link to="/upcoming-events">
                      <Button variant="outline" size="sm">Upcoming Events</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default EducationHub;