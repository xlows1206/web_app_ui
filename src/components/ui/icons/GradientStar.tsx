import React from 'react';

interface GradientStarProps {
  size?: number;
  className?: string;
}

export default function GradientStar({ size = 20, className = "" }: GradientStarProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 1024 1024" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="credit-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="50%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <path 
        d="M0.351758 489.071763c183.361939 33.576916 308.140154 80.520642 374.142777 140.703267 66.066579 60.24658 104.312285 184.385235 114.737118 372.415964 13.110986-189.181937 50.141528-313.256636 111.155581-372.415964 61.014053-59.095372 186.943476-106.039098 377.724314-140.703267-194.234464-13.68659-320.163887-47.775155-377.724314-102.329648-57.560427-54.490538-94.654925-183.170071-111.155581-386.038599-12.471426 207.729186-50.717132 336.408719-114.737118 386.038599-63.95603 49.629879-188.670289 83.7824-374.142777 102.329648z" 
        fill="url(#credit-icon-gradient)" 
        fillOpacity="1"
      />
    </svg>
  );
}
