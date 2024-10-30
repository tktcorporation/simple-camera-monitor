import React from 'react';

interface ResolutionSelectorProps {
  resolution: '4k' | 'fhd';
  onResolutionChange: (resolution: '4k' | 'fhd') => void;
}

export function ResolutionSelector({ resolution, onResolutionChange }: ResolutionSelectorProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-800 p-2">
      <button
        onClick={() => onResolutionChange('fhd')}
        className={`rounded-md px-3 py-1 transition-colors ${
          resolution === 'fhd' ? 'bg-blue-600' : 'hover:bg-gray-700'
        }`}
      >
        FHD
      </button>
      <button
        onClick={() => onResolutionChange('4k')}
        className={`rounded-md px-3 py-1 transition-colors ${
          resolution === '4k' ? 'bg-blue-600' : 'hover:bg-gray-700'
        }`}
      >
        4K
      </button>
    </div>
  );
}