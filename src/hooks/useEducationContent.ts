import { useState, useMemo } from 'react';
import { educationArticles, Article } from '../data/education/articles';

export interface FilterOptions {
  category?: string;
  subcategory?: string;
  audience?: 'patients' | 'clinicians' | 'both';
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  tags?: string[];
  searchQuery?: string;
}

export const useEducationContent = (filters: FilterOptions = {}) => {
  const [loading] = useState(false);
  const [articles] = useState<Article[]>(educationArticles);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      if (filters.category && article.category !== filters.category) return false;
      if (filters.subcategory && article.subcategory !== filters.subcategory) return false;
      if (filters.audience && article.audience !== filters.audience && article.audience !== 'both') return false;
      if (filters.difficulty && article.difficulty !== filters.difficulty) return false;
      
      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag => 
          article.tags.some(articleTag => 
            articleTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasTag) return false;
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${article.title} ${article.excerpt} ${article.tags.join(' ')}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }
      
      return true;
    });
  }, [articles, filters]);

  const featuredArticles = useMemo(() => {
    return filteredArticles.filter(article => article.featured);
  }, [filteredArticles]);

  const getRelatedArticles = (articleId: string, limit: number = 3): Article[] => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return [];
    
    return articles
      .filter(a => 
        a.id !== articleId && 
        (a.category === article.category || 
         a.tags.some(tag => article.tags.includes(tag)))
      )
      .slice(0, limit);
  };

  const getArticleBySlug = (slug: string): Article | undefined => {
    return articles.find(article => article.slug === slug);
  };

  return {
    articles: filteredArticles,
    featuredArticles,
    loading,
    getRelatedArticles,
    getArticleBySlug,
    totalCount: filteredArticles.length
  };
};