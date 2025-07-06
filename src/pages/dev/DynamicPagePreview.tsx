import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';

// Import all pages you might want to preview
import EarlySymptomsPage from '../education/patients/early-symptoms-of-crc';
import ColonoscopyGoldStandard from '../education/patients/screening/colonoscopy-gold-standard';
import HowCrcDevelopsFromPolyps from '../education/patients/basics/how-crc-develops-from-polyps';
import LoginRedirectPage from '../LoginRedirectPage';
import SuperAdminDashboard from '../admin/SuperAdminDashboard' ;
// Add more imports as needed

const DynamicPagePreview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pageName = searchParams.get('page');
  
  // Map of page names to components
  const pageComponents: Record<string, React.ComponentType> = {
    'early-symptoms': EarlySymptomsPage,
    'colonoscopy': ColonoscopyGoldStandard,
    'polyps': HowCrcDevelopsFromPolyps,
    'login-redirect': LoginRedirectPage,
    'super-admin-dashboard': SuperAdminDashboard
    // Add more mappings as needed
  };
  
  const PageComponent = pageName ? pageComponents[pageName] : null;
  
  if (!pageName) {
    return (
      <div className="pt-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Page Preview</h1>
            <p className="mb-6">Select a page to preview:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(pageComponents).map(key => (
                <Button 
                  key={key}
                  variant="outline"
                  onClick={() => {
                    window.location.href = `/dynamic-page-preview?page=${key}`;
                  }}
                >
                  {key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }
  
  return PageComponent ? <PageComponent /> : (
    <div className="pt-32">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Page Not Found</h1>
          <p>The page "{pageName}" was not found in the available pages.</p>
          <Button 
            className="mt-4"
            onClick={() => {
              window.location.href = '/dynamic-page-preview';
            }}
          >
            Back to Page Selection
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default DynamicPagePreview;