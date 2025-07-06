import React from 'react';
import { Container } from '../components/ui/Container';
import ChampionSignUp from './signup/ChampionSignUp';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { getDashboardRoute } from '../components/ProtectedRoute';

const JoinMovementPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  // If user is already authenticated, redirect to their dashboard
  if (isAuthenticated && user) {
    const userRole = user.user_metadata?.role || user.app_metadata?.role || 'member';
    const dashboardPath = getDashboardRoute(userRole);
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className="pt-20">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Join the Movement</h1>
            <p className="text-xl mb-0">
              Become a Champion in Singapore's national effort to eliminate colorectal cancer.
            </p>
          </div>
        </Container>
      </div>

      <ChampionSignUp />
    </div>
  );
};

export default JoinMovementPage;