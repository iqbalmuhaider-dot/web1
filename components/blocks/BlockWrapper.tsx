import React from 'react';
import { SectionBlock, BlockWidth, BlockPadding } from '../../types';
import { Icons } from '../ui/Icons';

interface BlockWrapperProps {
  block: SectionBlock;
  index: number;
  total: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
  onUpdateWidth: (id: string, width: BlockWidth) => void;
  onUpdatePadding: (id: string, padding: BlockPadding) => void;
  children: React.ReactNode;
  isPreview: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const widthOptions: { label: string, value: BlockWidth }[] = [
  { label: '25%', value: 'w-1/4' },
  { label: '33%', value: 'w-1/3' },
  { label: '50%', value: 'w-1/2' },
  { label: '66%', value: 'w-2/3' },
  { label: '75%', value: 'w-3/4' },
  { label: '100%', value: 'w-full' },
];

const paddingOptions: { label: string, value: BlockPadding }[] = [
  { label: '0px', value: 'py-0' },
  { label: 'S', value: 'py-4' },
  { label: 'M', value: 'py-12' },
  { label: 'L', value: 'py-20' },
  { label: 'XL', value: 'py-32' },
];

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  block,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdateWidth,
  onUpdatePadding,
  children,
  isPreview,
  isSelected,
  onClick
}) => {
  // Map internal width values to Tailwind classes
  // Default to w-full if undefined
  const widthClass = block.width || 'w-full';
  
  // Padding class, default to py-0 (inner renderers usually handle default padding, 
  // but if we use Wrapper for padding, renderers should ideally have less padding)
  // For backward compatibility, let's assume wrappers add EXTRA padding or override.
  // Actually, to make "Tinggi/Rendah" work, we apply this to the container.
  const paddingClass = block.padding || 'py-0';

  // Mobile always full width, desktop respects the setting
  const containerClass = isPreview 
    ? `relative ${widthClass === 'w-full' ? 'w-full' : 'w-full md:' + widthClass} ${paddingClass}`
    : `relative group transition-all duration-200 mb-0 p-1 ${widthClass === 'w-full' ? 'w-full' : 'w-full md:' + widthClass} ${paddingClass}`;

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

          {/* Width & Padding Controls (Only show if selected) */}
          {isSelected && (
             <div className="flex flex-col gap-1 items-end animate-in fade-in slide-in-from-top-1">
                {/* Width */}
                <div className="bg-white shadow-xl rounded-lg p-1 flex items-center gap-1 border border-gray-200 ring-1 ring-black/5" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[9px] font-bold text-gray-400 px-1"><Icons.Columns size={10}/></span>
                    {widthOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => onUpdateWidth(block.id, opt.value)}
                        className={`px-1.5 py-1 text-[9px] font-bold rounded ${block.width === opt.value || (!block.width && opt.value === 'w-full') ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        title={`Lebar: ${opt.label}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                </div>
                {/* Height/Padding */}
                <div className="bg-white shadow-xl rounded-lg p-1 flex items-center gap-1 border border-gray-200 ring-1 ring-black/5" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[9px] font-bold text-gray-400 px-1"><Icons.ChevronsUp size={10}/></span>
                    {paddingOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => onUpdatePadding(block.id, opt.value)}
                        className={`px-1.5 py-1 text-[9px] font-bold rounded ${block.padding === opt.value ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        title={`Tinggi: ${opt.label}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                </div>
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