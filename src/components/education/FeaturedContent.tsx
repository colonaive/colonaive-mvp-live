import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../data/education/articles';
import ArticleCard from './ArticleCard';

interface FeaturedContentProps {
  articles: Article[];
  title?: string;
  description?: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({
  articles,
  title = 'Featured Articles',
  description,
  viewAllLink,
  viewAllText = 'View All',
  className = ''
}) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
        {viewAllLink && (
          <Link 
            to={viewAllLink}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center mt-2 md:mt-0"
          >
            {viewAllText}
            <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 3).map(article => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            variant={article.featured ? 'featured' : 'default'}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedContent;