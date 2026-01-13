
import React from 'react';

interface BMIGaugeProps {
  bmi: number;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ bmi }) => {
  const min = 15;
  const max = 40;
  const clampedBmi = Math.min(Math.max(bmi, min), max);
  const percentage = ((clampedBmi - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden mt-6 mb-2 border border-white shadow-inner">
      <div 
        className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out flex"
        style={{ width: '100%' }}
      >
        <div className="h-full bg-blue-200" style={{ width: '18.5%' }}></div>
        <div className="h-full bg-green-200" style={{ width: '25%' }}></div>
        <div className="h-full bg-yellow-200" style={{ width: '25%' }}></div>
        <div className="h-full bg-red-200" style={{ width: '31.5%' }}></div>
      </div>
      {/* Fix: Use standard template literals without unnecessary escapes */}
      <div 
        className="absolute top-0 h-10 w-1 bg-gray-800 shadow-lg transition-all duration-1000 ease-out z-10"
        style={{ left: `${percentage}%`, transform: 'translateX(-50%) translateY(-10%)' }}
      ></div>
    </div>
  );
};

export default BMIGauge;
