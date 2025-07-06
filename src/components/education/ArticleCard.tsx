import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../data/education/articles';
import { Clock, Calendar, BookOpen } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  variant = 'default',
  className = '' 
}) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'patient-basics': 'bg-blue-100 text-blue-800',
      'patient-screening': 'bg-green-100 text-green-800',
      'patient-symptoms': 'bg-orange-100 text-orange-800',
      'patient-prevention': 'bg-purple-100 text-purple-800',
      'clinician-guidelines': 'bg-purple-100 text-purple-800',
      'clinician-research': 'bg-blue-100 text-blue-800',
      'clinician-case-studies': 'bg-green-100 text-green-800',
      'clinician-cme': 'bg-teal-100 text-teal-800',
      'newsroom': 'bg-gray-100 text-gray-800',
      'research-updates': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      'patient-basics': 'CRC Basics',
      'patient-screening': 'Screening',
      'patient-symptoms': 'Symptoms',
      'patient-prevention': 'Prevention',
      'clinician-guidelines': 'Guidelines',
      'clinician-research': 'Research',
      'clinician-case-studies': 'Case Studies',
      'clinician-cme': 'CME',
      'newsroom': 'News',
      'research-updates': 'Research'
    };
    return names[category] || category;
  };

  if (variant === 'featured') {
    return (
      <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
        {article.image && (
          <div className="h-48 w-full overflow-hidden">
            <img 
              src={article.image.url} 
              alt={article.image.alt} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center mb-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}>
              {getCategoryName(article.category)}
            </span>
            {article.featured && (
              <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                Featured
              </span>
            )}
          </div>
          <Link to={`/education/article/${article.slug}`} className="block">
            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="text-gray-600 mb-4">{article.excerpt}</p>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="h-4 w-4 mr-1" />
            <span className="mr-4">{article.readTime} min read</span>
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
          </div>
          <Link 
            to={`/education/article/${article.slug}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Read more
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 ${className}`}>
        <div className="flex items-center mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getCategoryColor(article.category)}`}>
            {getCategoryName(article.category)}
          </span>
        </div>
        <Link to={`/education/article/${article.slug}`} className="block">
          <h3 className="text-base font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
        </Link>
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <Clock className="h-3 w-3 mr-1" />
          <span>{article.readTime} min</span>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="p-5">
        <div className="flex items-center mb-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}>
            {getCategoryName(article.category)}
          </span>
        </div>
        <Link to={`/education/article/${article.slug}`} className="block">
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span className="mr-3">{article.readTime} min read</span>
          <BookOpen className="h-4 w-4 mr-1" />
          <span>{article.difficulty}</span>
        </div>
        <Link 
          to={`/education/article/${article.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          Read more
          <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;