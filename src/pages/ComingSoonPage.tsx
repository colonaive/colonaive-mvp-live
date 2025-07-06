import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

export const ComingSoonPage: React.FC = () => {
  return (
    <div className="pt-44 pb-32 text-center">
      <Container>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          This Feature Is Coming Soon
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We're working hard to launch this feature as part of our national effort to outsmart colorectal cancer.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">Back to Homepage</Button>
        </Link>
      </Container>
    </div>
  );
};

export default ComingSoonPage;