// src/utils/linkParser.tsx
import React from 'react';

export function parseLinksInText(text: string): React.ReactNode[] {
  // Regex to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split text by URLs
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    // Check if this part is a URL
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#4CAF50',
            textDecoration: 'underline',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
          }}
        >
          {part}
        </a>
      );
    }
    // Return regular text
    return part;
  });
}

// Alternative function for more advanced link parsing
export function parseAdvancedLinks(text: string): React.ReactNode[] {
  // More comprehensive URL regex that handles edge cases
  const urlRegex = /(https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*)?(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)/g;
  
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      // Clean up the URL (remove trailing punctuation if any)
      const cleanUrl = part.replace(/[.,;!?]+$/, '');
      const removedPunctuation = part.slice(cleanUrl.length);
      
      return (
        <React.Fragment key={index}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#4CAF50',
              textDecoration: 'underline',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#45a049';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#4CAF50';
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {cleanUrl}
          </a>
          {removedPunctuation}
        </React.Fragment>
      );
    }
    return part;
  });
}

// Function to create custom link buttons for specific URLs
export function createActionButton(url: string, text: string = "Learn More"): React.ReactNode {
  if (url.includes('colonaive.ai/get-screened')) {
    return (
      <div style={{ marginTop: '10px' }}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s',
            marginTop: '8px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          🩺 Get Screened Now
        </a>
      </div>
    );
  }
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#4CAF50',
        textDecoration: 'underline',
        fontWeight: '500'
      }}
    >
      {text}
    </a>
  );
}