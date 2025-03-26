import React from 'react';
import styled from 'styled-components';

interface MessageLoaderProps {
  size?: 'small' | 'medium' | 'large';
}

const MessageLoader: React.FC<MessageLoaderProps> = ({ size = 'small' }) => {
  return (
    <StyledWrapper size={size}>
      <section className="dots-container">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </section>
    </StyledWrapper>
  );
}

interface StyledWrapperProps {
  size: 'small' | 'medium' | 'large';
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  .dots-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .dot {
    height: ${props => props.size === 'small' ? '12px' : props.size === 'large' ? '24px' : '20px'};
    width: ${props => props.size === 'small' ? '12px' : props.size === 'large' ? '24px' : '20px'};
    margin-right: ${props => props.size === 'small' ? '6px' : props.size === 'large' ? '12px' : '10px'};
    border-radius: 50%;
    background-color: var(--dot-color, #b3d4fc);
    animation: pulse 1.5s infinite ease-in-out;
  }

  .dot:last-child {
    margin-right: 0;
  }

  .dot:nth-child(1) {
    animation-delay: -0.3s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.1s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.1s;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.8);
      background-color: var(--dot-color-light, #b3d4fc);
      box-shadow: 0 0 0 0 var(--dot-shadow-color, rgba(178, 212, 252, 0.7));
    }

    50% {
      transform: scale(1.2);
      background-color: var(--dot-color-dark, #6793fb);
      box-shadow: 0 0 0 10px var(--dot-shadow-color-fade, rgba(178, 212, 252, 0));
    }

    100% {
      transform: scale(0.8);
      background-color: var(--dot-color-light, #b3d4fc);
      box-shadow: 0 0 0 0 var(--dot-shadow-color, rgba(178, 212, 252, 0.7));
    }
  }

  /* Light/dark mode support using CSS variables */
  @media (prefers-color-scheme: light) {
    --dot-color: #b3d4fc;
    --dot-color-light: #b3d4fc;
    --dot-color-dark: #6793fb;
    --dot-shadow-color: rgba(178, 212, 252, 0.7);
    --dot-shadow-color-fade: rgba(178, 212, 252, 0);
  }

  @media (prefers-color-scheme: dark) {
    --dot-color: #6793fb;
    --dot-color-light: #6793fb;
    --dot-color-dark: #b3d4fc;
    --dot-shadow-color: rgba(103, 147, 251, 0.7);
    --dot-shadow-color-fade: rgba(103, 147, 251, 0);
  }
`;

export default MessageLoader;