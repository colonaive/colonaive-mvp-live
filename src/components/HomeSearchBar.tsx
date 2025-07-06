// src/components/HomeSearchBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming you have this utility for classnames

const searchSuggestions = [
  { text: 'Early symptoms', path: '/education/patients/early-symptoms-of-crc' },
  { text: 'Colonoscopy', path: '/education/patients/colonoscopy-gold-standard' },
  { text: 'How polyps develop', path: '/education/patients/how-crc-develops-from-polyps' },
  { text: 'Find a GP', path: '/find-a-gp' },
  { text: 'Find a specialist', path: '/find-a-specialist' }, // Corrected path based on previous changes
  { text: 'FAQs', path: '/education/faqs' },
  { text: 'Latest News', path: '/education/newsroom' },
  { text: 'Resources', path: '/education/resources' }
];

interface HomeSearchBarProps {
  // Add any props needed for styling variations (e.g., for header vs homepage)
  variant?: 'header' | 'default';
}

// Helper function to highlight matching text
const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) {
    return <span>{text}</span>;
  }
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) {
    return <span>{text}</span>;
  }
  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);
  return (
    <span>
      {before}
      <strong className="font-bold">{match}</strong>
      {after}
    </span>
  );
};


export const HomeSearchBar: React.FC<HomeSearchBarProps> = ({ variant = 'default' }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = query
    ? searchSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      )
    : []; // Only show filtered suggestions when query is not empty

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to focused suggestion if one exists and is valid
      if (focusedIndex >= 0 && focusedIndex < filteredSuggestions.length) {
        navigate(filteredSuggestions[focusedIndex].path);
      } else {
        // Default search action - navigate to a dedicated search results page or FAQs
        // Using /education/faqs as fallback for now
        navigate(`/education/faqs?q=${encodeURIComponent(query)}`);
      }
      setShowSuggestions(false);
      setQuery(''); // Clear query after search
      setFocusedIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Show suggestions on key down if not already shown and there's a query
    if (!showSuggestions && query) {
        setShowSuggestions(true);
    }

    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0 // Loop back to top
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1 // Loop back to bottom
        );
        break;
      case 'Enter':
         // handleSearch will be triggered by form submit, no need for separate Enter handling here
         // Unless you want Enter to immediately navigate when suggestion is focused without submitting form
         // if (focusedIndex >= 0) {
         //   navigate(filteredSuggestions[focusedIndex].path);
         //   setShowSuggestions(false);
         // }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
      default:
        // Reset focus index when typing
         if (e.key.length === 1 || e.key === 'Backspace') {
            setFocusedIndex(-1);
         }
        break;
    }
  };

  // Base classes
  const inputBaseClasses = "w-full py-2 pl-10 pr-24 text-sm focus:outline-none transition duration-200";
  const buttonBaseClasses = "absolute right-1.5 top-1/2 transform -translate-y-1/2 text-white px-3 py-1.5 rounded-md text-sm font-medium transition duration-200 flex items-center gap-1 group";

  // Variant specific classes
  const inputVariantClasses = variant === 'header'
    ? "border border-white/20 bg-transparent text-white placeholder-white/70 focus:ring-2 focus:ring-white/30"
    : "border border-gray-300 shadow-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const buttonVariantClasses = variant === 'header'
   ? "bg-white/10 hover:bg-white/20" // Lighter button for dark header
   : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="w-full" ref={searchRef}> {/* Removed max-w-sm etc. */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search
            className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5",
              variant === 'header' ? 'text-white/70' : 'text-gray-400'
            )}
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true); // Show suggestions while typing
                setFocusedIndex(-1); // Reset focus when query changes
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search topics, care, coverage" // Updated placeholder
            className={cn(inputBaseClasses, inputVariantClasses, "rounded-lg")} // Use rounded-lg for consistency
            aria-label="Search"
            aria-expanded={showSuggestions && filteredSuggestions.length > 0}
            role="combobox"
            aria-controls="search-suggestions"
            aria-activedescendant={focusedIndex >= 0 ? `suggestion-${focusedIndex}` : undefined}
          />
          <button
            type="submit"
            className={cn(buttonBaseClasses, buttonVariantClasses)}
          >
            Search
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {showSuggestions && query && ( // Only show dropdown if focused AND there's a query
          <div
            id="search-suggestions"
            className="absolute z-50 left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200" // Added max-height and overflow
            role="listbox"
          >
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  id={`suggestion-${index}`}
                  type="button" // Prevent form submission on click
                  className={cn(
                    "w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition duration-150",
                    index === focusedIndex ? 'bg-gray-100' : ''
                  )}
                  onClick={() => {
                    navigate(suggestion.path);
                    setShowSuggestions(false);
                    setQuery(''); // Clear query on selection
                    setFocusedIndex(-1);
                  }}
                  onMouseEnter={() => setFocusedIndex(index)} // Optional: focus on hover
                  role="option"
                  aria-selected={index === focusedIndex}
                >
                  <span className="block text-sm font-medium">
                     <HighlightMatch text={suggestion.text} query={query} /> {/* Use helper */}
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">
                    {/* You could show the path here, or a category */}
                    {/* Example: {suggestion.path} */}
                    Navigate to page
                  </span>
                </button>
              ))
            ) : (
              // Show "No results" only when query exists but filters yield nothing
               <div className="px-4 py-3 text-sm text-gray-500">
                   No results found for "{query}"
               </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

// Export as named export for consistency maybe? Check if Header uses default.
// export default HomeSearchBar;