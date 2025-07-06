import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../data/education/articles';
import { Clock } from 'lucide-react';

interface RelatedArticlesProps {
  articles: Article[];
  className?: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ 
  articles,
  className = '' 
}) => {
  if (articles.length === 0) {
    return (
      <div className={`text-gray-500 text-sm italic ${className}`}>
        No related articles found.
      </div>
    );
  }

  return (
    <div className={className}>
      <ul className="space-y-4">
        {articles.map(article => (
          <li key={article.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <Link 
              to={`/education/article/${article.slug}`}
              className="block hover:bg-gray-50 rounded-lg transition-colors p-2 -mx-2"
            >
              <h4 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1">
                {article.title}
              </h4>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{article.readTime} min read</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedArticles;