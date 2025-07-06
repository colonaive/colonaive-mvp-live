import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useChampionChoice = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChoice = (type: 'gp' | 'specialist' | 'screening', hasDoctor: boolean) => {
    if (hasDoctor) {
      setShowModal(false);
      navigate('/');
    } else {
      setShowModal(false);
      switch (type) {
        case 'gp':
          navigate('/clinics');
          break;
        case 'specialist':
          navigate('/clinics');
          break;
        case 'screening':
          navigate('/choose-screening');
          break;
      }
    }
  };

  return {
    showModal,
    setShowModal,
    handleChoice
  };
};