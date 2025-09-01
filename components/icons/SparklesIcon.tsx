import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    <path d="M4.5 4.5L6 9L11.5 10.5L6 12L4.5 16.5L3 12L-2.5 10.5L3 9L4.5 4.5Z" />
    <path d="M18 6L19.5 10L24 11.5L19.5 13L18 17L16.5 13L12 11.5L16.5 10L18 6Z" />
  </svg>
);

export default SparklesIcon;
