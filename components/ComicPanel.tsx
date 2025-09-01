import React from 'react';
import { ComicPanelData } from '../types';

interface ComicPanelProps {
  panelData: ComicPanelData;
}

const ComicPanel: React.FC<ComicPanelProps> = ({ panelData }) => {
  return (
    <div className="bg-white border-4 border-black shadow-lg flex flex-col transform -rotate-1 hover:rotate-0 transition-transform duration-200">
      <div className="relative w-full aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
        {panelData.imageUrl ? (
          <img src={panelData.imageUrl} alt={panelData.description} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-500">Generando...</div>
        )}
        <div className="absolute top-1 left-1 bg-yellow-300 text-black font-display text-2xl w-8 h-8 flex items-center justify-center border-2 border-black">
          {panelData.panel}
        </div>
      </div>
      <div className="p-3 bg-white border-t-4 border-black">
        <p className="text-black text-center font-semibold text-sm leading-tight">
          {panelData.dialogue}
        </p>
      </div>
    </div>
  );
};

export default ComicPanel;
