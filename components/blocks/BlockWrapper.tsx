import React from 'react';
import { SectionBlock } from '../../types';
import { Icons } from '../ui/Icons';

interface BlockWrapperProps {
  block: SectionBlock;
  index: number;
  total: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
  isPreview: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  block,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  children,
  isPreview,
  isSelected,
  onClick
}) => {
  if (isPreview) {
    return <div>{children}</div>;
  }

  return (
    <div 
      className={`relative group border-2 transition-all duration-200 mb-4 rounded-lg ${
        isSelected ? 'border-primary ring-2 ring-primary/20 z-20' : 'border-transparent hover:border-gray-300 z-10'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Controls Overlay */}
      <div className={`absolute -top-3 right-4 z-[50] flex gap-1 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}>
        <div className="bg-white shadow-xl rounded-full p-1.5 flex items-center gap-1 border border-gray-200 ring-1 ring-black/5" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <span className="text-[10px] font-bold px-2 text-primary uppercase tracking-wider select-none">{block.type}</span>
          <div className="h-3 w-px bg-gray-300 mx-1"></div>
          
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onMoveUp(index); }} 
            disabled={index === 0}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 disabled:opacity-30 transition-colors"
            title="Naik Atas"
          >
            <Icons.ArrowUp size={14} />
          </button>
          
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); onMoveDown(index); }} 
            disabled={index === total - 1}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-700 disabled:opacity-30 transition-colors"
            title="Turun Bawah"
          >
            <Icons.ArrowDown size={14} />
          </button>
          
          <div className="h-3 w-px bg-gray-300 mx-1"></div>

          <button 
            type="button"
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              onDelete(block.id); 
            }} 
            onMouseDown={(e) => e.stopPropagation()}
            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors active:bg-red-200"
            title="Padam Widget Ini"
          >
            <Icons.Trash2 size={14} />
          </button>
        </div>
      </div>
      
      {/* Block Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
};