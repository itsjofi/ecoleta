import React from 'react';

//UI
import { FiCheckCircle } from 'react-icons/fi';
import './styles.css';

interface SuccessOverlayProps {
  message: string;
}

const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ message }) => {
  return (
    <div id="overlay">
      <div id="overlay-wrapper">
        <FiCheckCircle id="success-icon" />
        <span id="overlay-text">{message}</span>
      </div>
    </div>
  );
};

export default SuccessOverlay;
