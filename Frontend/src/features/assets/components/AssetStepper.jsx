import React from 'react';
import { Check } from 'lucide-react';

const stepsConfig = [
  { number: 1, title: 'Asset Information', desc: 'Basic details of the asset' },
  { number: 2, title: 'Additional Details', desc: 'More information' },
  { number: 3, title: 'Assign & Location', desc: 'Where and to whom' },
  { number: 4, title: 'Review & Submit', desc: 'Confirm and save' },
];

export default function AssetStepper({ currentStep = 1 }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex items-center justify-between w-full overflow-x-auto no-scrollbar gap-6 select-none">
      {stepsConfig.map((step, idx) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        
        return (
          <React.Fragment key={step.number}>
            {/* Step Element */}
            <div className="flex items-center gap-3.5 flex-shrink-0">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border
                  ${isCompleted
                    ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#16A34A]'
                    : isActive
                      ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/20 scale-105'
                      : 'bg-white border-[#E5E7EB] text-[#9CA3AF]'
                  }
                `}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.number}
              </div>

              {/* Title & Info */}
              <div className="flex flex-col">
                <span
                  className={`text-xs font-black transition-colors duration-300
                    ${isActive ? 'text-[#7C3AED]' : isCompleted ? 'text-[#16A34A]' : 'text-[#475569]'}
                  `}
                >
                  {step.title}
                </span>
                <span className="text-[10px] font-bold text-[#9CA3AF] mt-0.5 whitespace-nowrap">
                  {step.desc}
                </span>
              </div>
            </div>

            {/* Connecting Dotted Line */}
            {idx < stepsConfig.length - 1 && (
              <div className="flex-1 min-w-[32px] border-t-2 border-dashed border-[#E5E7EB]" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
