
import React from 'react';
import { ConversionStep } from '../types';

interface StepIndicatorProps {
  steps: ConversionStep[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  return (
    <div className="flex flex-col gap-4">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
            step.status === 'completed' ? 'bg-green-500/20 border-green-500 text-green-500' :
            step.status === 'loading' ? 'bg-blue-500/20 border-blue-500 text-blue-500' :
            step.status === 'error' ? 'bg-red-500/20 border-red-500 text-red-500' :
            'bg-slate-800 border-slate-700 text-slate-500'
          }`}>
            {step.status === 'completed' ? '✓' : 
             step.status === 'loading' ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : 
             step.status === 'error' ? '!' : '●'}
          </div>
          <span className={`font-medium ${
            step.status === 'pending' ? 'text-slate-500' : 'text-slate-200'
          }`}>{step.label}</span>
        </div>
      ))}
    </div>
  );
};
