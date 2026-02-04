import React from 'react';
import { SectionBlock, BlockWidth } from '../../types';
import { Icons } from '../ui/Icons';

interface BlockWrapperProps {
  block: SectionBlock;
  index: number;
  total: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  onUpdateWidth: (id: string, width: BlockWidth) => void;
  children: React.ReactNode;
  isPreview: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const widthOptions: { label: string, value: BlockWidth, icon: any }[] = [
  { label: '25%', value: 'w-1/4', icon: Icons.Columns },
  { label: '33%', value: 'w-1/3', icon: Icons.Columns },
  { label: '50%', value: 'w-1/2', icon: Icons.Columns },
  { label: '66%', value: 'w-2/3', icon: Icons.Columns },
  { label: '75%', value: 'w-3/4', icon: Icons.Columns },
  { label: '100%', value: 'w-full', icon: Icons.Layout },
];

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  block,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdateWidth,
  children,
  isPreview,
  isSelected,
  onClick
}) => {
  // Map internal width values to Tailwind classes
  // Default to w-full if undefined
  const widthClass = block.width || 'w-full';

  // Mobile always full width, desktop respects the setting
  const containerClass = isPreview 
    ? `relative ${widthClass === 'w-full' ? 'w-full' : 'w-full md:' + widthClass}`
    : `relative group transition-all duration-200 mb-0 p-1 ${widthClass === 'w-full' ? 'w-full' : 'w-full md:' + widthClass}`;

  // Allow overflow for navbar to let dropdowns show
  const allowOverflow = block.type === 'navbar';

  if (isPreview) {
    return <div className={containerClass}>{children}</div>;
  }

  return (
    <div 
      className={`${containerClass} z-10`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className={`h-full border-2 rounded-lg transition-all relative bg-white ${isSelected ? 'border-primary ring-2 ring-primary/20 z-20 shadow-lg' : 'border-transparent hover:border-dashed hover:border-gray-300'}`}>
        
        {/* Controls Overlay */}
        <div className={`absolute -top-3 right-2 z-[50] flex flex-col items-end gap-1 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}>
          
          <div className="bg-white shadow-xl rounded-full p-1.5 flex items-center gap-1 border border-gray-200 ring-1 ring-black/5" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-bold px-2 text-primary uppercase tracking-wider select-none max-w-[80px] truncate">{block.type}</span>
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

          {/* Width Controls (Only show if selected to reduce clutter) */}
          {isSelected && (
             <div className="bg-white shadow-xl rounded-lg p-1 flex items-center gap-1 border border-gray-200 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1" onClick={(e) => e.stopPropagation()}>
                {widthOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdateWidth(block.id, opt.value)}
                    className={`px-2 py-1 text-[10px] font-bold rounded ${block.width === opt.value || (!block.width && opt.value === 'w-full') ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    title={`Lebar: ${opt.label}`}
                  >
                    {opt.label}
                  </button>
                ))}
             </div>
          )}

        </div>
        
        {/* Block Content */}
        <div className={`relative z-0 h-full rounded-lg ${allowOverflow ? '' : 'overflow-hidden'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};