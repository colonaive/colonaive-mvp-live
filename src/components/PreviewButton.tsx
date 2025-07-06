import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export const PreviewButton: React.FC = () => {
  return (
    <Link
      to="/home-preview"
      className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all z-50 flex items-center gap-2"
    >
      <Search className="h-4 w-4" />
      Preview New Homepage
    </Link>
  );
};